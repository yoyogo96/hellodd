# 🚀 빠른 배포 가이드

모든 준비가 완료되었습니다! 이제 실행만 하면 됩니다.

---

## ✅ 완료된 작업

- ✅ 프로젝트 코드 작성 완료
- ✅ Git 저장소 초기화 완료
- ✅ Railway 배포 설정 완료
- ✅ 3개 커밋 생성 완료

---

## 🎯 방법 1: GitHub CLI 사용 (가장 빠름)

### 1단계: GitHub 로그인
```bash
gh auth login
```

**선택 항목:**
- GitHub.com
- HTTPS
- Yes (authenticate)
- Login with a web browser

브라우저가 열리면 코드 입력하고 인증

### 2단계: 저장소 생성 및 푸시
```bash
# 저장소 생성 및 자동 푸시
gh repo create hellodd --public --source=. --remote=origin --push
```

완료! GitHub 저장소가 생성되고 코드가 푸시됩니다.

---

## 🎯 방법 2: GitHub 웹사이트 사용

### 1단계: GitHub에서 저장소 생성
1. https://github.com/new 접속
2. Repository name: `hellodd`
3. Public 선택
4. "Create repository" 클릭

### 2단계: Personal Access Token 생성
1. https://github.com/settings/tokens 접속
2. "Generate new token" → "Generate new token (classic)"
3. Note: `hellodd-deploy`
4. Expiration: 선택
5. Scopes: `repo` 체크
6. "Generate token" 클릭
7. **토큰 복사** (다시 볼 수 없음!)

### 3단계: 코드 푸시
```bash
# 원격 저장소 업데이트 (이미 설정됨)
git remote set-url origin https://YOUR_TOKEN@github.com/yoyogo96/hellodd.git

# 푸시
git push -u origin main
```

---

## 🚂 Railway 배포

GitHub에 푸시한 후:

### 1. Railway 접속
- https://railway.app
- "Login with GitHub"

### 2. 새 프로젝트
- "New Project"
- "Deploy from GitHub repo"
- `yoyogo96/hellodd` 선택

### 3. 배포
- "Deploy Now" 클릭
- 3-5분 대기

### 4. 완료!
- Railway가 자동으로 URL 생성
- 예: `https://hellodd-production.up.railway.app`

---

## 📋 현재 상태

```bash
# 커밋 확인
git log --oneline

# 출력:
# abd2c9b Add Railway deployment guide
# c4a6f7f Add Railway deployment configuration
# 43094c2 Initial commit: HelloDD - 대전 코스닥 주가 모니터링 서비스
```

**파일 구조:**
```
hellodd/
├── client/           # React 프론트엔드
├── server/           # Node.js 백엔드
├── package.json      # 빌드 스크립트
├── nixpacks.toml     # Railway 빌드 설정
├── railway.json      # Railway 프로젝트 설정
└── README.md         # 프로젝트 문서
```

---

## ⚡ 자동화 스크립트

원하시면 아래 명령어로 한번에 처리 가능:

```bash
# GitHub CLI로 한번에
gh auth login && gh repo create hellodd --public --source=. --push
```

---

## 🆘 문제 해결

### GitHub CLI 로그인 실패
```bash
# 다시 시도
gh auth logout
gh auth login
```

### 푸시 실패
```bash
# 상태 확인
git status
git log --oneline

# 원격 저장소 확인
git remote -v
```

### Railway 빌드 실패
1. Railway 로그 확인
2. `nixpacks.toml` 설정 확인
3. 로컬에서 빌드 테스트:
```bash
cd client && npm install && npm run build
cd ../server && npm install
```

---

## 🎁 배포 후 확인사항

### 1. 사이트 접속 테스트
```bash
# Railway URL로 접속
open https://your-app.railway.app
```

### 2. API 테스트
```bash
# 전체 종목 조회
curl https://your-app.railway.app/api/stocks | jq

# 특정 종목 조회
curl https://your-app.railway.app/api/stocks/057300/price | jq
```

### 3. 프론트엔드 확인
- 대시보드 동작 확인
- 종목 검색 확인
- 차트 표시 확인

---

## 📱 다음 단계

배포 완료 후:

1. **도메인 연결** (선택)
   - Railway에서 커스텀 도메인 설정
   - 예: `hellodd.com`

2. **실제 API 연동**
   - `DEMO_MODE = false` 설정
   - 한국투자증권 API 연동
   - KIS API 연동

3. **모니터링 설정**
   - Railway Analytics
   - 에러 로깅

---

**준비되었습니다! 위 방법 중 하나를 선택해서 진행하세요! 🚀**
