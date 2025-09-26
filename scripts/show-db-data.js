const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB 연결
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/care_navi';

async function showData() {
  try {
    // MongoDB 연결
    await mongoose.connect(DATABASE_URL);
    console.log('✅ MongoDB 연결 성공\n');
    console.log('='.repeat(60));

    // 데이터베이스 정보
    const db = mongoose.connection.db;
    console.log(`📊 데이터베이스: ${db.databaseName}\n`);
    console.log('='.repeat(60));

    // 컬렉션 목록
    const collections = await db.listCollections().toArray();
    console.log('📁 컬렉션 목록:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('\n' + '='.repeat(60));

    // Users 컬렉션 데이터
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    console.log(`\n👥 Users 컬렉션 (${users.length}개 문서):\n`);

    if (users.length === 0) {
      console.log('  (비어있음 - 아직 등록된 사용자가 없습니다)');
    } else {
      users.forEach((user, index) => {
        console.log(`  [사용자 ${index + 1}]`);
        console.log(`    ID: ${user._id}`);
        console.log(`    이름: ${user.name}`);
        console.log(`    전화번호: ${user.phoneNumber}`);
        console.log(`    생년월일: ${user.birthDate}`);
        console.log(`    사용자 유형: ${user.userType}`);
        console.log(`    활성 상태: ${user.isActive ? '활성' : '비활성'}`);
        console.log(`    등록일: ${user.createdAt}`);
        console.log('');
      });
    }

    console.log('='.repeat(60));

    // CareRequests 컬렉션 데이터
    const careRequestsCollection = db.collection('carerequests');
    const careRequests = await careRequestsCollection.find({}).toArray();

    console.log(`\n📋 CareRequests 컬렉션 (${careRequests.length}개 문서):\n`);

    if (careRequests.length === 0) {
      console.log('  (비어있음)');
    } else {
      careRequests.forEach((request, index) => {
        console.log(`  [요청 ${index + 1}]`);
        console.log(`    ID: ${request._id}`);
        console.log(`    환자 ID: ${request.patientId}`);
        console.log(`    간병인 ID: ${request.caregiverId || '미배정'}`);
        console.log(`    상태: ${request.status}`);
        console.log('');
      });
    }

    console.log('='.repeat(60));

    // Surveys 컬렉션 데이터
    const surveysCollection = db.collection('surveys');
    const surveys = await surveysCollection.find({}).toArray();

    console.log(`\n📊 Surveys 컬렉션 (${surveys.length}개 문서):\n`);

    if (surveys.length === 0) {
      console.log('  (비어있음)');
    } else {
      surveys.forEach((survey, index) => {
        console.log(`  [설문 ${index + 1}]`);
        console.log(`    ID: ${survey._id}`);
        console.log(`    제목: ${survey.title}`);
        console.log(`    설명: ${survey.description}`);
        console.log('');
      });
    }

    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    // 연결 종료
    await mongoose.disconnect();
    console.log('\n✅ MongoDB 연결 종료');
  }
}

// 스크립트 실행
showData();