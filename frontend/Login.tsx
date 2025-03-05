import "./App.css";
import InputBox from "./components/InputBox";

function Login() {
  return (
    <>
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
          <button>Login with Google</button>
        </div>
      </form>
    </>
  );
}

export default Login;
