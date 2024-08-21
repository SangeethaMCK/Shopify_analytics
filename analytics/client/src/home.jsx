import { useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Shopify Sales Analytics</h1>
      <ul>
        <li onClick={() => navigate('/salesOverTime')} style={{ cursor: 'pointer' }}>
          Total Sales Over Time
        </li>
        <li onClick={() => navigate('/salesGrowthRateOverTime')} style={{ cursor: 'pointer' }}>
          Sales Growth Rate Over Time
        </li>
        <li onClick={() => navigate('/newCustomers')} style={{ cursor: 'pointer' }}>
          New Customers Over Time
        </li>
        <li onClick={() => navigate('/repeatCustomers')} style={{ cursor: 'pointer' }}>
          Repeat Customers Over Time
        </li>
        <li>Geographical Distribution of Customers</li>
        <li onClick={() => navigate('/cohorts')} style={{ cursor: 'pointer' }}>
          Customer Lifetime Value by Cohort
        </li>
      </ul>
    </div>
  );
};

export default Home;
