import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error'],
});

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL 연결 성공');
  } catch (error) {
    console.error('PostgreSQL 연결 실패:', error);
    console.log('서버는 계속 실행됩니다 (DB 기능 제외)');
  }
};

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default connectDB;