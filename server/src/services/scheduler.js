import cron from 'node-cron';
import stockDataService from './stockDataService.js';

let isSchedulerRunning = false;

/**
 * 주기적 주가 데이터 업데이트 스케줄러
 * 한국 주식시장 기준 (월-금 09:00 ~ 15:30)
 */
export function startScheduler() {
  if (isSchedulerRunning) {
    console.log('스케줄러가 이미 실행 중입니다.');
    return;
  }

  console.log('주가 업데이트 스케줄러 시작...');

  // 매시간 정각에 실행 (장중 데이터 업데이트)
  cron.schedule('0 * * * *', async () => {
    try {
      console.log(`[${new Date().toLocaleString('ko-KR')}] 주가 데이터 업데이트 시작...`);
      const result = await stockDataService.getAllStockPrices();
      console.log(`업데이트 완료: 성공 ${result.successCount}개, 실패 ${result.errorCount}개`);
    } catch (error) {
      console.error('스케줄러 업데이트 오류:', error.message);
    }
  });

  // 매일 아침 8시 30분에 캐시 초기화
  cron.schedule('30 8 * * 1-5', () => {
    console.log(`[${new Date().toLocaleString('ko-KR')}] 캐시 초기화`);
    stockDataService.clearCache();
  });

  isSchedulerRunning = true;
  console.log('스케줄러가 정상적으로 시작되었습니다.');
}

export function stopScheduler() {
  isSchedulerRunning = false;
  console.log('스케줄러가 중지되었습니다.');
}
