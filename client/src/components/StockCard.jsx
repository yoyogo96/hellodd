import { Link } from 'react-router-dom';
import './StockCard.css';

function StockCard({ stock }) {
  const isPositive = stock.changePercent >= 0;
  const changeSign = isPositive ? '+' : '';

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    if (Math.abs(num) >= 1000) {
      return num.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
    }
    return num.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
  };

  const formatVolume = (volume) => {
    if (!volume) return '-';
    if (volume >= 100000000) return (volume / 100000000).toFixed(2) + '억';
    if (volume >= 10000) return (volume / 10000).toFixed(0) + '만';
    return volume.toLocaleString();
  };

  return (
    <Link to={`/stocks/${stock.ticker}`} className="stock-card">
      <div className="stock-header">
        <span className="stock-name">{stock.name}</span>
        <span className="stock-ticker">{stock.ticker}</span>
      </div>
      <div className="stock-price">
        <span className="price">{formatNumber(stock.price)}원</span>
        <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
          {changeSign}{formatNumber(stock.changePercent)}%
        </span>
      </div>
      {stock.volume && (
        <div className="stock-volume">
          거래량: {formatVolume(stock.volume)}
        </div>
      )}
    </Link>
  );
}

export default StockCard;
