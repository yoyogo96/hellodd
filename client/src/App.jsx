import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';
import StockDetail from './pages/StockDetail';
import Header from './components/Header';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/stocks/:ticker" element={<StockDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
