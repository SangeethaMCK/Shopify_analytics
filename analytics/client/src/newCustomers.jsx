import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const NewCustomers = () => {
    const [chartOptions, setChartOptions] = useState({});   

    const fetchNewCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/customers/new-over-time?interval=monthly');
            const data = await response.json();
            console.log(data);

            // Process the fetched data
            const categories = data.map(item => `${item._id.month}/${item._id.year}`);
            const newCustomersData = data.map(item => item.newCustomers);

            // Configure chart options
            setChartOptions({
                title: {
                    text: 'New Customers Over Time'
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Number of New Customers'
                    }
                },
                series: [{
                    name: 'New Customers',
                    data: newCustomersData
                }]
            });
        } catch (error) {
            console.error("Error fetching new customers data:", error);
        }
    };

    useEffect(() => {
        fetchNewCustomers();
    }, []);

    return (
        <div>
            <h1>New Customers</h1>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
};

export default NewCustomers;
