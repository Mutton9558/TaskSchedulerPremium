import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Submit = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const sendStoredData = async () => {
      const activityData = localStorage.getItem("pendingActivity");

      if (activityData) {
        const parsedData = JSON.parse(activityData);

        const response = await fetch("http://localhost:5000/addtask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        });

        if (response.ok) {
          console.log("Event successfully added!");
          localStorage.removeItem("pendingActivity"); // Clear data after submission
          navigate("/", {
            state: {
              message: "Event successfully added to your Google Calendar!",
              type: "success",
            },
          });
        } else {
          console.error("Failed to add event");
          navigate("/", {
            state: {
              message: "Failed to add event to your Google Calendar.",
              type: "error",
            },
          });
        }
      }
    };

    sendStoredData();
  }, []);

  return <p>Submitting event...</p>;
};

export default Submit;
