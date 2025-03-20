from flask import Flask, redirect, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from email.mime.text import MIMEText 
from email.mime.image import MIMEImage 
from email.mime.multipart import MIMEMultipart 
import smtplib 
from datetime import timedelta, datetime
import requests
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Load environment variables
load_dotenv('.env')

# Initialize Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tsp.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")  # Required for session management
CORS(app, supports_credentials=True)

# Google API settings
SCOPES = ['https://www.googleapis.com/auth/calendar']
CLIENT_SECRET_FILE = "client_secret.json"
REDIRECT_URI = "http://localhost:5000/oauth/authorize"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column("id", db.Integer, primary_key = True, autoincrement=True, unique=True)
    username = db.Column("username", db.String(20), nullable=False, unique=True)
    password = db.Column("password", db.String(16), nullable=False, unique=False)
    email = db.Column("email", db.String(255), nullable=False, unique=True)
    activities = db.relationship('Activities', backref = 'user', lazy=True)

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

class Activities(db.Model):
    activity_id = db.Column("activity_id", db.Integer, primary_key = True, autoincrement = True, unique=True)
    activity_name = db.Column("activity_name", db.String(255), nullable=False, unique=False)
    activity_date = db.Column("activity_date", db.String(40), nullable=False, unique=False)
    activity_start_time = db.Column("activity_start_time", db.String(5), nullable=False, unique=False)
    activity_end_time = db.Column("activity_end_time", db.String(5), nullable=False, unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, activity_name, activity_date, activity_start_time, activity_end_time, user_id):
        self.activity_name = activity_name
        self.activity_date = activity_date
        self.activity_start_time = activity_start_time
        self.activity_end_time = activity_end_time
        self.user_id = user_id

@app.route("/login_google")
def login():
    flow = Flow.from_client_secrets_file(CLIENT_SECRET_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI)
    auth_url, state = flow.authorization_url(prompt="consent")
    session["state"] = state
    return redirect(auth_url)

@app.route("/auth/google", methods=["POST", "GET"])
def google_login():
    try:
        data = request.json
        token = data.get("token")
        if not token:
            return jsonify({"status": "error", "message": "Missing token"}), 400
        response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
        id_info = response.json()
        if id_info["aud"] != GOOGLE_CLIENT_ID:
            return jsonify({"status": "error", "message": "Token audience mismatch"}), 400
        # Extract user info
        username = id_info.get("name")
        user_token = id_info.get("sub")
        user_email = id_info.get("email")

        if (not Users.query.filter_by(username=username).first()):
            new_user = Users(username=username, password=user_token, email=user_email)
            db.session.add(new_user)
            db.session.commit()
        return jsonify({"status": "success", "email": user_email, "username": username}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/oauth/authorize")
def oauth_callback():
    state = session.get("state")
    flow = Flow.from_client_secrets_file(CLIENT_SECRET_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI, state=state)
    flow.fetch_token(authorization_response=request.url)

    # Save credentials
    creds = flow.credentials
    with open("token.json", "w") as token:
        token.write(creds.to_json())

    return redirect("http://localhost:5173/submit-after-login")

@app.route("/addtask", methods=["POST"])
def add_task():
    data = request.json
    activity_date = data.get('activityDate')
    activity_name = data.get('activityName')
    activity_start_time = data.get('activityStartTime')
    activity_end_time = data.get('activityEndTime')
    user_timezone = data.get("userTimeZone")
    user = data.get("user")
    user_id = Users.query.filter_by(username=user).first().id

    if not (activity_date and activity_name):
        return jsonify({"message": "Missing fields"}), 400

    if not (activity_start_time):
        activity_start_time = "00:00"
    
    if not (activity_end_time):
        activity_end_time = "23:59"

    # Load credentials
    if not os.path.exists("token.json"):
        return jsonify({"message": "User is not authenticated"}), 401

    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    service = build("calendar", "v3", credentials=creds)

    def format_google_calendar_time(date_str, time_str):
        # Convert date and time to Google Calendar's ISO 8601 format.
        combined = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        return combined.isoformat()

    event = {
        "summary": activity_name,
        "start": {"dateTime": format_google_calendar_time(activity_date, activity_start_time), "timeZone": user_timezone},
        "end": {"dateTime": format_google_calendar_time(activity_date, activity_end_time), "timeZone": user_timezone},
    }

    event = service.events().insert(calendarId="primary", body=event).execute()

    new_activity = Activities(activity_name=activity_name, activity_date=activity_date, activity_start_time=activity_start_time, activity_end_time=activity_end_time, user_id=user_id)
    db.session.add(new_activity)
    db.session.commit()

    return jsonify({"message": "Event created", "eventId": event["id"]}), 200

@app.route("/confirm_user", methods=["GET", "POST"])
def confirm_user():
    try:
        data = request.json
        user_username = data.get("userDataUsername")
        user_password = data.get("userDataPassword")
        user_email = data.get("userDataEmail")
        if Users.query.filter_by(username=user_username).first():
            return jsonify({"UsernameError": "Username Already In Use"})
        elif Users.query.filter_by(email=user_email).first():
            return jsonify({"EmailError": "Email Already In Use"})
        else:
            new_user = Users(username=user_username, password=user_password, email=user_email)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"Success": "New Account Created Successfully"})
    except Exception as e:
        return jsonify({"Error": f"{e}"})
    
@app.route("/user_auth", methods=["GET", "POST"])
def user_auth():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        found_user = Users.query.filter_by(username=username).first()
        if found_user and found_user.password == password:
            return jsonify({"Success": "Successfully Login"})
        else:
            return jsonify({"Error": "Username or Password incorrect!"})
    except Exception as e:
        return jsonify({"Error": e})

@app.route("/get_activities", methods=["GET", "POST"])
def get_activities():
    try:
        data = request.json
        username = data.get("username")
        user_id = Users.query.filter_by(username=username).first().id
        activityList = Activities.query.filter_by(user_id=user_id).all()
        activities = {}
        for a in activityList:
            activities[a.activity_id] = {}
            activities[a.activity_id]["name"] = a.activity_name
            activities[a.activity_id]["date"] = a.activity_date
            activities[a.activity_id]["start_time"] = a.activity_start_time
            activities[a.activity_id]["end_time"] = a.activity_end_time
        return jsonify(activities)
    except Exception as e:
        return jsonify({"Error": e})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)
