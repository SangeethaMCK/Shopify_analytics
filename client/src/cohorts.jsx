import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const CLVByCohorts = () => {
  const [chartOptions, setChartOptions] = useState({});

  const fetchCLVData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clv-by-cohorts');
      const data = await response.json();

      const months = data.map(item => item.month);
      const clvValues = data.map(item => item.clv);

      setChartOptions({
        chart: {
          type: 'line',
        },
        title: {
          text: 'Customer Lifetime Value by Cohort',
        },
        xAxis: {
          categories: months,
          title: {
            text: 'Month',
          },
        },
        yAxis: {
          title: {
            text: 'Lifetime Value (Currency)',
          },
          labels: {
            formatter: function () {
              return this.value.toLocaleString();
            },
          },
        },
        series: [
          {
            name: 'CLV',
            data: clvValues,
            color: '#00aaff',
          },
        ],
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: true,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching CLV data:", error);
    }
  };

  useEffect(() => {
    fetchCLVData();
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

export default CLVByCohorts;
