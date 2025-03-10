import "./App.css";
import InputBox from "./components/InputBox";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignIn from "./GoogleSignIn";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE;
  console.log(googleClientId);
  console.log(localStorage.getItem("User"));
  return (
    <div id="login-page">
      <GoogleOAuthProvider clientId={googleClientId}>
        <form id="login-cont">
          <div id="login-top-sec">
            <h1>Login</h1>
            <p>Never Miss A Task Again</p>
          </div>
          <div id="login-inputs">
            <InputBox
              type="text"
              placeholder="Enter your Username"
              name="Username"
              required={true}
            />
            <InputBox
              type="password"
              placeholder="Enter Password"
              name="Password"
              required={true}
            />
          </div>
          <div id="login-bottom-sec">
            <InputBox
              type="submit"
              placeholder=""
              name="submit"
              required={false}
            ></InputBox>
            <div id="buffer-login">
              <span>or</span>
            </div>
            <div className="google-input">
              <GoogleSignIn />
            </div>
          </div>
          <div id="new-register">
            <p>New to Task Scheduler?</p>
            <button
              onClick={() => {
                navigate("/register");
              }}
            >
              Create an account now!
            </button>
          </div>
        </form>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Login;
