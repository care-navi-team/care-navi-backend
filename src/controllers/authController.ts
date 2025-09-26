import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/database';
import { IUser, CreateUserInput } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// JWT_SECRET이 문자열임을 보장
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * 로그인
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, password } = req.body;

    // 입력 검증
    if (!phoneNumber || !password) {
      res.status(400).json({
        success: false,
        message: '전화번호와 비밀번호를 입력해주세요'
      });
      return;
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
        isActive: true
      }
    });
    if (!user) {
      res.status(401).json({
        success: false,
        message: '전화번호 또는 비밀번호가 올바르지 않습니다'
      });
      return;
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: '전화번호 또는 비밀번호가 올바르지 않습니다'
      });
      return;
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user.id,
        phoneNumber: user.phoneNumber,
        userType: user.userType
      },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    // 비밀번호 제외하고 사용자 정보 반환
    const userResponse = {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다',
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 회원가입
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, phoneNumber, birthDate, userType } = req.body;

    // 입력 검증
    if (!name || !password || !phoneNumber || !birthDate) {
      res.status(400).json({
        success: false,
        message: '모든 필수 정보를 입력해주세요'
      });
      return;
    }

    // 이미 존재하는 전화번호 확인
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: '이미 등록된 전화번호입니다'
      });
      return;
    }

    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        phoneNumber,
        birthDate: new Date(birthDate),
        userType: userType || 'patient'
      }
    });

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user.id,
        phoneNumber: user.phoneNumber,
        userType: user.userType
      },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    // 비밀번호 제외하고 사용자 정보 반환
    const userResponse = {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      success: true,
      message: '회원가입에 성공했습니다',
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 현재 사용자 정보 조회
 * @route GET /api/auth/me
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
      return;
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};

/**
 * 토큰 갱신
 * @route POST /api/auth/refresh
 */
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
      return;
    }

    // 새 토큰 생성
    const token = jwt.sign(
      {
        userId: user.id,
        phoneNumber: user.phoneNumber,
        userType: user.userType
      },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    res.status(200).json({
      success: true,
      message: '토큰이 갱신되었습니다',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
};