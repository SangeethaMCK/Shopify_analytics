import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();
  const [interval, setInterval] = useState(localStorage.getItem('interval') || 'Monthly');
  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    localStorage.setItem('interval', newInterval);
  };
  
  return (
    <div>
      <h1>Shopify Sales Analytics</h1>
      <div className="dropdown">
        <button className="dropbtn">
          Select Interval <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>{" "}
          <br />({interval})
        </button>
        <div className="dropdown-content">
          <a onClick={() => handleIntervalChange("daily")}>Daily</a>
          <a onClick={() => handleIntervalChange("monthly")}>Monthly</a>
          <a onClick={() => handleIntervalChange("quarterly")}>Quarterly</a>
          <a onClick={() => handleIntervalChange("yearly")}>Yearly</a>
        </div>
      </div>
      <ul>
        <li
          onClick={() => navigate("/salesOverTime")}
          style={{ cursor: "pointer" }}
        >
          Total Sales Over Time
        </li>
        <li
          onClick={() => navigate("/salesGrowthRateOverTime")}
          style={{ cursor: "pointer" }}
        >
          Sales Growth Rate Over Time
        </li>
        <li
          onClick={() => navigate("/newCustomers")}
          style={{ cursor: "pointer" }}
        >
          New Customers Over Time
        </li>
        <li
          onClick={() => navigate("/repeatCustomers")}
          style={{ cursor: "pointer" }}
        >
          Repeat Customers Over Time
        </li>
        <li onClick={() => navigate()} style={{ cursor: "pointer" }}>
          Geographical Distribution of Customers
        </li>
        <li onClick={() => navigate("/cohorts")} style={{ cursor: "pointer" }}>
          Customer Lifetime Value by Cohort
        </li>
      </ul>
    </div>
  );
};

export default Home;
