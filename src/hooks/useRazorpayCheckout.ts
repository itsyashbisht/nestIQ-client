"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loadRazorpay } from "@/lib/loadRazorpay";
import { verifyPayment } from "@/thunks/payment.thunk";
import { clearCurrentBooking } from "@/slices/booking.slice";
import { toast } from "react-toastify";
import { IUser } from "@/types/auth";

interface CheckoutOptions {
  bookingId: string;
  razorpayOrderId: string;
  amount: number; // INR — NOT paise
  hotelName: string;
  user: IUser;
  method: {
    netbanking: boolean;
    card: boolean;
    upi: boolean;
    wallet: boolean;
  };
}

export function useRazorpayCheckout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const keyId = useAppSelector((state) => state.payment.razorpayKeyId);
  const [paying, setPaying] = useState(false);

  async function openCheckout(opts: CheckoutOptions) {
    setPaying(true);

    // 1. Load SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error(
        "Payment system failed to load. Check you internet connection and try again.",
      );
      setPaying(false);
      return;
    }

    // 2. Validate key exists
    if (!keyId) {
      toast.error(
        "Payment configuration missing. Please refresh and try again.",
      );
      setPaying(false);
      return;
    }

    // 3. Open Razorpay modal
    const rzp = new window.Razorpay({
      key: keyId,
      amount: opts.amount * 100,
      currency: "INR",
      order_id: opts.razorpayOrderId,
      name: "NestIQ",
      description: `Booking at ${opts.hotelName}`,
      image: "/logo.png",

      prefill: {
        name: opts.user.fullname,
        email: opts.user.email,
        contact: String(opts.user?.phoneNumber ?? ""),
      },

      theme: { color: "#C9A882" },
      modal: {
        // User closed modal without paying
        ondismiss: () => {
          setPaying(false);
          toast.info(
            "Payment cancelled. Your booking is saved — complete payment anytime.",
          );
        },
      },

      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          // Verify from backend
          const result = await dispatch(
            verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: opts.bookingId,
            }),
          );

          if (verifyPayment.fulfilled.match(result)) {
            dispatch(clearCurrentBooking());
            toast.success("Booking confirmed! 🎉");
            router.push(`/bookings?confirmed=${opts.bookingId}`);
          } else {
            // Backend rejected - signature  mismatch or booking already confirmed
            toast.error(
              typeof result.payload === "string"
                ? result.payload
                : "Payment verification failed. Contact support with your payment ID.",
            );
            setPaying(false);
          }
        } catch {
          toast.error(
            "Verification failed. Do not pay again — contact support.",
          );
          setPaying(false);
        }
      },
    });

    // Handle Razorpay internal errors (network, bank failure)
    rzp.on("payment.failed", (response: { error: { description: string } }) => {
      toast.error(`Payment failed: ${response.error.description}`);
      setPaying(false);
    });

    if (
      !opts.razorpayOrderId ||
      !Number.isFinite(opts.amount) ||
      opts.amount <= 0
    ) {
      toast.error("Invalid booking amount or payment order. Please try again.");
      setPaying(false);
      return;
    }
    rzp.open();
  }

  return { openCheckout, paying };
}
