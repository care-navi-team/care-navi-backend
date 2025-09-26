import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
  phoneNumber: string;
  userType: string;
  kakaoId?: string;
  iat: number;
  exp: number;
}

/**
 * JWT 토큰 인증 미들웨어
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: '액세스 토큰이 필요합니다'
      });
      return;
    }

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      });
      return;
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      });
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 */
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
      return;
    }

    if (user.userType !== 'admin') {
      res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 케어기버 또는 관리자 권한 확인 미들웨어
 */
export const requireCaregiverOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
      return;
    }

    if (user.userType !== 'caregiver' && user.userType !== 'admin') {
      res.status(403).json({
        success: false,
        message: '케어기버 또는 관리자 권한이 필요합니다'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Caregiver middleware error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없어도 통과)
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // 토큰이 없어도 계속 진행
      next();
      return;
    }

    // 토큰이 있으면 검증
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    // 토큰 검증에 실패해도 계속 진행 (선택적 인증)
    next();
  }
};