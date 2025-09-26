import { User, UserType } from '@prisma/client';

export interface IUser {
  id: string;
  name: string;
  password: string | null;
  phoneNumber: string | null;
  birthDate: Date | null;
  userType: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  kakaoId?: string | null;
  email?: string | null;
  profileImage?: string | null;
}

export type CreateUserInput = {
  name: string;
  password: string;
  phoneNumber: string;
  birthDate: Date;
  userType?: UserType;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'phoneNumber'>>;

export { User, UserType };