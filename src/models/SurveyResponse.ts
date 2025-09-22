import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedOptionIndex: number;
  score: number;
}

export interface ISurveyResponse extends Document {
  userId: mongoose.Types.ObjectId;
  surveyId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  totalScore: number;
  resultId: mongoose.Types.ObjectId;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, '문항 ID를 입력해주세요']
  },
  selectedOptionIndex: {
    type: Number,
    required: [true, '선택한 옵션 인덱스를 입력해주세요'],
    min: [0, '옵션 인덱스는 0 이상이어야 합니다']
  },
  score: {
    type: Number,
    required: [true, '점수를 입력해주세요'],
    min: [0, '점수는 0 이상이어야 합니다']
  }
}, { _id: false });

const SurveyResponseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '사용자 ID를 입력해주세요']
    },
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, '설문 ID를 입력해주세요']
    },
    answers: {
      type: [AnswerSchema],
      required: [true, '응답을 입력해주세요'],
      validate: {
        validator: function(answers: IAnswer[]) {
          return answers.length > 0;
        },
        message: '최소 1개 이상의 응답이 필요합니다'
      }
    },
    totalScore: {
      type: Number,
      required: [true, '총점을 입력해주세요'],
      min: [0, '총점은 0 이상이어야 합니다']
    },
    resultId: {
      type: Schema.Types.ObjectId,
      ref: 'SurveyResult',
      required: [true, '결과 ID를 입력해주세요']
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

SurveyResponseSchema.index({ userId: 1, surveyId: 1 });
SurveyResponseSchema.index({ surveyId: 1, completedAt: -1 });

export default mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);