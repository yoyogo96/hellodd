# 실제 주가 데이터 연동 가이드

현재 데모 모드로 실행 중입니다. 실제 한국 주식 데이터를 사용하려면 다음 옵션 중 하나를 선택하세요.

## ⚠️ 현재 상태

- **모드**: 데모 (랜덤 데이터 생성)
- **이유**: 무료 API의 한계
  - 야후 파이낸스: 한국 주식 지원 불완전
  - 네이버 금융: 크롤링 제한
  - KRX: 실시간 데이터 제공 안함

---

## 🎯 실제 데이터 사용 방법

### 옵션 1: 한국투자증권 API (추천) ⭐

**무료 체험 가능, 가장 정확한 데이터**

1. **회원가입**
   - https://apiportal.koreainvestment.com
   - 계좌 없이도 API 사용 가능 (모의투자)

2. **API 키 발급**
   - 앱 키 (App Key)
   - 앱 시크릿 (App Secret)

3. **.env 파일 설정**
   ```env
   KIS_APP_KEY=your_app_key
   KIS_APP_SECRET=your_app_secret
   KIS_ACCOUNT_NO=your_account_number
   ```

4. **코드 적용**
   - `server/src/services/kisService.js` 사용
   - `DEMO_MODE = false` 설정

**장점**:
- ✅ 실시간 데이터
- ✅ 정확한 주가 정보
- ✅ 공식 API

**단점**:
- ⚠️ 회원가입 필요
- ⚠️ 호출 제한 (분당 20회)

---

### 옵션 2: Alpha Vantage API

**글로벌 주식 데이터, 한국 주식 제한적**

1. **API 키 발급**
   - https://www.alphavantage.co/support/#api-key

2. **.env 파일**
   ```env
   ALPHA_VANTAGE_KEY=your_api_key
   ```

**장점**:
- ✅ 무료
- ✅ 간단한 설정

**단점**:
- ⚠️ 한국 주식 데이터 부족
- ⚠️ 일 500회 제한

---

### 옵션 3: 네이버/다음 금융 크롤링

**현재 구현됨, 하지만 불안정**

```javascript
// server/src/services/stockDataService.js
const DEMO_MODE = false; // 실제 크롤링 사용
```

**주의사항**:
- ⚠️ 웹사이트 구조 변경 시 동작 안할 수 있음
- ⚠️ 과도한 요청 시 차단 가능
- ⚠️ 법적 문제 소지

---

### 옵션 4: 유료 데이터 제공업체

**프로덕션 환경**

- **WiseFn**: https://www.wisefn.com
- **FnGuide**: https://www.fnguide.com
- **Bloomberg API**: 고급 금융 데이터

---

## 💡 추천 조합

### 개발/데모용
```
현재 설정 (데모 모드)
```

### 테스트용
```
한국투자증권 모의투자 API
```

### 프로덕션용
```
한국투자증권 실전투자 API
+ 캐싱 전략
+ Rate Limiting
```

---

## 🔧 데모 모드 개선

현재 데모 데이터를 더 현실적으로 만들려면:

```javascript
// server/src/services/stockDataService.js

// 실제 대전 기업들의 평균 가격대 반영
const SECTOR_PRICE_RANGES = {
  '바이오': { min: 5000, max: 50000 },
  '반도체': { min: 10000, max: 80000 },
  'IT서비스': { min: 3000, max: 30000 },
  // ...
};
```

---

## 📊 데이터 정확도 비교

| 소스 | 정확도 | 실시간 | 비용 | 난이도 |
|------|--------|--------|------|--------|
| 한투 API | ⭐⭐⭐⭐⭐ | ✅ | 무료/유료 | ⭐⭐ |
| 네이버 크롤링 | ⭐⭐⭐ | ❌ | 무료 | ⭐⭐⭐ |
| 데모 모드 | ⭐ | ❌ | 무료 | ⭐ |

---

## ✅ 다음 단계

1. **개발 단계**: 현재 데모 모드 유지
2. **테스트 단계**: 한투 모의투자 API 연동
3. **배포 단계**: 한투 실전 API 또는 유료 데이터

---

**현재는 데모 모드로 UI/UX를 먼저 완성하고,**
**실제 서비스 시 데이터 소스를 교체하는 것을 추천합니다.**
