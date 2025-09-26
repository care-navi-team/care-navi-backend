import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        birthDate: true,
        userType: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        birthDate: true,
        userType: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      const error = new Error('사용자를 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        birthDate: true,
        userType: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.status(200).json({
      success: true,
      message: '사용자가 비활성화되었습니다'
    });
  } catch (error) {
    next(error);
  }
};