import { useState, useEffect } from "react";
import "../App.css";

const Header = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const getCurDate = () => {
      var dateToday = new Date();
      var day = String(dateToday.getDate()).padStart(2, "0");
      var month = dateToday.toLocaleString("default", { month: "long" }); //January is 0!
      var year = dateToday.getFullYear();

      setDate(`${day} ${month} ${year}`);
    };

    return getCurDate();
  }, []);

  return (
    <>
      <div id="header-page">
        <h2 className="inline-text" style={{ fontSize: "36px" }}>
          Today's
          <span className="coloured-text-wave">
            <h1 style={{ margin: 0 }}>DATE</h1>
          </span>
          :
        </h2>
        <h3 id="date-header">{date}</h3>
      </div>
    </>
  );
};

export default Header;
