import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";
import { verifyPaymentRequest } from "@/types/payment";

export const paymentServices = {
  getRazorpayKeyId() {
    return REQUEST.get(ROUTES.PAYMENT.GET_KEY);
  },
  verifyPayment(payload: verifyPaymentRequest) {
    return REQUEST.post(ROUTES.PAYMENT.VERIFY, payload);
  },
};
