import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stockAPI } from '../services/api';
import StockChart from '../components/StockChart';
import './StockDetail.css';

function StockDetail() {
  const { ticker } = useParams();
  const [stockData, setStockData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('3mo');

  useEffect(() => {
    fetchStockData();
  }, [ticker, range]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const [detail, history] = await Promise.all([
        stockAPI.getStockDetail(ticker),
        stockAPI.getStockHistory(ticker, range)
      ]);

      setStockData(detail);
      setHistoryData(history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className="stock-detail">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-detail">
        <Link to="/companies" className="back-link">← 종목 리스트로</Link>
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchStockData} className="retry-btn">다시 시도</button>
        </div>
      </div>
    );
  }

  const isPositive = stockData.changePercent >= 0;
  const changeSign = isPositive ? '+' : '';

  return (
    <div className="stock-detail">
      <Link to="/companies" className="back-link">← 종목 리스트로</Link>

      <div className="detail-header">
        <div>
          <h1 className="stock-title">{stockData.name}</h1>
          <p className="stock-meta">
            {stockData.sector} · {stockData.ticker}
          </p>
        </div>
        <div className="price-info">
          <div className="current-price">{formatNumber(stockData.price)}원</div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {changeSign}{formatNumber(stockData.change)}원
            <span className="percent">
              ({changeSign}{formatNumber(stockData.changePercent)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="range-selector">
        <button
          className={range === '1mo' ? 'active' : ''}
          onClick={() => setRange('1mo')}
        >
          1개월
        </button>
        <button
          className={range === '3mo' ? 'active' : ''}
          onClick={() => setRange('3mo')}
        >
          3개월
        </button>
        <button
          className={range === '6mo' ? 'active' : ''}
          onClick={() => setRange('6mo')}
        >
          6개월
        </button>
        <button
          className={range === '1y' ? 'active' : ''}
          onClick={() => setRange('1y')}
        >
          1년
        </button>
      </div>

      {/* 차트 */}
      {historyData && historyData.historical && (
        <StockChart data={historyData.historical} />
      )}

      {/* 상세 정보 */}
      <div className="detail-grid">
        <div className="detail-card">
          <h3>시세 정보</h3>
          <div className="info-row">
            <span>전일종가</span>
            <span>{formatNumber(stockData.previousClose)}원</span>
          </div>
          <div className="info-row">
            <span>시가</span>
            <span>{formatNumber(stockData.open)}원</span>
          </div>
          <div className="info-row">
            <span>고가</span>
            <span>{formatNumber(stockData.dayHigh)}원</span>
          </div>
          <div className="info-row">
            <span>저가</span>
            <span>{formatNumber(stockData.dayLow)}원</span>
          </div>
          <div className="info-row">
            <span>거래량</span>
            <span>{formatNumber(stockData.volume)}주</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>기업 정보</h3>
          <div className="info-row">
            <span>회사명</span>
            <span>{stockData.name}</span>
          </div>
          <div className="info-row">
            <span>종목코드</span>
            <span>{stockData.ticker}</span>
          </div>
          <div className="info-row">
            <span>섹터</span>
            <span>{stockData.sector}</span>
          </div>
          <div className="info-row">
            <span>시장</span>
            <span>KOSDAQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
