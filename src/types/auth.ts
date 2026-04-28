export type UserRole = 'Guest' | 'Owner';

export interface IUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phoneNumber: number;
  address: string;
  city: string;
  state: string;
  pincode: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: number | null;
  phoneNumber: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  curPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  resetToken: string;
  expiresAt: string;
}
