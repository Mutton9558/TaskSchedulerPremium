import "./App.css";
import Header2 from "./components/Header2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Activities() {
  const navigate = useNavigate();
  const sessionUser = localStorage.getItem("User");

  useEffect(() => {
    if (!sessionUser) {
      navigate("/login");
    }
  }, []);
  const [displayType, setDisplayType] = useState("Weekly");
  const time: string[] = [];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const period = ["AM", "PM"];
  for (let j = 0; j < 2; j++) {
    for (let i = 12; i < 24; i++) {
      time.push(`${(i % 12).toString()}${period[j]}`);
    }
  }
  time[0] = "12AM";

  return (
    <>
      <Header2 />
      <div id="top-sec-activities">
        <h1>My Activities</h1>
        <div id="display-type">
          <button onClick={() => setDisplayType("Weekly")}>
            Weekly Schedule
          </button>
          <button onClick={() => setDisplayType("List")}>Schedule List</button>
        </div>
        <div id="activities-sec">
          <div
            id="weekly"
            style={{
              display: `${displayType === "Weekly" ? "block" : "none"}`,
            }}
          >
            <table id="activity-table">
              <tr>
                <th>Day</th>
                {time.map((item, index) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
              {days.map((day) => (
                <tr>
                  <td>{day}</td>
                  {time.map((item) => (
                    <td id={`${item}-${day}`}></td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
          <div
            id="list"
            style={{
              display: `${displayType === "List" ? "block" : "none"}`,
            }}
          >
            <h1>list</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Activities;
