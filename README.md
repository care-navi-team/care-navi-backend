# Care Navi Backend API

케어 네비게이션 시스템의 백엔드 API 서버입니다.

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📚 API 문서

서버 실행 후 다음 URL에서 Swagger 문서를 확인할 수 있습니다:

```
http://localhost:3000/api-docs
```

## 🔗 API 엔드포인트

### 기본 정보
- **Base URL**: `http://localhost:3000`
- **API Base**: `http://localhost:3000/api`

### 사용자 관리 (Users)
```
GET    /api/users          # 사용자 목록 조회
POST   /api/users          # 새 사용자 생성
GET    /api/users/:id      # 특정 사용자 조회
PUT    /api/users/:id      # 사용자 정보 수정
DELETE /api/users/:id      # 사용자 삭제
```

### 케어 요청 관리 (Care Requests)
```
GET    /api/care           # 케어 요청 목록 조회
POST   /api/care           # 새 케어 요청 생성
GET    /api/care/:id       # 특정 케어 요청 조회
PUT    /api/care/:id       # 케어 요청 수정
DELETE /api/care/:id       # 케어 요청 삭제
PUT    /api/care/:id/assign # 케어기버 배정
```

### 기타
```
GET    /                   # 서버 상태 확인
GET    /health             # 헬스체크
```

## 📄 데이터 스키마

### User 스키마
```typescript
{
  name: string;           // 이름 (필수)
  email: string;          // 이메일 (필수, 유니크)
  password: string;       // 비밀번호 (필수, 최소 6자)
  phoneNumber?: string;   // 전화번호
  address?: string;       // 주소
  userType: 'patient' | 'caregiver' | 'admin'; // 사용자 유형 (필수)
  isActive: boolean;      // 활성 상태
}
```

### CareRequest 스키마
```typescript
{
  patient: ObjectId;      // 환자 ID (필수)
  caregiver?: ObjectId;   // 케어기버 ID
  title: string;          // 제목 (필수)
  description: string;    // 설명 (필수)
  careType: 'medical' | 'daily' | 'emergency' | 'companion'; // 케어 유형 (필수)
  urgency: 'low' | 'medium' | 'high' | 'critical'; // 긴급도
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'; // 상태
  scheduledDate: Date;    // 예정일 (필수)
  duration: number;       // 소요시간 분 (필수, 최소 30분)
  location: {
    address: string;      // 주소 (필수)
    latitude?: number;    // 위도
    longitude?: number;   // 경도
  };
  requirements: string[]; // 요구사항 배열
  budget?: number;        // 예산
  notes?: string;         // 비고
}
```

## 📱 프론트엔드 연동 예시

### 사용자 생성
```javascript
const createUser = async (userData) => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

### 케어 요청 목록 조회
```javascript
const getCareRequests = async () => {
  const response = await fetch('http://localhost:3000/api/care');
  return response.json();
};
```

## 🔧 환경 설정

`.env` 파일 예시:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/care_navi
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

## 📝 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {...},
  "count": 10  // 목록 조회 시만
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "message": "에러 메시지"
  }
}
```

## 🛠 개발 환경

- Node.js 18+
- TypeScript
- Express.js
- MongoDB + Mongoose
- Swagger/OpenAPI 3.0

## 📞 문의

API 관련 문의사항이 있으시면 언제든지 연락주세요!