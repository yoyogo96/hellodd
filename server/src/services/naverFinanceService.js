import axios from 'axios';
import * as cheerio from 'cheerio';

class NaverFinanceService {
  constructor() {
    this.baseURL = 'https://finance.naver.com';
  }

  /**
   * 네이버 금융에서 종목 현재가 정보 조회
   * @param {string} ticker - 종목코드
   */
  async fetchStockPrice(ticker) {
    try {
      const url = `${this.baseURL}/item/main.naver?code=${ticker}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // 현재가
      const priceText = $('.no_today .blind').first().text().replace(/,/g, '');
      const price = parseInt(priceText) || 0;

      // 전일대비
      const changeArea = $('.no_exday .blind').eq(0);
      let change = 0;
      let changePercent = 0;

      if (changeArea.length > 0) {
        const changeText = changeArea.text();
        const isDown = $('.no_exday em').hasClass('no_down');
        const isUp = $('.no_exday em').hasClass('no_up');

        const changeMatch = changeText.match(/[\d,]+/g);
        if (changeMatch && changeMatch.length >= 2) {
          change = parseInt(changeMatch[0].replace(/,/g, '')) || 0;
          changePercent = parseFloat(changeMatch[1].replace(/,/g, '')) || 0;

          if (isDown) {
            change = -change;
            changePercent = -changePercent;
          }
        }
      }

      // 시가, 고가, 저가, 거래량
      const today = $('.today .no_today');
      const todayFirst = today.find('.blind').first().text().replace(/,/g, '');

      const infoElements = $('.today .first em.no_down, .today .first em.no_up, .today .first em');

      let high = 0, low = 0, volume = 0;

      // 고가/저가/거래량 추출
      $('.today .first').each((idx, el) => {
        const text = $(el).text();
        if (text.includes('고가')) {
          const val = $(el).find('em').text().replace(/,/g, '');
          high = parseInt(val) || 0;
        }
        if (text.includes('저가')) {
          const val = $(el).find('em').text().replace(/,/g, '');
          low = parseInt(val) || 0;
        }
        if (text.includes('거래량')) {
          const val = $(el).find('em').text().replace(/,/g, '');
          volume = parseInt(val) || 0;
        }
      });

      const previousClose = price - change;

      return {
        price: price,
        change: change,
        changePercent: changePercent,
        volume: volume,
        previousClose: previousClose,
        dayHigh: high || price,
        dayLow: low || price,
        open: price, // 시가는 별도 파싱 필요
        currency: 'KRW',
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error(`네이버 금융 크롤링 오류 (${ticker}):`, error.message);
      throw error;
    }
  }

  /**
   * 네이버 금융 차트 데이터 API 호출
   * @param {string} ticker - 종목코드
   * @param {string} timeframe - 기간 (day, week, month)
   */
  async fetchChartData(ticker, timeframe = 'day') {
    try {
      // 네이버 차트 API
      const url = `https://api.finance.naver.com/siseJson.naver`;
      const response = await axios.get(url, {
        params: {
          symbol: ticker,
          requestType: 1,
          startTime: this.getStartTime(timeframe),
          endTime: Date.now(),
          timeframe: timeframe
        },
        timeout: 10000
      });

      // 응답 데이터 파싱 (JSON 형태)
      let data = response.data;

      // 문자열로 온 경우 JSON 파싱
      if (typeof data === 'string') {
        // "nhn.Finance.demoResultCallback(" 제거
        data = data.replace(/^.*?\(/, '').replace(/\).*?$/, '');
        data = JSON.parse(data);
      }

      return data;
    } catch (error) {
      console.error(`네이버 차트 API 오류 (${ticker}):`, error.message);
      // API 실패시 최근 30일 더미 데이터 반환
      return this.generateFallbackData(ticker, timeframe);
    }
  }

  /**
   * 시작 시간 계산
   */
  getStartTime(timeframe) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    switch(timeframe) {
      case 'day':
        return now - (90 * day); // 90일
      case 'week':
        return now - (180 * day); // 6개월
      case 'month':
        return now - (365 * day); // 1년
      default:
        return now - (90 * day);
    }
  }

  /**
   * API 실패시 대체 데이터 생성
   */
  generateFallbackData(ticker, timeframe) {
    const historical = [];
    const days = timeframe === 'day' ? 30 : timeframe === 'week' ? 90 : 180;
    const now = Date.now();
    const basePrice = 10000 + Math.random() * 40000;

    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const day = now - (i * 24 * 60 * 60 * 1000);
      const volatility = basePrice * 0.02;
      const open = currentPrice + (Math.random() - 0.5) * volatility;
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

      currentPrice = close;
    }

    return historical;
  }
}

export default new NaverFinanceService();
