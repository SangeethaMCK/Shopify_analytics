import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

function SalesGrowthRateOverTime() {
  const [salesGrowth, setSalesGrowth] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const interval = localStorage.getItem('interval') || 'monthly';

  const calculateGrowthRate = (data) => {
    const growthRates = [];
    for (let i = 0; i < data.length - 1; i++) {
      const currentSales = data[i].totalSales;
      const previousSales = data[i + 1].totalSales;
      const growthRate = (currentSales - previousSales) / previousSales * 100;
      growthRates.push({ period: `${data[i]._id.month}/${data[i]._id.year}`, growthRate: growthRate.toFixed(2) });
    }
    return growthRates;
  };

  const fetchSalesGrowth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sales/total-over-time?interval='+interval);
      const data = await response.json();
      const growthRates = calculateGrowthRate(data);

      const categories = growthRates.map(item => item.period);
      const growthData = growthRates.map(item => parseFloat(item.growthRate));

      setChartOptions({
        title: { text: 'Sales Growth Rate Over Time' },
        xAxis: { categories: categories, title: { text: 'Time' } },
        yAxis: { title: { text: 'Growth Rate (%)' } },
        series: [{ name: 'Growth Rate', data: growthData }]
      });

      setSalesGrowth(growthRates);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchSalesGrowth();
  }, []);

  return (
    <>
      <h1>Sales Growth Rate Over Time</h1>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </>
  );
}

export default SalesGrowthRateOverTime;
