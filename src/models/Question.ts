import mongoose, { Document, Schema } from 'mongoose';

export interface IOption {
  text: string;
  score: number;
}

export interface IQuestion extends Document {
  surveyId: mongoose.Types.ObjectId;
  questionNumber: number;
  questionText: string;
  options: IOption[];
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema: Schema = new Schema({
  text: {
    type: String,
    required: [true, '선택지 텍스트를 입력해주세요'],
    trim: true
  },
  score: {
    type: Number,
    required: [true, '점수를 입력해주세요'],
    min: [0, '점수는 0 이상이어야 합니다']
  }
}, { _id: false });

const QuestionSchema: Schema = new Schema(
  {
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, '설문 ID를 입력해주세요']
    },
    questionNumber: {
      type: Number,
      required: [true, '문항 번호를 입력해주세요'],
      min: [1, '문항 번호는 1 이상이어야 합니다']
    },
    questionText: {
      type: String,
      required: [true, '문항 내용을 입력해주세요'],
      trim: true,
      maxlength: [500, '문항은 500자 이내로 입력해주세요']
    },
    options: {
      type: [OptionSchema],
      required: [true, '선택지를 입력해주세요'],
      validate: {
        validator: function(options: IOption[]) {
          return options.length >= 2;
        },
        message: '최소 2개 이상의 선택지가 필요합니다'
      }
    }
  },
  {
    timestamps: true
  }
);

QuestionSchema.index({ surveyId: 1, questionNumber: 1 }, { unique: true });

export default mongoose.model<IQuestion>('Question', QuestionSchema);