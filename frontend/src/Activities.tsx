import "./App.css";
import Header2 from "./components/Header2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const sessionUser = localStorage.getItem("User");

function isDateinCurrentWeek(dateString: string | number | Date) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Move to Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  if (inputDate >= startOfWeek && inputDate <= endOfWeek) {
    return days[inputDate.getDay()];
  } else {
    return null;
  }
}

const getActivityList = async () => {
  const response = await fetch("http://localhost:5000/get_activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: sessionUser }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    console.log("Fail");
  }
};

function Activities() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) {
      navigate("/login");
    } else {
      const fetchActivities = async () => {
        try {
          const activityList = await getActivityList(); // Wait for the async function
          console.log(activityList);
          const keyList = Object.keys(activityList);

          for (let i = 0; i < keyList.length; i++) {
            const activity = activityList[keyList[i]];
            const activityDay = isDateinCurrentWeek(activity.date);
            console.log(activity.name);
            if (activityDay) {
              console.log("Activity in current week:", activity.name);
              const startHour = parseInt(activity.start_time.split(":")[0]);
              const endHour = parseInt(activity.end_time.split(":")[0]);
              const startMin = parseInt(activity.start_time.split(":")[1]) / 60;
              const endMin = parseInt(activity.end_time.split(":")[1]) / 60;
              const hourDiff = endHour - startHour;
              const width = hourDiff + (endMin - startMin);

              let finalStartHourString;
              if (startHour >= 12) {
                finalStartHourString = `${
                  startHour % 12 === 0 ? "12PM" : `${startHour % 12}PM`
                }`;
              } else {
                finalStartHourString = `${
                  startHour % 12 === 0 ? "12AM" : `${startHour % 12}AM`
                }`;
              }

              const finalStartHour = document.getElementById(
                `${finalStartHourString}-${activityDay}`
              );
              const btn = finalStartHour?.getElementsByTagName("button")[0];
              if (btn) {
                btn.classList.add("show-activity-btn");
                btn.style.width = `${width * 103.25}%`;
                btn.style.left = `${startMin * 100}%`;
                btn.innerHTML = `${activity.name}`;
                btn.title = `${activity.name}`;
              }
            }
          }
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      };
      fetchActivities();
    }
  }, []);
  const [displayType, setDisplayType] = useState("Weekly");
  const time: string[] = [];

  const period = ["AM", "PM"];
  for (let j = 0; j < 2; j++) {
    for (let i = 12; i < 24; i++) {
      time.push(`${(i % 12).toString()}${period[j]}`);
    }
  }
  time[0] = "12AM";
  time[12] = "12PM";

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
            <h1>This Week's Activities:</h1>
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
                    <td id={`${item}-${day}`} className="td-day-time">
                      <button
                        className="activity-btn"
                        onClick={() => {
                          console.log("Pressed");
                        }}
                      ></button>
                    </td>
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
