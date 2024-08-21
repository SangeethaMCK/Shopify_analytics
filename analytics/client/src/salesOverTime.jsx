import { useState, useEffect } from 'react';
import './App.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

function SalesOverTime() {
  const [sales, setSales] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  const fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sales/total-over-time?interval=monthly');
  
      const data = await response.json();
      setSales(data);
      console.log(data);

      const categories = data.map(item => `${item._id.month}/${item._id.year}`);
      const salesData = data.map(item => item.totalSales);

      // Set chart options
      setChartOptions({
        title: {
          text: 'Total Sales Over Time'
        },
        xAxis: {
          categories: categories,
          title: {
            text: 'Time'
          }
        },
        yAxis: {
          title: {
            text: 'Total Sales'
          }
        },
        series: [{
          name: 'Sales',
          data: salesData
        }]
      });
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
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </>
  );
}

export default SalesOverTime;
