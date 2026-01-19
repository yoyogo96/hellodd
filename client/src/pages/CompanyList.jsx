import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stockAPI } from '../services/api';
import StockCard from '../components/StockCard';
import './CompanyList.css';

function CompanyList() {
  const [stocksData, setStocksData] = useState(null);
  const [stocksList, setStocksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('전체');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, pricesRes] = await Promise.all([
        stockAPI.getStocks(),
        stockAPI.getAllPrices()
      ]);

      // 가격 데이터 병합
      const priceMap = new Map(
        pricesRes.success.map(s => [s.ticker, s])
      );

      const stocksWithPrices = listRes.stocks.map(stock => ({
        ...stock,
        ...priceMap.get(stock.ticker)
      }));

      setStocksList(stocksWithPrices);
      setStocksData(pricesRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 섹터 목록 추출
  const sectors = ['전체', ...new Set(stocksList.map(s => s.sector))];

  // 필터링 및 정렬
  const filteredStocks = stocksList
    .filter(stock => {
      const matchesSearch =
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.ticker.includes(searchTerm);
      const matchesSector =
        selectedSector === '전체' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ko');
        case 'changePercent':
          return (b.changePercent || 0) - (a.changePercent || 0);
        case 'volume':
          return (b.volume || 0) - (a.volume || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="company-list">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-list">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list">
      <div className="page-header">
        <h2>대전 코스닥 상장사 ({stocksList.length}개)</h2>
        <button onClick={fetchData} className="refresh-btn">새로고침</button>
      </div>

      {/* 필터 컨트롤 */}
      <div className="filters">
        <input
          type="text"
          placeholder="종목명 또는 종목코드 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="sector-select"
        >
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">이름순</option>
          <option value="changePercent">등락률순</option>
          <option value="volume">거래량순</option>
        </select>
      </div>

      {/* 결과 수 */}
      <div className="results-count">
        {filteredStocks.length}개 종목
      </div>

      {/* 종목 그리드 */}
      <div className="stocks-grid">
        {filteredStocks.map(stock => (
          <StockCard key={stock.ticker} stock={stock} />
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="no-results">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}

export default CompanyList;
