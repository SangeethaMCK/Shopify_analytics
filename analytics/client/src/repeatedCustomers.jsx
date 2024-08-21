import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const RepeatCustomers = () => {
    const [chartOptions, setChartOptions] = useState({});

    const fetchRepeatCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/customers/repeat-over-time?interval=monthly');
            const data = await response.json();
            console.log(data);

            // Process the fetched data
            const categories = data.map(item => {
                const { year, month, day } = item.timePeriod;
                return day ? `${day}/${month}/${year}` : month ? `${month}/${year}` : year;
            });
            const repeatCustomerData = data.map(item => item.customerCount);

            // Set chart options
            setChartOptions({
                title: {
                    text: 'Number of Repeat Customers Over Time'
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Number of Repeat Customers'
                    }
                },
                series: [{
                    name: 'Repeat Customers',
                    data: repeatCustomerData
                }]
            });
        } catch (error) {
            console.error("Error fetching repeat customers data:", error);
        }
    };

    useEffect(() => {
        fetchRepeatCustomers();
    }, []);

    return (
        <div>
            <h1>Repeat Customers</h1>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
};

export default RepeatCustomers;
