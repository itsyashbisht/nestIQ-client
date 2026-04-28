import { IUser } from '@/src/types/auth';

export interface IReview {
  _id: string;
  guestId: string | IUser;
  hotelId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
