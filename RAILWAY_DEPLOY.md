# 🚀 Railway 배포 가이드

모든 설정이 완료되었습니다! 이제 3단계만 거치면 배포됩니다.

---

## ⚡ 3단계 배포

### 1단계: GitHub에 레포지토리 생성 및 푸시

```bash
# GitHub에서 새 레포지토리 생성 (hellodd)

# GitHub 레포지토리 URL 추가 (YOUR_USERNAME을 본인 이름으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/hellodd.git

# 코드 푸시
git push -u origin main
```

---

### 2단계: Railway에 프로젝트 연결

1. **Railway 접속**
   - https://railway.app 접속
   - "Login with GitHub"로 가입/로그인

2. **새 프로젝트 생성**
   - 좌측 상단 **"New Project"** 클릭
   - **"Deploy from GitHub repo"** 선택

3. **레포지토리 선택**
   - `hellodd` 레포지토리 선택
   - "Add variables" 선택 없이 **"Deploy Now"** 클릭

4. **자동 빌드 시작**
   - Railway가 자동으로 빌드 시작
   - 3-5분 소요

---

### 3단계: 배포 완료

- 🎉 배포가 완료되면 Railway에서 자동으로 도메인 생성
- 예: `https://hellodd-production.up.railway.app`

---

## 📋 Railway 설정 확인

배포 후 다음 설정을 확인하세요:

### 1. 환경변수 설정 (선택사항)

Railway 프로젝트 → **Variables** 탭:
```
NODE_ENV=production
PORT=3001
```

### 2. 빌드 로그 확인

- **Build Logs**에서 에러 없이 완료되었는지 확인
- 문제가 있으면 로그를 확인해주세요

---

## 🌐 배포 후 확인

1. **사이트 접속**
   - Railway에서 제공하는 URL로 접속
   - 예: `https://hellodd-production.up.railway.app`

2. **API 테스트**
   ```bash
   # 전체 종목 확인
   curl https://your-domain.railway.app/api/stocks

   # 종목 가격 확인
   curl https://your-domain.railway.app/api/stocks/057300/price
   ```

---

## 🔧 문제 해결

### 빌드 실패 시

1. **Nixpacks 설정 확인**
   - `nixpacks.toml` 파일이 루트에 있는지 확인

2. **Node.js 버전**
   - Railway는 최신 Node.js 자동 사용
   - `package.json`에 `"engines": {"node": ">=18.0.0"}` 설정됨

3. **로그 확인**
   - Railway 프로젝트 → **Deployments** → 최신 배포 → **View Logs**

### 클라이언트 빌드 실패

```bash
# 로컬에서 먼저 테스트
cd client
npm install
npm run build
```

---

## 📊 Railway 대시보드

배포 후 Railway 대시보드에서 다음을 확인할 수 있습니다:

- ✅ 실시간 로그
- ✅ 메트릭 (CPU, 메모리)
- ✅ 배포 히스토리
- ✅ 환경변수 관리
- ✅ 도메인 설정

---

## 🎁 무료 플랜 혜택

Railway 무료 플랜:
- ✅ $5/월 크레딧 (매월)
- ✅ 512MB RAM
- ✅ 자동 SSL/HTTPS
- ✅ 무료 도메인
- ✅ Git 기반 자동 배포

---

## 🔄 자동 재배포

GitHub에 푸시할 때마다 자동으로 재배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Railway가 자동으로 감지하고 재배포
```

---

## 📱 커스텀 도메인 (선택사항)

Railway 프로젝트 → **Settings** → **Domains**:

1. 도메인 입력 (예: `hellodd.com`)
2. DNS 설정 안내 따름
3. SSL 자동 발급

---

## 💡 다음 단계

배포 완료 후:

1. ✅ **실제 API 연동**
   - 한국투자증권 API
   - KIS API
   - 네이버 금융 (크롤링)

2. ✅ **데이터베이스 추가**
   - Railway PostgreSQL 무료
   - Redis 캐싱

3. ✅ **모니터링**
   - Railway Analytics
   - Uptime monitoring

---

## 🆘 도움이 필요하시면

Railway 문서:
- https://docs.railway.app

GitHub 레포지토리:
- https://github.com/YOUR_USERNAME/hellodd

---

**준비되었습니다! Railway에서 배포를 시작하세요! 🚀**
