# Railway 배포 가이드

## 🚀 Railway 배포 단계

### 1. Railway 계정 생성
1. [Railway.app](https://railway.app) 접속
2. GitHub 계정으로 로그인

### 2. GitHub 저장소 생성
```bash
# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/your-username/care_navi_backend.git
git branch -M main
git push -u origin main
```

### 3. Railway 프로젝트 생성
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. `care_navi_backend` 저장소 선택
4. 자동으로 배포 시작

### 4. MongoDB 추가
1. 프로젝트에서 "Add Service" 클릭
2. "Database" → "MongoDB" 선택
3. 자동으로 `DATABASE_URL` 환경변수 생성됨

### 5. 환경변수 설정
Railway 프로젝트의 Variables 탭에서 설정:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=*
```

### 6. 도메인 확인
- Railway에서 자동으로 도메인 생성 (예: `https://care-navi-backend-production.up.railway.app`)
- Custom Domain 설정 가능

## 📝 배포 후 확인사항

### API 테스트
```bash
# 서버 상태 확인
curl https://your-app.railway.app/

# API 문서 접근
https://your-app.railway.app/api-docs
```

### 환경변수 확인
- `DATABASE_URL`: MongoDB 연결 문자열
- `JWT_SECRET`: 강력한 시크릿 키 설정
- `NODE_ENV`: production으로 설정
- `CORS_ORIGIN`: 프론트엔드 도메인 또는 *

## 🔄 자동 배포
- GitHub에 push할 때마다 자동으로 재배포됨
- 배포 로그는 Railway 대시보드에서 확인 가능

## 💰 비용
- 월 $5 플랜 사용 시 충분한 리소스 제공
- MongoDB 포함 (추가 비용 없음)
- SSL 인증서 자동 제공

## 🔗 최종 결과
배포 완료 후 프론트 개발자에게 제공할 정보:
- API Base URL: `https://your-app.railway.app/api`
- API 문서: `https://your-app.railway.app/api-docs`
- 상태 확인: `https://your-app.railway.app/health`