import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignIn from "./GoogleSignIn";
import OrSeparator from "./components/orSeparator";
import InputBox from "./components/InputBox";
const googleClientId = import.meta.env.VITE_GOOGLE;

function Register() {
  const navigate = useNavigate();
  const isUser = localStorage.getItem("User");
  const [userData, setUserData] = useState({
    userDataUsername: "",
    userDataPassword: "",
    userDataEmail: "",
  });

  const sendData = async () => {
    const response = await fetch("http://localhost:5000/confirm_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const res = await response.json();
      const flashedMsg = document.getElementById("flashed-msg-register");
      if (flashedMsg) {
        if (res.Success) {
          flashedMsg.classList.add("success");
          flashedMsg.innerHTML = res.Success;
        } else {
          flashedMsg.classList.add("error");
          if (res.UsernameError) {
            (
              document.getElementsByName("Username")[0] as HTMLInputElement
            ).classList.add("input-error");
            flashedMsg.innerHTML = res.UsernameError;
          } else if (res.EmailError) {
            (
              document.getElementsByName("Email")[0] as HTMLInputElement
            ).classList.add("input-error");
            flashedMsg.innerHTML = res.EmailError;
          } else if (res.Error) {
            flashedMsg.innerHTML = res.Error;
          }
        }
      }
    }
  };

  function submitRegistration(e: { preventDefault: () => void }) {
    e.preventDefault();
    const username = (
      document.getElementsByName("Username")[0] as HTMLInputElement
    ).value;
    const password = (
      document.getElementsByName("Password")[0] as HTMLInputElement
    ).value;
    const email = (document.getElementsByName("Email")[0] as HTMLInputElement)
      .value;

    setUserData((prevUserData) => ({
      ...prevUserData,
      userDataUsername: username,
      userDataPassword: password,
      userDataEmail: email,
    }));
  }

  useEffect(() => {
    if (
      userData.userDataUsername &&
      userData.userDataPassword &&
      userData.userDataEmail
    ) {
      sendData();
    }
  }, [userData]);

  useEffect(() => {
    if (isUser) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <div id="register-page">
          <h1>
            New to{" "}
            <span className="coloured-text-wave">Task Scheduler Premium?</span>
          </h1>
          <p>Register Now!</p>
          <p id="flashed-msg-register" className="flashed-message"></p>
          <form id="register-form" onSubmit={submitRegistration}>
            <div id="content">
              <InputBox
                type="text"
                placeholder="Enter a Username (within 20 characters)"
                name="Username"
                required={true}
              ></InputBox>
              <InputBox
                type="password"
                placeholder="Enter a Password (within 16 characters)"
                name="Password"
                required={true}
              ></InputBox>
              <InputBox
                type="text"
                placeholder="Enter your Email"
                name="Email"
                required={true}
              ></InputBox>
            </div>
            <div id="reg-form-btn">
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
          </form>
          <p>
            Already have an account?
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}

export default Register;
