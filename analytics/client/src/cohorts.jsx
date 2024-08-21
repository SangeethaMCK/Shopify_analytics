import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const CLVCohorts = () => {
  const [chartOptions, setChartOptions] = useState({});   

  const fetchCLVByCohort = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/customers/clv-by-cohort');
      const data = await response.json();
      
      const categories = data.map(item => item._id);  // Months
      const seriesData = data.map(item => item.averageLifetimeValue);  // Average CLV

      setChartOptions({
        title: {
          text: 'Customer Lifetime Value by Cohort'
        },
        xAxis: {
          categories: categories,
          title: {
            text: 'Month of First Purchase'
          }
        },
        yAxis: {
          title: {
            text: 'Average Lifetime Value'
          }
        },
        series: [{
          name: 'Average CLV',
          data: seriesData
        }]
      });
    } catch (error) {
      console.error("Error fetching CLV by cohort data:", error);
    }
  };

  useEffect(() => {
    fetchCLVByCohort();
  }, []);

  return (
    <div>
      <h1>Customer Lifetime Value by Cohort</h1>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default CLVCohorts;
