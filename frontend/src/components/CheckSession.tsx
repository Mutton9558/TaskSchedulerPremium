import { useEffect } from "react";

function CheckSession({
  onSessionCheck,
}: {
  onSessionCheck: (user: string | null) => void;
}) {
  useEffect(() => {
    const getSession = async () => {
      const response = await fetch("http://localhost:5000/check_session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("fetch data success");
        const userData = await response.json();
        if (userData) {
          if (userData["status"] == "success") {
            onSessionCheck(userData["user"]);
          } else {
            onSessionCheck(null);
          }
        }
      }
    };
    getSession();
  }, [onSessionCheck]);

  return null;
}

export default CheckSession;
