from flask import Flask, redirect, request, jsonify, session
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from datetime import timedelta, datetime
import requests
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Load environment variables
load_dotenv('.env')

# Initialize Flask
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")  # Required for session management
CORS(app, supports_credentials=True)

# Google API settings
SCOPES = ['https://www.googleapis.com/auth/calendar']
CLIENT_SECRET_FILE = "client_secret.json"
REDIRECT_URI = "http://localhost:5000/oauth/authorize"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

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
        user_email = id_info.get("email")
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

    if not (activity_date and activity_name):
        return jsonify({"message": "Missing fields"}), 400

    if not (activity_start_time):
        activity_start_time = "00:00"
    
    if not (activity_end_time):
        activity_end_time = "23:59"

    print(f"start: {activity_start_time}, end: {activity_end_time}")

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

    return jsonify({"message": "Event created", "eventId": event["id"]}), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
