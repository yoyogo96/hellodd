# 배포 가이드

프로젝트를 무료로 공유할 수 있는 여러 플랫폼이 있습니다.

## 1. Vercel (프론트엔드) + Render (백엔드) - 추천 ⭐

### 장점
- 완전 무료
- 자동 HTTPS
- 빠른 배포
- GitHub 연동

### Vercel (프론트엔드)

1. **Vercel 가입**
   - https://vercel.com 접속
   - GitHub 계정으로 가입

2. **프로젝트 배포**
   ```bash
   # client 디렉토리에서 vercel.json 생성
   cd client
   ```

   `vercel.json` 파일 생성:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-api.onrender.com/api/:path*"
       }
     ]
   }
   ```

   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 레포지토리 임포트
   - Root Directory: `client`
   - "Deploy" 클릭

3. **환경변수 설정**
   - Vercel 프로젝트 설정 → Environment Variables
   - `VITE_API_URL`: 백엔드 URL

### Render (백엔드)

1. **Render 가입**
   - https://render.com 접속
   - GitHub 계정으로 가입

2. **Web Service 생성**
   - "New +" → "Web Service"
   - GitHub 레포지토리 연결
   - 설정:
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `node src/app.js`
     - **Environment**:
       - `NODE_ENV`: `production`
       - `PORT`: `3001`

3. **무료 티어 선택**
   - Free 타어 선택 (Cold start 있음)

---

## 2. Railway (전체 스택)

### 장점
- 프론트엔드 + 백엔드 함께 배포
- 데이터베이스 무료 제공
- GitHub 연동 쉬움

### 배포 방법

1. **Railway 가입**
   - https://railway.app 접속
   - GitHub 계정으로 가입

2. **새 프로젝트 생성**
   - "New Project" → "Deploy from GitHub repo"
   - 레포지토리 선택

3. **Railway 설정**
   - `railway.json` 생성:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm install && cd server && npm install && node src/app.js",
       "healthcheckPath": "/api/stocks"
     }
   }
   ```

---

## 3. GitHub Pages + Render (백엔드만)

### GitHub Pages (프론트엔드)

1. **정적 파일 빌드**
   ```bash
   cd client
   npm run build
   ```

2. **gh-pages 브랜치 배포**
   ```bash
   npm install -D gh-pages
   ```

   `package.json`에 추가:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

   ```bash
   npm run deploy
   ```

3. **GitHub 설정**
   - Settings → Pages
   - Source: `gh-pages` branch

---

## 4. Netlify (프론트엔드)

### 배포 방법

1. **Netlify 가입**
   - https://netlify.com

2. **Drag & Drop 배포**
   ```bash
   cd client
   npm run build
   ```
   - Netlify 대시보드에 `dist` 폴더 드래그

3. **또는 Git 연동**
   - "New site from Git"
   - GitHub 레포지토리 선택
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 5. 단일 서버 배포 (백엔드 + 프론트엔드 통합)

### Render / Railway 단일 배포

1. **client/build 스크립트 추가**
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

2. **server 정적 파일 제공**
   ```javascript
   // server/src/app.js
   import express from 'express';
   import path from 'path';

   app.use(express.static(path.resolve('../client/dist')));

   app.get('*', (req, res) => {
     res.sendFile(path.resolve('../client/dist/index.html'));
   });
   ```

---

## 추천 조합

| 옵션 | 프론트엔드 | 백엔드 | 난이도 | 추천 |
|------|-----------|--------|--------|------|
| 1 | Vercel | Render | ⭐⭐ | ⭐⭐⭐ |
| 2 | Railway | Railway | ⭐ | ⭐⭐ |
| 3 | GitHub Pages | Render | ⭐⭐⭐ | ⭐ |
| 4 | Netlify | Render | ⭐⭐ | ⭐⭐ |

---

## 시작하기 위한 체크리스트

### 1단계: GitHub에 코드 올리기

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hellodd.git
git push -u origin main
```

### 2단계: 배포 플랫폼 선택
- Vercel + Render (추천)
- Railway (간단)

### 3단계: 환경변수 설정
- API URL
- 포트 번호
- 기타 키

---

## 주의사항

### 데모 모드 해제
실제 배포 전에 `server/src/services/stockDataService.js`에서:
```javascript
const DEMO_MODE = false;  // 실제 API 사용 시
```

### API 키 필요
실제 주가 데이터를 위해서는:
- 한국투자증권 API (유료)
- KIS (한국거래소) API
- 네이버 금융 크롤링 (주의 필요)

### CORS 설정
백엔드에서 프론트엔드 도메인 허용:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

---

## 도메인 연결 (선택)

### 무료 도메인
- **Freenom**: .tk, .ml, .ga 등 무료 도메인

### 유료 도메인
- **가비아**: .com ~₩12,000/년
- **네이버 클라우드**: ~₩13,000/년

배포 후 도메인 설정에서 연결하면 됩니다.
