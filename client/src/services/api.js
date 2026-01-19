import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
});

// 에러 처리
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.error || error.message || '요청 실패';
    return Promise.reject(new Error(message));
  }
);

export const stockAPI = {
  // 전체 종목 리스트
  getStocks: () => api.get('/stocks'),

  // 섹터별 종목
  getSectors: () => api.get('/stocks/sectors'),

  // 전체 종목 가격
  getAllPrices: () => api.get('/stocks/prices'),

  // 특정 종목 정보
  getStock: (ticker) => api.get(`/stocks/${ticker}`),

  // 특정 종목 가격
  getStockPrice: (ticker) => api.get(`/stocks/${ticker}/price`),

  // 특정 종목 과거 데이터
  getStockHistory: (ticker, range = '3mo') =>
    api.get(`/stocks/${ticker}/history`, { params: { range } }),

  // 특정 종목 상세 (기본정보 + 가격)
  getStockDetail: (ticker) => api.get(`/stocks/${ticker}/detail`)
};

export default api;
