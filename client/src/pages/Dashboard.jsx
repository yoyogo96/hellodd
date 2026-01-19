import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stockAPI } from '../services/api';
import StockCard from '../components/StockCard';
import './Dashboard.css';

function Dashboard() {
  const [stocksData, setStocksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getAllPrices();
      setStocksData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">다시 시도</button>
        </div>
      </div>
    );
  }

  const { success, errorCount } = stocksData;

  // 상위 종목 (등락률 기준)
  const topGainers = [...success]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  // 하위 종목 (등락률 기준)
  const topLosers = [...success]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  // 거래량 상위
  const topVolume = [...success]
    .filter(s => s.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>대전 코스닥 주가 현황</h2>
        <p className="subtitle">
          총 {success.length}개 종목 (불러오기 실패: {errorCount}개)
        </p>
        <button onClick={fetchDashboardData} className="refresh-btn">
          새로고침
        </button>
      </div>

      <div className="dashboard-grid">
        {/* 상승 종목 */}
        <section className="dashboard-section">
          <h3 className="section-title">📈 상승 종목 TOP 5</h3>
          <div className="stock-list">
            {topGainers.map(stock => (
              <StockCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>

        {/* 하락 종목 */}
        <section className="dashboard-section">
          <h3 className="section-title">📉 하락 종목 TOP 5</h3>
          <div className="stock-list">
            {topLosers.map(stock => (
              <StockCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>

        {/* 거래량 상위 */}
        <section className="dashboard-section">
          <h3 className="section-title">💰 거래량 상위 TOP 5</h3>
          <div className="stock-list">
            {topVolume.map(stock => (
              <StockCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-footer">
        <Link to="/companies" className="view-all-btn">
          전체 종목 보기 →
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
