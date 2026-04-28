import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";

interface verifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}

export const paymentServices = {
  getRazorpayKeyId() {
    return REQUEST.get(ROUTES.PAYMENT.GET_KEY);
  },
  verifyPayment(payload: verifyPayload) {
    return REQUEST.post(ROUTES.PAYMENT.VERIFY, payload);
  },
};
