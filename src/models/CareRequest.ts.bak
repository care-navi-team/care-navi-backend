import mongoose, { Document, Schema } from 'mongoose';

export interface ICareRequest extends Document {
  patient: mongoose.Types.ObjectId;
  caregiver?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  careType: 'medical' | 'daily' | 'emergency' | 'companion';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  duration: number;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  requirements: string[];
  budget?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CareRequestSchema: Schema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '환자 정보는 필수입니다']
    },
    caregiver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, '케어 제목을 입력해주세요'],
      trim: true,
      maxlength: [100, '제목은 100자 이내로 입력해주세요']
    },
    description: {
      type: String,
      required: [true, '케어 상세 내용을 입력해주세요'],
      maxlength: [500, '설명은 500자 이내로 입력해주세요']
    },
    careType: {
      type: String,
      enum: ['medical', 'daily', 'emergency', 'companion'],
      required: [true, '케어 유형을 선택해주세요']
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: [true, '긴급도를 선택해주세요'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    scheduledDate: {
      type: Date,
      required: [true, '예정일을 선택해주세요']
    },
    duration: {
      type: Number,
      required: [true, '예상 소요시간을 입력해주세요'],
      min: [30, '최소 30분 이상이어야 합니다']
    },
    location: {
      address: {
        type: String,
        required: [true, '주소를 입력해주세요']
      },
      latitude: Number,
      longitude: Number
    },
    requirements: [{
      type: String,
      trim: true
    }],
    budget: {
      type: Number,
      min: [0, '예산은 0 이상이어야 합니다']
    },
    notes: {
      type: String,
      maxlength: [300, '비고는 300자 이내로 입력해주세요']
    }
  },
  {
    timestamps: true
  }
);

CareRequestSchema.index({ patient: 1, status: 1 });
CareRequestSchema.index({ caregiver: 1, status: 1 });
CareRequestSchema.index({ careType: 1, urgency: 1 });

export default mongoose.model<ICareRequest>('CareRequest', CareRequestSchema);