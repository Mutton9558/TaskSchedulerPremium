import "./App.css";
import InputBox from "./components/InputBox";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignIn from "./GoogleSignIn";

function Login() {
  const googleClientId = import.meta.env.VITE_GOOGLE;
  console.log(googleClientId);
  console.log(localStorage.getItem("User"));
  return (
    <>
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
            />
            <InputBox type="password" placeholder="Password" name="Password" />
          </div>
          <div id="login-bottom-sec">
            <InputBox type="submit" placeholder="" name="submit"></InputBox>
            <div id="buffer-login">
              <span>or</span>
            </div>
            <GoogleSignIn />
          </div>
        </form>
      </GoogleOAuthProvider>
    </>
  );
}

export default Login;
