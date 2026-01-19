# HelloDD - 대전 코스닥 주가 모니터링 서비스

대전 지역 코스닥 상장사 59개사의 실시간 주가 정보를 모니터링하고 지역 주민에게 투자 정보와 지역 기업 소개를 제공하는 웹서비스입니다.

## 🎯 주요 기능

- **실시간 주가 모니터링**: 대전 코스닥 59개 상장사의 실시간 주가 정보 제공
- **대시보드**: 상승/하락 TOP 5, 거래량 상위 종목 한눈에 확인
- **종목 리스트**: 59개 종목 전체 검색, 섹터별 필터링, 정렬 기능
- **종목 상세**: 개별 종목별 차트, 상세 시세 정보, 기업 정보
- **지역 경제 기여**: 대전 지역 기업 홍보 및 투자 정보 접근성 향상

## 🏗️ 기술 스택

### 백엔드
- **Node.js** + **Express**: REST API 서버
- **Axios**: 야후 파이낸스 API 연동
- **node-cron**: 주기적 데이터 업데이트 스케줄러

### 프론트엔드
- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **React Router**: 라우팅
- **Recharts**: 차트 라이브러리
- **Axios**: API 호출

### 데이터 소스
- **야후 파이낸스 API**: 무료 주가 데이터 (KOSDAQ 종목)

## 📁 프로젝트 구조

```
hellodd/
├── server/                   # 백엔드 (Node.js/Express)
│   ├── src/
│   │   ├── app.js           # 서버 진입점
│   │   ├── routes/          # API 라우트
│   │   │   └── stocks.js    # 주식 API
│   │   ├── services/        # 비즈니스 로직
│   │   │   ├── stockDataService.js  # 주가 데이터 서비스
│   │   │   └── scheduler.js         # 데이터 업데이트 스케줄러
│   │   └── models/          # 데이터 모델
│   │       └── stockList.js # 59개 종목 데이터
│   └── package.json
│
├── client/                   # 프론트엔드 (React/Vite)
│   ├── src/
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CompanyList.jsx
│   │   │   └── StockDetail.jsx
│   │   ├── components/      # 재사용 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── StockCard.jsx
│   │   │   └── StockChart.jsx
│   │   ├── services/        # API 호출
│   │   │   └── api.js
│   │   └── styles/          # 스타일
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

1. **백엔드 설치 및 실행**
```bash
cd server
npm install
npm run dev
```
서버가 `http://localhost:3001`에서 실행됩니다.

2. **프론트엔드 설치 및 실행**
```bash
cd client
npm install
npm run dev
```
클라이언트가 `http://localhost:3000`에서 실행됩니다.

3. **브라우저 접속**
```
http://localhost:3000
```

## 📡 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/stocks` | 전체 종목 리스트 |
| GET | `/api/stocks/sectors` | 섹터별 종목 분류 |
| GET | `/api/stocks/prices` | 전체 종목 현재 가격 |
| GET | `/api/stocks/:ticker` | 특정 종목 기본 정보 |
| GET | `/api/stocks/:ticker/price` | 특정 종목 현재 가격 |
| GET | `/api/stocks/:ticker/history` | 특정 종목 과거 데이터 |
| GET | `/api/stocks/:ticker/detail` | 특정 종목 상세 정보 |

## 🏢 대전 코스닥 상장사 59개사

다음 섹터의 기업들이 포함됩니다:

- **바이오**: 인투셀, 오름테라퓨틱, 와이바이오로직스, 큐로셀, 등 20개사
- **전자/반도체**: 에르코스, 에이치엔에스하이텍, LX세미콘, 쎄트렉아이, 등 10개사
- **의료기기**: 토모큐브, 아이비젼웍스, 코셈, 수젠텍, 등 8개사
- **IT서비스**: 원텍, 셀바스헬스케어, 아이디스, 시스웍, 등 8개사
- **화학**: 한켐, 민테크, 라이온켐텍, 디엔에프, 등 7개사
- **기타**: 통신, 로봇, 환경, 식품 등 6개사

## ⚠️ 참고사항

### 데이터 소스 제한사항
- 야후 파이낸스 API는 무료지만 비공식 API입니다.
- 데이터에 지연이 있을 수 있습니다.
- 실시간 거래 데이터가 아닌 지연된 데이터입니다.

### 한국 주식 티커 포맷
- KOSDAQ: 종목코드 + `.KQ` (예: `057300.KQ`)
- KOSPI: 종목코드 + `.KS` (예: `005930.KS`)

### 개선 방향
- [ ] 한국투자증권 API 등 유료 데이터 소스 연동
- [ ] 사용자 인증 및 관심종목 저장
- [ ] 실시간 웹소켓 연결
- [ ] 기술적 지표 분석 (RSI, MACD 등)
- [ ] 알림 기능 (이메일/푸시)
- [ ] 대전 경제 뉴스 섹션
- [ ] 지역 기업 채용 공고 연동

## 📄 라이선스

MIT

## 👥 기여

이 프로젝트는 대전 지역 경제 활성화와 주민들의 투자 정보 접근성 향상을 목적으로 합니다.
