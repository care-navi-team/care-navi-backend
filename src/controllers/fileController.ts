import { Request, Response } from 'express';
import { prisma } from '../config/database';

// 인증된 사용자 정보를 포함한 Request 타입
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    phoneNumber: string;
    userType: string;
  };
}

/**
 * 파일 업로드 처리
 */
export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 파일이 업로드되지 않은 경우
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '파일을 선택해주세요.'
      });
    }

    // 인증되지 않은 사용자
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    const { filename, originalname, path, size, mimetype } = req.file;

    // 데이터베이스에 파일 정보 저장
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId: req.user.id,
        fileName: filename,
        originalName: originalname,
        filePath: path,
        fileSize: size,
        mimeType: mimetype,
      }
    });

    res.status(201).json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      data: {
        id: uploadedFile.id,
        fileName: uploadedFile.fileName,
        originalName: uploadedFile.originalName,
        fileSize: uploadedFile.fileSize,
        uploadDate: uploadedFile.uploadDate
      }
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

/**
 * 사용자의 업로드된 파일 목록 조회
 */
export const getUserFiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    const files = await prisma.uploadedFile.findMany({
      where: {
        userId: req.user.id
      },
      select: {
        id: true,
        fileName: true,
        originalName: true,
        fileSize: true,
        uploadDate: true
      },
      orderBy: {
        uploadDate: 'desc'
      }
    });

    res.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

/**
 * 파일 삭제
 */
export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    // 파일이 사용자의 것인지 확인
    const file = await prisma.uploadedFile.findFirst({
      where: {
        id: fileId,
        userId: req.user.id
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '파일을 찾을 수 없습니다.'
      });
    }

    // 파일 삭제
    await prisma.uploadedFile.delete({
      where: {
        id: fileId
      }
    });

    // TODO: 실제 파일 시스템에서도 파일 삭제
    // fs.unlink(file.filePath, (err) => { ... });

    res.json({
      success: true,
      message: '파일이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('파일 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};