import axios from 'axios';
import { DAEJEON_KOSDAQ_STOCKS, findStockByYahooTicker } from '../models/stockList.js';
import naverFinanceService from './naverFinanceService.js';

// 메모리 캐시
const priceCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

// 데모 모드 (false로 설정하면 실제 네이버 금융 데이터 사용)
const DEMO_MODE = false;

class StockDataService {
  constructor() {
    this.yahooFinanceBaseURL = 'https://query1.finance.yahoo.com/v8/finance/chart';
  }

  /**
   * 데모 데이터 생성 (실제 API 대신 사용)
   */
  generateDemoData(stock) {
    const basePrice = Math.floor(Math.random() * 50000) + 5000; // 5,000 ~ 55,000원
    const changePercent = (Math.random() * 20) - 10; // -10% ~ +10%
    const change = (basePrice * changePercent) / 100;

    // 과거 데이터 생성 (최근 90일)
    const historical = [];
    let currentP = basePrice - (change * 10);
    const now = Date.now();

    for (let i = 90; i >= 0; i--) {
      const day = now - (i * 24 * 60 * 60 * 1000);
      const volatility = basePrice * 0.02; // 2% 변동성
      const open = currentP + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;

      historical.push({
        date: new Date(day).toISOString().split('T')[0],
        timestamp: day,
        open: Math.max(open, 100),
        high: Math.max(high, 100),
        low: Math.max(low, 100),
        close: Math.max(close, 100),
        volume: Math.floor(Math.random() * 5000000) + 100000
      });

      currentP = close;
    }

    return {
      current: {
        ticker: stock.ticker,
        price: basePrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(Math.random() * 5000000) + 100000,
        previousClose: basePrice - change,
        dayHigh: basePrice + Math.abs(change) * 0.3,
        dayLow: basePrice - Math.abs(change) * 0.3,
        open: basePrice - change * 0.5,
        currency: 'KRW',
        lastUpdate: new Date().toISOString()
      },
      historical: historical
    };
  }

  /**
   * 야후 파이낸스에서 주가 데이터 조회
   * @param {string} yahooTicker - 야후 파이낸스 티커 (예: "057300.KQ")
   * @param {string} range - 데이터 범위 (1d, 5d, 1mo, 3mo, 6mo, 1y, max)
   */
  async fetchYahooFinanceData(yahooTicker, range = '1mo') {
    try {
      const url = `${this.yahooFinanceBaseURL}/${yahooTicker}`;
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          range: range,
          includePrePost: false
        },
        timeout: 10000
      });

      const result = response.data.chart.result[0];

      if (!result) {
        throw new Error('데이터를 찾을 수 없습니다.');
      }

      const meta = result.meta;
      const quotes = result.indicators.quote[0];
      const timestamps = result.timestamp;

      // 현재 가격 정보
      const currentData = {
        ticker: yahooTicker,
        price: meta.regularMarketPrice || meta.previousClose,
        change: meta.previousClose !== null ? meta.regularMarketPrice - meta.previousClose : 0,
        changePercent: meta.previousClose !== null
          ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
          : 0,
        volume: meta.regularMarketVolume || 0,
        previousClose: meta.previousClose,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        open: meta.regularMarketOpen,
        currency: meta.currency,
        lastUpdate: new Date().toISOString()
      };

      // 과거 데이터 (차트용)
      const historicalData = timestamps.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        timestamp: timestamp * 1000,
        open: quotes.open[index],
        high: quotes.high[index],
        low: quotes.low[index],
        close: quotes.close[index],
        volume: quotes.volume[index]
      })).filter(data => data.close !== null); // null 데이터 제거

      return {
        current: currentData,
        historical: historicalData
      };
    } catch (error) {
      console.error(`야후 파이낸스 API 오류 (${yahooTicker}):`, error.message);
      throw error;
    }
  }

  /**
   * 단일 종목 현재 가격 조회
   * @param {string} ticker - 종목코드 (예: "057300")
   */
  async getStockPrice(ticker) {
    const stock = DAEJEON_KOSDAQ_STOCKS.find(s => s.ticker === ticker);
    if (!stock) {
      throw new Error('종목을 찾을 수 없습니다.');
    }

    // 캐시 확인
    const cacheKey = `price_${ticker}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // 데모 모드이면 데모 데이터 사용
    if (DEMO_MODE) {
      const demoData = this.generateDemoData(stock);
      const result = {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        ...demoData.current
      };

      // 캐시 저장
      priceCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });

      return result;
    }

    // 실제 네이버 금융 데이터 사용
    try {
      const priceData = await naverFinanceService.fetchStockPrice(ticker);
      const result = {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        ...priceData
      };

      // 캐시 저장
      priceCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });

      return result;
    } catch (error) {
      // 네이버 금융 실패 시 데모 데이터로 대체
      console.warn(`${stock.name} 네이버 금융 크롤링 실패, 데모 데이터 사용:`, error.message);
      const demoData = this.generateDemoData(stock);
      const result = {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        ...demoData.current
      };

      priceCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });

      return result;
    }
  }

  /**
   * 단일 종목 과거 데이터 조회
   * @param {string} ticker - 종목코드
   * @param {string} range - 기간 (1mo, 3mo, 6mo, 1y)
   */
  async getStockHistory(ticker, range = '3mo') {
    const stock = DAEJEON_KOSDAQ_STOCKS.find(s => s.ticker === ticker);
    if (!stock) {
      throw new Error('종목을 찾을 수 없습니다.');
    }

    // 데모 모드 사용
    if (DEMO_MODE) {
      const demoData = this.generateDemoData(stock);

      // range에 따라 데이터 필터링
      let days = 90;
      if (range === '1mo') days = 30;
      if (range === '6mo') days = 180;
      if (range === '1y') days = 365;

      return {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        historical: demoData.historical.slice(-days)
      };
    }

    // 실제 네이버 금융 차트 데이터 사용
    try {
      const timeframe = range === '1mo' ? 'day' : range === '6mo' ? 'week' : 'month';
      const historical = await naverFinanceService.fetchChartData(ticker, timeframe);

      return {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        historical: historical
      };
    } catch (error) {
      // 네이버 금융 실패 시 데모 데이터 사용
      console.warn(`${stock.name} 차트 데이터 크롤링 실패, 데모 데이터 사용`);
      const demoData = this.generateDemoData(stock);

      let days = 90;
      if (range === '1mo') days = 30;
      if (range === '6mo') days = 180;
      if (range === '1y') days = 365;

      return {
        ticker: ticker,
        name: stock.name,
        sector: stock.sector,
        historical: demoData.historical.slice(-days)
      };
    }
  }

  /**
   * 전체 종목 현재 가격 조회 (배치)
   */
  async getAllStockPrices() {
    const results = [];
    const errors = [];

    // 병렬로 10개씩 처리하여 API 과부하 방지
    const batchSize = 10;
    for (let i = 0; i < DAEJEON_KOSDAQ_STOCKS.length; i += batchSize) {
      const batch = DAEJEON_KOSDAQ_STOCKS.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(stock => this.getStockPrice(stock.ticker))
      );

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          errors.push({
            ticker: batch[index].ticker,
            name: batch[index].name,
            error: result.reason.message
          });
        }
      });

      // 다음 배치 전에 딜레이
      if (i + batchSize < DAEJEON_KOSDAQ_STOCKS.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: results,
      errors: errors,
      total: DAEJEON_KOSDAQ_STOCKS.length,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * 섹터별 종목 리스트
   */
  getStocksBySector() {
    const sectorGroups = {};
    DAEJEON_KOSDAQ_STOCKS.forEach(stock => {
      if (!sectorGroups[stock.sector]) {
        sectorGroups[stock.sector] = [];
      }
      sectorGroups[stock.sector].push({
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector
      });
    });
    return sectorGroups;
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    priceCache.clear();
  }
}

export default new StockDataService();
