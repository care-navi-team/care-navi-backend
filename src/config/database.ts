import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const connectionString = process.env.DATABASE_URL || 'mongodb://localhost:27017/care_navi';

    await mongoose.connect(connectionString);

    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    console.log('서버는 계속 실행됩니다 (DB 기능 제외)');
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 연결이 끊어졌습니다');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB 연결 오류:', error);
});

export default connectDB;