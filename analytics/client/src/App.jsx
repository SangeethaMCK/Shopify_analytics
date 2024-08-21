import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalesOverTime from './salesOverTime';
import SalesGrowthRateOverTime from './salesGrowthRateoverTime';
import NewCustomers from './newCustomers';
import RepeatCustomers from './repeatedCustomers';
import Home from './home';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salesOverTime" element={<SalesOverTime />} />
          <Route path="/salesGrowthRateOverTime" element={<SalesGrowthRateOverTime />} />
          <Route path="/newCustomers" element={<NewCustomers />} />
          <Route path="/repeatCustomers" element={<RepeatCustomers />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
