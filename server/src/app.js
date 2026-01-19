import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import stockRoutes from './routes/stocks.js';
import { startScheduler } from './services/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'HelloDD API - Daejeon KOSDAQ Stock Monitoring',
    version: '1.0.0',
    endpoints: {
      stocks: '/api/stocks',
      stockDetail: '/api/stocks/:ticker',
      stockPrice: '/api/stocks/:ticker/price',
      stockHistory: '/api/stocks/:ticker/history'
    }
  });
});

app.use('/api/stocks', stockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);

  // 스케줄러 시작 (선택사항)
  startScheduler();
});
