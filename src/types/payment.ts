import { IBooking } from '@/src/types/booking';

export interface verifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}

export interface getRazorpayKeyResponse {
  razorpaykeyId: string;
}

export interface verifyPaymentResponse {
  verified: boolean;
  booking: IBooking;
}
