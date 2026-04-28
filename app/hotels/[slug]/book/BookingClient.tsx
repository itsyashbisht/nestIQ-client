"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Shield, Zap } from "lucide-react";
import Script from "next/script";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { createBooking } from "@/thunks/booking.thunk";
import { getRazorpayKeyId, verifyPayment } from "@/thunks/payment.thunk";
import { formatPrice, calcNights } from "@/lib/utils";

const STEPS = ["Room Selected", "Guest Details", "Payment"];

export default function BookingClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const slug = params.slug as string;
  const roomId = searchParams.get("roomId") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guestsParam = Number(searchParams.get("guests") ?? "2");

  const { user } = useAppSelector((s) => s.auth);
  const { currentBooking, razorpayOrderId, createStatus } = useAppSelector((s) => s.booking);
  const { razorpayKey } = useAppSelector((s) => s.payment);

  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  // Guest form state
  const [form, setForm] = useState({
    fullname: user?.fullname ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    specialRequests: "",
  });

  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 1;
  const pricePerNight = 5200; // would come from room data in real impl
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  useEffect(() => {
    if (!razorpayKey) dispatch(getRazorpayKeyId());
  }, []);

  const handleCreateBooking = async () => {
    const result = await dispatch(
      createBooking({
        hotelId: "1", // would come from hotel data
        rooms: [{ roomId, quantity: 1 }],
        checkIn,
        checkOut,
        guests: guestsParam,
        specialRequests: form.specialRequests,
      })
    );
    if (createBooking.fulfilled.match(result)) {
      setStep(2);
    }
  };

  const handleRazorpay = () => {
    if (!razorpayOrderId || !razorpayKey) return;

    const rzp = new window.Razorpay({
      key: razorpayKey,
      amount: total * 100,
      currency: "INR",
      name: "NestIQ",
      description: `Booking — ${slug}`,
      order_id: razorpayOrderId,
      prefill: {
        name: form.fullname,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#ff801f" },
      handler: async (response) => {
        const verifyResult = await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: currentBooking?._id ?? "",
          })
        );
        if (verifyPayment.fulfilled.match(verifyResult)) {
          setConfirmed(true);
        }
      },
    });
    rzp.open();
  };

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-[60px] min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(17,255,153,0.15)", border: "2px solid rgba(17,255,153,0.4)" }}
          >
            <Check size={36} className="text-[#11ff99]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-display text-5xl font-light text-white mb-3"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-[#a1a4a5] text-sm mb-2"
          >
            {slug} · {checkIn} → {checkOut}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-mono text-[11px] text-[#464a4d] mb-6"
          >
            #{currentBooking?._id?.slice(-8).toUpperCase() ?? "NQ-2025-0001"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-xl p-4 mb-6 border border-[rgba(17,255,153,0.2)] bg-[rgba(17,255,153,0.05)]"
          >
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-[#a1a4a5]">Amount Paid</span>
              <span className="text-white font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="text-[11px] text-[#11ff99]">✓ Payment verified via Razorpay</div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/bookings")}
            className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:opacity-85 transition-opacity"
          >
            View My Bookings
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="pt-[60px] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-[#a1a4a5] hover:text-white transition-colors mb-8"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <h1 className="font-display text-4xl font-light text-white mb-8">Complete Booking</h1>

          {/* Stepper */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.div
                    animate={{
                      borderColor: i < step ? "#ff801f" : i === step ? "#f0f0f0" : "rgba(214,235,253,0.19)",
                      background: i < step ? "#ff801f" : "transparent",
                    }}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold"
                    style={{ color: i < step ? "#000" : i === step ? "#f0f0f0" : "#464a4d" }}
                  >
                    {i < step ? <Check size={12} /> : i + 1}
                  </motion.div>
                  <span className={`text-[12px] font-medium ${i <= step ? "text-[#f0f0f0]" : "text-[#464a4d]"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-3" style={{ background: i < step ? "#ff801f" : "rgba(214,235,253,0.19)" }} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
            {/* Form */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-2xl border border-[rgba(214,235,253,0.19)] p-6 bg-[rgba(255,255,255,0.01)]">
                    <h2 className="font-display text-2xl text-white mb-5">Guest Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">Full Name</label>
                        <input
                          value={form.fullname}
                          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
                          placeholder="Rahul Sharma"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
                          placeholder="rahul@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">Phone</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">Special Requests (optional)</label>
                        <textarea
                          value={form.specialRequests}
                          onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors resize-none"
                          placeholder="Early check-in, anniversary decoration…"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateBooking}
                      disabled={createStatus === "loading"}
                      className="mt-5 w-full py-3 rounded-xl bg-white text-black text-[14px] font-semibold hover:opacity-85 transition-opacity disabled:opacity-50"
                    >
                      {createStatus === "loading" ? "Creating booking…" : "Continue to Payment →"}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-2xl border border-[rgba(214,235,253,0.19)] p-6 bg-[rgba(255,255,255,0.01)]">
                    <h2 className="font-display text-2xl text-white mb-2">Secure Payment</h2>
                    <p className="text-[13px] text-[#a1a4a5] mb-6 flex items-center gap-1.5">
                      <Shield size={13} className="text-[#11ff99]" />
                      Powered by Razorpay · 256-bit SSL encrypted
                    </p>
                    <div className="rounded-xl border border-[rgba(214,235,253,0.19)] p-4 mb-5">
                      <div className="flex justify-between text-[13px] text-[#a1a4a5] mb-2">
                        <span>Booking Total</span>
                        <span className="text-white font-medium">{formatPrice(total)}</span>
                      </div>
                      <div className="text-[11px] text-[#464a4d]">Amount in INR · No hidden fees</div>
                    </div>
                    <div className="rounded-xl bg-[rgba(255,128,31,0.05)] border border-[rgba(255,128,31,0.2)] p-4 mb-5">
                      <div className="flex items-center gap-2 text-[13px] text-[#ffa057] mb-1">
                        <Zap size={13} /> Razorpay Checkout
                      </div>
                      <div className="text-[12px] text-[#a1a4a5]">UPI, Cards, Net Banking, Wallets supported</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRazorpay}
                      className="w-full py-3.5 rounded-xl bg-[#ff801f] text-black text-[15px] font-semibold hover:opacity-85 transition-opacity"
                    >
                      Pay {formatPrice(total)}
                    </motion.button>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full mt-3 py-2 text-[13px] text-[#a1a4a5] hover:text-white transition-colors"
                    >
                      ← Back to details
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary card */}
            <div className="rounded-2xl border border-[rgba(214,235,253,0.19)] p-5 bg-[rgba(255,255,255,0.01)] h-fit sticky top-20">
              <h3 className="font-display text-lg text-white mb-4">Booking Summary</h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[rgba(214,235,253,0.19)]">
                <div className="w-14 h-14 rounded-lg bg-[#0d0d0d] flex items-center justify-center text-2xl flex-shrink-0">🌊</div>
                <div>
                  <div className="text-[13px] font-medium text-white">{slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</div>
                  <div className="text-[11px] text-[#a1a4a5]">Boutique · Goa</div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 text-[12px]">
                <div className="flex justify-between text-[#a1a4a5]"><span>Check In</span><span className="text-white">{checkIn || "—"}</span></div>
                <div className="flex justify-between text-[#a1a4a5]"><span>Check Out</span><span className="text-white">{checkOut || "—"}</span></div>
                <div className="flex justify-between text-[#a1a4a5]"><span>Nights</span><span className="text-white">{nights}</span></div>
                <div className="flex justify-between text-[#a1a4a5]"><span>Guests</span><span className="text-white">{guestsParam}</span></div>
                <div className="border-t border-[rgba(214,235,253,0.19)] pt-2 mt-1">
                  <div className="flex justify-between text-[#a1a4a5]"><span>{formatPrice(pricePerNight)} × {nights}</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-[#a1a4a5] mt-1.5"><span>GST (12%)</span><span>{formatPrice(taxes)}</span></div>
                  <div className="flex justify-between text-white font-semibold text-[13px] border-t border-[rgba(214,235,253,0.19)] pt-2 mt-2">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 px-3 py-2.5 rounded-lg bg-[rgba(17,255,153,0.06)] border border-[rgba(17,255,153,0.15)]">
                <div className="text-[11px] text-[#11ff99]">✓ Free Cancellation</div>
                <div className="text-[10px] text-[#a1a4a5] mt-0.5">Cancel 48h before for full refund</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
