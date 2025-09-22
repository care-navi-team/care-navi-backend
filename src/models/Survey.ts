import mongoose, { Document, Schema } from 'mongoose';

export interface ISurvey extends Document {
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'mental_health' | 'lifestyle';
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SurveySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '설문 제목을 입력해주세요'],
      trim: true,
      maxlength: [100, '제목은 100자 이내로 입력해주세요']
    },
    description: {
      type: String,
      required: [true, '설문 설명을 입력해주세요'],
      maxlength: [500, '설명은 500자 이내로 입력해주세요']
    },
    category: {
      type: String,
      enum: ['exercise', 'nutrition', 'mental_health', 'lifestyle'],
      required: [true, '설문 카테고리를 선택해주세요']
    },
    version: {
      type: String,
      required: [true, '버전을 입력해주세요'],
      default: '1.0'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

SurveySchema.index({ category: 1, isActive: 1 });

export default mongoose.model<ISurvey>('Survey', SurveySchema);