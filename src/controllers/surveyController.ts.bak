import { Request, Response, NextFunction } from 'express';
import Survey from '../models/Survey';
import Question from '../models/Question';
import SurveyResponse from '../models/SurveyResponse';
import SurveyResult from '../models/SurveyResult';
import { AppError } from '../middleware/errorHandler';
import { seedExerciseSurveyData } from '../utils/seedSurveyData';

export const getAllSurveys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const filter: any = { isActive: true };
    if (category) filter.category = category;

    const surveys = await Survey.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: surveys.length,
      data: surveys
    });
  } catch (error) {
    next(error);
  }
};

export const getSurveyWithQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findById(id);
    if (!survey || !survey.isActive) {
      const error = new Error('설문을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    const questions = await Question.find({ surveyId: id }).sort({ questionNumber: 1 });

    res.status(200).json({
      success: true,
      data: {
        survey,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitSurveyResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: surveyId } = req.params;
    const { userId, answers } = req.body;

    // 설문 존재 여부 확인
    const survey = await Survey.findById(surveyId);
    if (!survey || !survey.isActive) {
      const error = new Error('설문을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    // 문항들 가져오기
    const questions = await Question.find({ surveyId }).sort({ questionNumber: 1 });

    if (answers.length !== questions.length) {
      const error = new Error('모든 문항에 응답해주세요') as AppError;
      error.statusCode = 400;
      return next(error);
    }

    // 답변 검증 및 점수 계산
    let totalScore = 0;
    const processedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const question = questions[i];

      if (answer.questionId !== (question._id as any).toString()) {
        const error = new Error('문항 순서가 올바르지 않습니다') as AppError;
        error.statusCode = 400;
        return next(error);
      }

      if (answer.selectedOptionIndex < 0 || answer.selectedOptionIndex >= question.options.length) {
        const error = new Error('유효하지 않은 선택지입니다') as AppError;
        error.statusCode = 400;
        return next(error);
      }

      const selectedOption = question.options[answer.selectedOptionIndex];
      const score = selectedOption.score;
      totalScore += score;

      processedAnswers.push({
        questionId: question._id as any,
        selectedOptionIndex: answer.selectedOptionIndex,
        score
      });
    }

    // 점수에 따른 결과 찾기
    const result = await SurveyResult.findOne({
      surveyId,
      minScore: { $lte: totalScore },
      maxScore: { $gte: totalScore }
    });

    if (!result) {
      const error = new Error('결과를 찾을 수 없습니다') as AppError;
      error.statusCode = 500;
      return next(error);
    }

    // 응답 저장
    const surveyResponse = await SurveyResponse.create({
      userId,
      surveyId,
      answers: processedAnswers,
      totalScore,
      resultId: result._id
    });

    // 결과와 함께 응답 반환
    const populatedResponse = await SurveyResponse.findById(surveyResponse._id)
      .populate('surveyId', 'title description category')
      .populate('resultId');

    res.status(201).json({
      success: true,
      data: populatedResponse
    });
  } catch (error) {
    next(error);
  }
};

export const getSurveyResponseResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { responseId } = req.params;

    const response = await SurveyResponse.findById(responseId)
      .populate('surveyId', 'title description category')
      .populate('resultId')
      .populate('userId', 'name phoneNumber');

    if (!response) {
      const error = new Error('응답을 찾을 수 없습니다') as AppError;
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSurveyHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const responses = await SurveyResponse.find({ userId })
      .populate('surveyId', 'title description category')
      .populate('resultId', 'level levelText summary')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await SurveyResponse.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: responses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: responses
    });
  } catch (error) {
    next(error);
  }
};

export const initializeSurveyData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 기존 운동 설문 데이터가 있는지 확인
    const existingSurvey = await Survey.findOne({
      title: '운동 습관 설문지',
      category: 'exercise'
    });

    if (existingSurvey) {
      return res.status(200).json({
        success: true,
        message: '설문 데이터가 이미 존재합니다',
        data: { surveyId: existingSurvey._id }
      });
    }

    // 새로운 설문 데이터 생성
    const surveyId = await seedExerciseSurveyData();

    res.status(201).json({
      success: true,
      message: '설문 데이터가 성공적으로 초기화되었습니다',
      data: { surveyId }
    });
  } catch (error) {
    next(error);
  }
};