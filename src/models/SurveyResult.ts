import mongoose, { Document, Schema } from 'mongoose';

export interface ISurveyResult extends Document {
  surveyId: mongoose.Types.ObjectId;
  minScore: number;
  maxScore: number;
  level: 'excellent' | 'good' | 'caution' | 'warning' | 'critical';
  levelText: string;
  summary: string;
  consulting: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SurveyResultSchema: Schema = new Schema(
  {
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, '설문 ID를 입력해주세요']
    },
    minScore: {
      type: Number,
      required: [true, '최소 점수를 입력해주세요'],
      min: [0, '점수는 0 이상이어야 합니다']
    },
    maxScore: {
      type: Number,
      required: [true, '최대 점수를 입력해주세요'],
      min: [0, '점수는 0 이상이어야 합니다']
    },
    level: {
      type: String,
      enum: ['excellent', 'good', 'caution', 'warning', 'critical'],
      required: [true, '결과 레벨을 선택해주세요']
    },
    levelText: {
      type: String,
      required: [true, '레벨 텍스트를 입력해주세요'],
      trim: true,
      maxlength: [50, '레벨 텍스트는 50자 이내로 입력해주세요']
    },
    summary: {
      type: String,
      required: [true, '요약문을 입력해주세요'],
      trim: true,
      maxlength: [1000, '요약문은 1000자 이내로 입력해주세요']
    },
    consulting: {
      type: [String],
      required: [true, '생활 컨설팅을 입력해주세요'],
      validate: {
        validator: function(consulting: string[]) {
          return consulting.length > 0 && consulting.every(item => item.length <= 500);
        },
        message: '컨설팅 항목은 최소 1개 이상이고, 각 항목은 500자 이내여야 합니다'
      }
    }
  },
  {
    timestamps: true
  }
);

SurveyResultSchema.index({ surveyId: 1, minScore: 1, maxScore: 1 });

export default mongoose.model<ISurveyResult>('SurveyResult', SurveyResultSchema);