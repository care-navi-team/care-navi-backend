import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');

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
    const user = await User.findById(req.params.id).select('-password');

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

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, password, phoneNumber, birthDate, userType } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      const error = new Error('이미 존재하는 전화번호입니다') as AppError;
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.create({
      name,
      password,
      phoneNumber,
      birthDate,
      userType
    });

    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      const error = new Error('사용자를 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: '사용자가 삭제되었습니다'
    });
  } catch (error) {
    next(error);
  }
};