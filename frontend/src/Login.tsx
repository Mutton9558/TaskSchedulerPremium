import "./App.css";
import InputBox from "./components/InputBox";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignIn from "./GoogleSignIn";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header3 from "./components/Header3";
import OrSeparator from "./components/orSeparator";

function Login() {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE;
  const isUser = localStorage.getItem("User");
  useEffect(() => {
    if (isUser) {
      navigate("/");
    }
  }, []);

  const loginInfo = {
    username: "",
    password: "",
  };

  function getLoginInfo(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log("Get Login");
    const attemptedUsername = (
      document.getElementsByName("Username")[0] as HTMLInputElement
    ).value;
    const attemptedPassword = (
      document.getElementsByName("Password")[0] as HTMLInputElement
    ).value;
    if (attemptedUsername && attemptedPassword) {
      loginInfo.username = attemptedUsername;
      loginInfo.password = attemptedPassword;
    }

    sendLoginInfo();
  }

  const sendLoginInfo = async () => {
    const response = await fetch("http://localhost:5000/user_auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginInfo),
    });

    if (response.ok) {
      const res = await response.json();
      const popup_msg = document.getElementById("pop-up-login");
      const non_header_content = document.getElementById(
        "non-header-login-content"
      );
      if (popup_msg && non_header_content) {
        if (res.Error) {
          popup_msg.classList.add("error");
          popup_msg.innerHTML = res.Error;
          non_header_content.style.marginTop = "6.5rem";
        } else {
          localStorage.setItem(
            "User",
            (document.getElementsByName("Username")[0] as HTMLInputElement)
              .value
          );
          navigate("/");
        }
      }
    }
  };

  return (
    <div id="login-page">
      <Header3></Header3>
      <div id="non-header-login-content">
        <GoogleOAuthProvider clientId={googleClientId}>
          <p id="pop-up-login" className="flashed-message"></p>
          <form id="login-cont" onSubmit={getLoginInfo}>
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
              <OrSeparator></OrSeparator>
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
    </div>
  );
}

export default Login;
