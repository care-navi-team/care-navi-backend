const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function createTestUser() {
  try {
    console.log('테스트 사용자 생성 중...\n');

    // 회원가입 요청
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: '홍길동',
      password: 'test1234',
      phoneNumber: '010-1234-5678',
      birthDate: '1990-01-15',
      userType: 'patient'
    });

    if (response.data.success) {
      console.log('✅ 테스트 사용자 생성 성공!\n');
      console.log('생성된 사용자 정보:');
      console.log('=====================================');
      console.log('이름:', response.data.data.user.name);
      console.log('전화번호:', response.data.data.user.phoneNumber);
      console.log('생년월일:', response.data.data.user.birthDate);
      console.log('사용자 유형:', response.data.data.user.userType);
      console.log('사용자 ID:', response.data.data.user._id);
      console.log('=====================================\n');
      console.log('로그인 정보:');
      console.log('전화번호: 010-1234-5678');
      console.log('비밀번호: test1234');
    } else {
      console.log('❌ 사용자 생성 실패:', response.data.message);
    }
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('⚠️  이미 등록된 전화번호입니다.');
      console.log('로그인 정보:');
      console.log('전화번호: 010-1234-5678');
      console.log('비밀번호: test1234');
    } else {
      console.error('❌ 오류:', error.message);
      console.log('\n💡 백엔드 서버가 실행 중인지 확인하세요:');
      console.log('   cd ../care_navi_backend && npm run dev');
    }
  }
}

createTestUser();