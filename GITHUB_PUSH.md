# 🚀 GitHub 푸시 가이드

코드가 모두 준비되었습니다! 이제 GitHub에 푸시하는 방법을 안내합니다.

---

## 방법 1: GitHub Desktop 사용 (가장 쉬움) ⭐

1. **GitHub Desktop 다운로드**
   - https://desktop.github.com/
   - 설치 및 GitHub 계정 로그인

2. **레포지토리 추가**
   - File → Add Local Repository
   - `/Users/yoyogo/Documents/claude/hellodd` 선택

3. **푸시**
   - "Publish repository" 또는 "Push origin" 클릭
   - ✅ 완료!

---

## 방법 2: Personal Access Token 사용

### 1단계: GitHub에서 Token 생성

1. **GitHub 접속**
   - https://github.com/settings/tokens

2. **New token (classic) 생성**
   - Token name: `hellodd-deploy`
   - Expiration: `90 days`
   - 권한 선택:
     - ✅ `repo` (전체)
   - "Generate token" 클릭
   - **토큰을 복사하고 저장하세요** (다시 볼 수 없음)

### 2단계: 터미널에서 푸시

```bash
# 푸시 실행
git push -u origin main

# Username 입력: yoyogo96
# Password 입력: (위에서 복사한 토큰 붙여넣기)
```

---

## 방법 3: SSH 키 사용

### 1단계: SSH 키 생성

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your-email@example.com"

# Enter 3번 (기본 설정)

# 공개키 복사
cat ~/.ssh/id_ed25519.pub
```

### 2단계: GitHub에 SSH 키 등록

1. **GitHub 접속**
   - https://github.com/settings/keys

2. **New SSH key**
   - Title: `MacBook`
   - Key: (복사한 공개키 붙여넣기)
   - "Add SSH key" 클릭

### 3단계: 원격 저장소 URL 변경

```bash
# HTTPS → SSH로 변경
git remote set-url origin git@github.com:yoyogo96/hellodd.git

# 푸시
git push -u origin main
```

---

## 방법 4: GitHub CLI 사용

```bash
# GitHub CLI 설치 (Homebrew)
brew install gh

# 로그인
gh auth login

# 푸시
git push -u origin main
```

---

## ✅ 푸시 성공 확인

푸시가 완료되면:

1. **GitHub 저장소 확인**
   - https://github.com/yoyogo96/hellodd

2. **파일 확인**
   - README.md
   - client/
   - server/
   - railway.json
   - nixpacks.toml

---

## 🚀 다음 단계: Railway 배포

GitHub 푸시가 완료되면:

1. **Railway 접속**
   - https://railway.app

2. **로그인**
   - "Login with GitHub"

3. **프로젝트 배포**
   - "New Project"
   - "Deploy from GitHub repo"
   - `yoyogo96/hellodd` 선택
   - "Deploy Now"

4. **완료!**
   - 3-5분 후 배포 완료
   - Railway 도메인 자동 생성

---

## 💡 추천 방법

- **Mac 사용자**: GitHub Desktop (가장 쉬움)
- **터미널 선호**: Personal Access Token
- **장기 사용**: SSH 키 설정

---

## 현재 상태

```bash
# 저장소: https://github.com/yoyogo96/hellodd
# 브랜치: main
# 커밋: 3개
# 파일: 모두 준비됨 ✅
```

**인증만 하면 바로 푸시할 수 있습니다!** 🚀
