import express from 'express';
import { upload } from '../config/multer';
import { uploadFile, getUserFiles, deleteFile } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: 파일 업로드
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 PDF 파일
 *     responses:
 *       201:
 *         description: 파일 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fileName:
 *                           type: string
 *                         originalName:
 *                           type: string
 *                         fileSize:
 *                           type: integer
 *                         uploadDate:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 파일이 선택되지 않음 또는 잘못된 파일 형식
 *       401:
 *         description: 인증 실패
 *       413:
 *         description: 파일 크기 초과
 */
router.post('/upload', authenticateToken, upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: 사용자의 업로드된 파일 목록 조회
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 파일 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fileName:
 *                             type: string
 *                           originalName:
 *                             type: string
 *                           fileSize:
 *                             type: integer
 *                           uploadDate:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: 인증 실패
 */
router.get('/', authenticateToken, getUserFiles);

/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: 파일 삭제
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: 파일 ID
 *     responses:
 *       200:
 *         description: 파일 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 파일을 찾을 수 없음
 */
router.delete('/:fileId', authenticateToken, deleteFile);

export default router;