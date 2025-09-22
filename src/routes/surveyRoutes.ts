import express from 'express';
import {
  getAllSurveys,
  getSurveyWithQuestions,
  submitSurveyResponse,
  getSurveyResponseResult,
  getUserSurveyHistory,
  initializeSurveyData
} from '../controllers/surveyController';

const router = express.Router();

/**
 * @swagger
 * /api/surveys:
 *   get:
 *     summary: 모든 설문 조회
 *     tags: [Surveys]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [exercise, nutrition, mental_health, lifestyle]
 *         description: 설문 카테고리 필터
 *     responses:
 *       200:
 *         description: 설문 목록 조회 성공
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
 *                         $ref: '#/components/schemas/Survey'
 *   post:
 *     summary: 설문 데이터 초기화 (운동 습관 설문 생성)
 *     tags: [Surveys]
 *     responses:
 *       201:
 *         description: 설문 데이터 초기화 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       200:
 *         description: 설문 데이터가 이미 존재함
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.route('/')
  .get(getAllSurveys)
  .post(initializeSurveyData);

/**
 * @swagger
 * /api/surveys/{id}:
 *   get:
 *     summary: 설문 상세 조회 (문항 포함)
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 설문 ID
 *     responses:
 *       200:
 *         description: 설문 상세 조회 성공
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
 *                         survey:
 *                           $ref: '#/components/schemas/Survey'
 *                         questions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Question'
 *       404:
 *         description: 설문을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id')
  .get(getSurveyWithQuestions);

/**
 * @swagger
 * /api/surveys/{id}/responses:
 *   post:
 *     summary: 설문 응답 제출
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 설문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - answers
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *                 example: "60d5ecb54b33c57634a5e5d2"
 *               answers:
 *                 type: array
 *                 description: 문항별 응답
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: 문항 ID
 *                     selectedOptionIndex:
 *                       type: number
 *                       description: 선택한 옵션 인덱스 (0부터 시작)
 *                       minimum: 0
 *                 example:
 *                   - questionId: "60d5ecb54b33c57634a5e5d3"
 *                     selectedOptionIndex: 2
 *                   - questionId: "60d5ecb54b33c57634a5e5d4"
 *                     selectedOptionIndex: 1
 *     responses:
 *       201:
 *         description: 설문 응답 제출 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SurveyResponse'
 *       400:
 *         description: 잘못된 요청 (응답 누락, 유효하지 않은 선택지 등)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 설문을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id/responses')
  .post(submitSurveyResponse);

/**
 * @swagger
 * /api/surveys/responses/{responseId}/result:
 *   get:
 *     summary: 설문 응답 결과 조회
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *         description: 응답 ID
 *     responses:
 *       200:
 *         description: 설문 결과 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SurveyResponse'
 *       404:
 *         description: 응답을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/responses/:responseId/result')
  .get(getSurveyResponseResult);

/**
 * @swagger
 * /api/surveys/users/{userId}/history:
 *   get:
 *     summary: 사용자 설문 이력 조회
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 사용자 설문 이력 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       description: 전체 응답 수
 *                     page:
 *                       type: number
 *                       description: 현재 페이지
 *                     pages:
 *                       type: number
 *                       description: 전체 페이지 수
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SurveyResponse'
 */
router.route('/users/:userId/history')
  .get(getUserSurveyHistory);

export default router;