import multer from 'multer';
import path from 'path';
import fs from 'fs';

// uploads 폴더 생성
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  }
});

// 파일 필터 (PDF만 허용)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('파일 필터 체크:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fieldname: file.fieldname
  });

  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    console.error('잘못된 파일 타입:', file.mimetype);
    cb(new Error('PDF 파일만 업로드 가능합니다.'));
  }
};

// Multer 설정
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  }
});

export default upload;