import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  userType: 'patient' | 'caregiver' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '이름을 입력해주세요'],
      trim: true,
      maxlength: [50, '이름은 50자 이내로 입력해주세요']
    },
    email: {
      type: String,
      required: [true, '이메일을 입력해주세요'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        '올바른 이메일 형식을 입력해주세요'
      ]
    },
    password: {
      type: String,
      required: [true, '비밀번호를 입력해주세요'],
      minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
    },
    phoneNumber: {
      type: String,
      match: [/^[0-9-+\s()]+$/, '올바른 전화번호 형식을 입력해주세요']
    },
    address: {
      type: String,
      maxlength: [200, '주소는 200자 이내로 입력해주세요']
    },
    userType: {
      type: String,
      enum: ['patient', 'caregiver', 'admin'],
      required: [true, '사용자 유형을 선택해주세요'],
      default: 'patient'
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

UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);