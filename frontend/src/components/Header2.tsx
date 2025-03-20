import "../App.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header2() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetTab = location.pathname === "/Activities" ? "Activities" : "Main";

  function redirectToMain() {
    navigate("/");
  }

  function redirectToActivities() {
    navigate("/Activities");
  }

  function logOut() {
    localStorage.removeItem("User");
    navigate("/login");
  }

  return (
    <>
      <div className="nav-bar">
        <div id="nav-left">
          <p className="header-text">Task Scheduler Premium</p>
        </div>
        <div id="nav-right">
          <div id="redirect-items">
            <button
              onClick={redirectToMain}
              className={`redirect-btn ${
                targetTab === "Main" ? "cur-page" : ""
              }`}
            >
              Add Tasks
            </button>
            <button
              onClick={redirectToActivities}
              className={`redirect-btn ${
                targetTab === "Activities" ? "cur-page" : ""
              }`}
            >
              Activities
            </button>
            <button onClick={logOut} className="redirect-btn">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header2;
