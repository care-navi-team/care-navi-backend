import { Request, Response, NextFunction } from 'express';
import CareRequest, { ICareRequest } from '../models/CareRequest';
import { AppError } from '../middleware/errorHandler';

export const getAllCareRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, careType, urgency } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (careType) filter.careType = careType;
    if (urgency) filter.urgency = urgency;

    const careRequests = await CareRequest.find(filter)
      .populate('patient', 'name email phoneNumber')
      .populate('caregiver', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: careRequests.length,
      data: careRequests
    });
  } catch (error) {
    next(error);
  }
};

export const getCareRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const careRequest = await CareRequest.findById(req.params.id)
      .populate('patient', 'name email phoneNumber address')
      .populate('caregiver', 'name email phoneNumber');

    if (!careRequest) {
      const error = new Error('케어 요청을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: careRequest
    });
  } catch (error) {
    next(error);
  }
};

export const createCareRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const careRequest = await CareRequest.create(req.body);

    const populatedRequest = await CareRequest.findById(careRequest._id)
      .populate('patient', 'name email phoneNumber');

    res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

export const updateCareRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const careRequest = await CareRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('patient', 'name email phoneNumber')
     .populate('caregiver', 'name email phoneNumber');

    if (!careRequest) {
      const error = new Error('케어 요청을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: careRequest
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCareRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const careRequest = await CareRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!careRequest) {
      const error = new Error('케어 요청을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: '케어 요청이 취소되었습니다'
    });
  } catch (error) {
    next(error);
  }
};

export const assignCaregiver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caregiverId } = req.body;

    const careRequest = await CareRequest.findByIdAndUpdate(
      req.params.id,
      {
        caregiver: caregiverId,
        status: 'assigned'
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('patient', 'name email phoneNumber')
     .populate('caregiver', 'name email phoneNumber');

    if (!careRequest) {
      const error = new Error('케어 요청을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: careRequest
    });
  } catch (error) {
    next(error);
  }
};