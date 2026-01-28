import axios from 'axios';

class KRXService {
  constructor() {
    this.baseURL = 'http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd';
  }

  /**
   * KRX에서 코스닥 전종목 시세 조회
   */
  async fetchKosdaqPrices() {
    try {
      const response = await axios.post(this.baseURL, {
        bld: 'dbms/MDC/STAT/standard/MDCSTAT01501',
        mktId: 'STK',
        trdDd: this.getTodayDate(),
        money: '1',
        csvxls_isNo: 'false'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 15000
      });

      return response.data.OutBlock_1 || [];
    } catch (error) {
      console.error('KRX API 오류:', error.message);
      return [];
    }
  }

  /**
   * 오늘 날짜 (yyyyMMdd 형식)
   */
  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * 특정 종목의 가격 정보 조회
   */
  async getStockPrice(ticker) {
    const allPrices = await this.fetchKosdaqPrices();
    const stockData = allPrices.find(item => item.ISU_SRT_CD === ticker);

    if (!stockData) {
      throw new Error(`종목 ${ticker}의 데이터를 찾을 수 없습니다.`);
    }

    const price = parseFloat(stockData.TDD_CLSPRC.replace(/,/g, '')) || 0;
    const change = parseFloat(stockData.CMPPREVDD_PRC.replace(/,/g, '')) || 0;
    const volume = parseFloat(stockData.ACC_TRDVOL.replace(/,/g, '')) || 0;
    const high = parseFloat(stockData.TDD_HGPRC.replace(/,/g, '')) || price;
    const low = parseFloat(stockData.TDD_LWPRC.replace(/,/g, '')) || price;
    const open = parseFloat(stockData.TDD_OPNPRC.replace(/,/g, '')) || price;

    return {
      price: price,
      change: change,
      changePercent: price > 0 ? (change / (price - change)) * 100 : 0,
      volume: volume,
      previousClose: price - change,
      dayHigh: high,
      dayLow: low,
      open: open,
      currency: 'KRW',
      lastUpdate: new Date().toISOString()
    };
  }
}

export default new KRXService();
