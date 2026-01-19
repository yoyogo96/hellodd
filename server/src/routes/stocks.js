import express from 'express';
import stockDataService from '../services/stockDataService.js';
import { DAEJEON_KOSDAQ_STOCKS } from '../models/stockList.js';

const router = express.Router();

/**
 * GET /api/stocks
 * 전체 종목 리스트 반환
 */
router.get('/', (req, res) => {
  try {
    const stocks = DAEJEON_KOSDAQ_STOCKS.map(stock => ({
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector
    }));
    res.json({
      count: stocks.length,
      stocks: stocks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/sectors
 * 섹터별 종목 분류 반환
 */
router.get('/sectors', (req, res) => {
  try {
    const sectorGroups = stockDataService.getStocksBySector();
    res.json(sectorGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/prices
 * 전체 종목 현재 가격 조회
 */
router.get('/prices', async (req, res) => {
  try {
    const result = await stockDataService.getAllStockPrices();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/:ticker
 * 특정 종목 기본 정보
 */
router.get('/:ticker', (req, res) => {
  try {
    const { ticker } = req.params;
    const stock = DAEJEON_KOSDAQ_STOCKS.find(s => s.ticker === ticker);

    if (!stock) {
      return res.status(404).json({ error: '종목을 찾을 수 없습니다.' });
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/:ticker/price
 * 특정 종목 현재 가격
 */
router.get('/:ticker/price', async (req, res) => {
  try {
    const { ticker } = req.params;
    const data = await stockDataService.getStockPrice(ticker);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/:ticker/history
 * 특정 종목 과거 데이터
 * Query params: range=1mo|3mo|6mo|1y
 */
router.get('/:ticker/history', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { range = '3mo' } = req.query;

    // 유효한 range 값 확인
    const validRanges = ['1mo', '3mo', '6mo', '1y', 'max'];
    if (!validRanges.includes(range)) {
      return res.status(400).json({
        error: '유효하지 않은 range 값입니다.',
        validRanges: validRanges
      });
    }

    const data = await stockDataService.getStockHistory(ticker, range);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stocks/:ticker/detail
 * 특정 종목 상세 정보 (기본정보 + 현재가격)
 */
router.get('/:ticker/detail', async (req, res) => {
  try {
    const { ticker } = req.params;
    const stock = DAEJEON_KOSDAQ_STOCKS.find(s => s.ticker === ticker);

    if (!stock) {
      return res.status(404).json({ error: '종목을 찾을 수 없습니다.' });
    }

    const priceData = await stockDataService.getStockPrice(ticker);

    res.json({
      ...stock,
      price: priceData.price,
      change: priceData.change,
      changePercent: priceData.changePercent,
      volume: priceData.volume,
      dayHigh: priceData.dayHigh,
      dayLow: priceData.dayLow,
      open: priceData.open,
      previousClose: priceData.previousClose
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
