import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sales/total-over-time?interval=monthly');
      console.log("Response:", response);
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchSales();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <>
      <h1>Sales Over Time</h1>
      <ul>
        {sales.map((sale, index) => (
          <li key={index}>
            {sale._id.year}-{sale._id.month}: {sale.totalSales}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
