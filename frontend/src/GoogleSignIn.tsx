import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function GoogleSignIn() {
  const navigate = useNavigate();
  const handleSuccess = async (response: any) => {
    console.log("Google login success:", response);

    const res = await fetch("http://localhost:5000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Backend response:", data);
      localStorage.setItem("User", data.username);
      navigate("/");
    } else {
      console.log("Error");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login failed")}
    />
  );
}

export default GoogleSignIn;
