import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  password: string;
  phoneNumber: string;
  birthDate: Date;
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
    password: {
      type: String,
      required: [true, '비밀번호를 입력해주세요'],
      minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
    },
    phoneNumber: {
      type: String,
      required: [true, '전화번호를 입력해주세요'],
      unique: true,
      match: [/^[0-9-+\s()]+$/, '올바른 전화번호 형식을 입력해주세요']
    },
    birthDate: {
      type: Date,
      required: [true, '생년월일을 입력해주세요'],
      validate: {
        validator: function(value: Date) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 0 && age <= 120;
        },
        message: '올바른 생년월일을 입력해주세요'
      }
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

UserSchema.index({ phoneNumber: 1 });

export default mongoose.model<IUser>('User', UserSchema);