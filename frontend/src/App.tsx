import "./App.css";
import Header from "./components/Header";
import Header2 from "./components/Header2";
import CheckSession from "./components/CheckSession";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<string | null>(null);

  useEffect(() => {
    <CheckSession onSessionCheck={setSessionUser} />;
    if (sessionUser == null) {
      navigate("/login");
    }
  }, []);

  const [formData, setFormData] = useState({
    activityDate: "",
    activityName: "",
    activityStartTime: "00:00",
    activityEndTime: "23:59",
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messageBox = document.querySelector("#pop-up-msg");
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    if (location.state?.type == "error") {
      messageBox?.classList.add("error");
    } else if (location.state?.type == "success") {
      messageBox?.classList.add("success");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name == "activityEndTime") {
      if (value < formData.activityStartTime) {
        console.log("invalid");
        return;
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    localStorage.setItem("pendingActivity", JSON.stringify(formData));
    window.location.href = "http://localhost:5000/login_google";
  };

  return (
    <>
      <Header2 />
      <Header />
      <div id="pop-up-area">
        <p id="pop-up-msg" className="flashed-message">
          {message}
        </p>
      </div>
      <div id="items-cont">
        <form id="task-form" onSubmit={handleLogin}>
          <h1>Add an event!</h1>
          <div id="input-forms">
            <span className="inline-items">
              <h3>Acitivity Date:</h3>
              <input
                type="date"
                name="activityDate"
                value={formData.activityDate}
                onChange={handleChange}
                required
              />
            </span>
            <span className="inline-items">
              <h3>Activity Name:</h3>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
                placeholder="Enter your event!"
                required
              />
            </span>
            <span className="inline-items">
              <h3>Start Time:</h3>
              <input
                type="time"
                name="activityStartTime"
                value={formData.activityStartTime}
                onChange={handleChange}
              />
            </span>
            <span className="inline-items">
              <h3>End Time:</h3>
              <input
                type="time"
                id="end-time"
                name="activityEndTime"
                value={formData.activityEndTime}
                min={formData.activityStartTime}
                onChange={handleChange}
              />
            </span>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
