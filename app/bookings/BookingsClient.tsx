"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { cancelBooking, getMyBookings } from "@/thunks/booking.thunk";
import { formatDate, formatPrice } from "@/lib/utils";
import type { IBooking } from "@/types/booking";

// Mock data for demo when API not connected
const MOCK_BOOKINGS: IBooking[] = [
  {
    _id: "b1",
    guestId: "u1",
    hotelId: {
      _id: "h1",
      name: "The Coral Nest",
      slug: "coral-nest",
      city: "North Goa",
      state: "Goa",
      images: [],
      category: "boutique",
    },
    rooms: [
      {
        roomId: {
          _id: "r1",
          name: "Ocean View Room",
          type: "standard",
          pricePerNight: 5200,
        },
        pricePerNight: 5200,
        quantity: 1,
      },
    ],
    checkIn: "2025-12-20",
    checkOut: "2025-12-23",
    nights: 3,
    guests: 2,
    subtotal: 15600,
    taxes: 1872,
    totalAmount: 17472,
    status: "confirmed",
    razorpayOrderId: "order_abc123",
    createdAt: "2025-11-15T10:30:00Z",
    updatedAt: "2025-11-15T10:31:00Z",
  },
  {
    _id: "b2",
    guestId: "u1",
    hotelId: {
      _id: "h2",
      name: "Rajputana Palace & Spa",
      slug: "rajputana-palace",
      city: "Jaipur",
      state: "Rajasthan",
      images: [],
      category: "luxury",
    },
    rooms: [
      {
        roomId: {
          _id: "r2",
          name: "Deluxe Suite",
          type: "suite",
          pricePerNight: 9600,
        },
        pricePerNight: 9600,
        quantity: 1,
      },
    ],
    checkIn: "2025-11-14",
    checkOut: "2025-11-17",
    nights: 3,
    guests: 2,
    subtotal: 28800,
    taxes: 3456,
    totalAmount: 32256,
    status: "completed",
    razorpayOrderId: "order_def456",
    createdAt: "2025-10-10T08:00:00Z",
    updatedAt: "2025-11-17T12:00:00Z",
  },
  {
    _id: "b3",
    guestId: "u1",
    hotelId: {
      _id: "h3",
      name: "Misty Valley Resort",
      slug: "misty-valley",
      city: "Munnar",
      state: "Kerala",
      images: [],
      category: "comfort",
    },
    rooms: [
      {
        roomId: {
          _id: "r3",
          name: "Family Villa",
          type: "villa",
          pricePerNight: 4133,
        },
        pricePerNight: 4133,
        quantity: 1,
      },
    ],
    checkIn: "2025-10-05",
    checkOut: "2025-10-08",
    nights: 3,
    guests: 3,
    subtotal: 12400,
    taxes: 1488,
    totalAmount: 13888,
    status: "cancelled",
    razorpayOrderId: "order_ghi789",
    createdAt: "2025-09-01T14:00:00Z",
    updatedAt: "2025-09-20T09:00:00Z",
  },
];

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    color: "#11ff99",
    bg: "rgba(17,255,153,0.1)",
    border: "rgba(17,255,153,0.25)",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "#3b9eff",
    bg: "rgba(59,158,255,0.1)",
    border: "rgba(59,158,255,0.25)",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "#ffc53d",
    bg: "rgba(255,197,61,0.1)",
    border: "rgba(255,197,61,0.25)",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    color: "#ff2047",
    bg: "rgba(255,32,71,0.1)",
    border: "rgba(255,32,71,0.25)",
    icon: XCircle,
  },
};

const EMOJI: Record<string, string> = {
  luxury: "🏛️",
  boutique: "🌊",
  comfort: "🌿",
  budget: "🎒",
};

function CancelModal({
  bookingId,
  onConfirm,
  onClose,
  loading,
}: {
  bookingId: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[#0d0d0d] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[rgba(255,32,71,0.12)] border border-[rgba(255,32,71,0.25)] flex items-center justify-center mb-4">
          <XCircle size={22} className="text-[#ff2047]" />
        </div>
        <h3 className="font-display text-2xl text-white mb-2">
          Cancel Booking?
        </h3>
        <p className="text-[13px] text-[#a1a4a5] leading-relaxed mb-6">
          This action cannot be undone. Cancellations within 48 hours of
          check-in are non-refundable.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[13px] text-[#f0f0f0] hover:bg-white/8 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-[rgba(255,32,71,0.15)] border border-[rgba(255,32,71,0.3)] text-[13px] text-[#ff2047] hover:bg-[rgba(255,32,71,0.25)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReviewModal({
  booking,
  onClose,
}: {
  booking: IBooking;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-md rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[#0d0d0d] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-2xl text-white mb-1">
          Write a Review
        </h3>
        <p className="text-[13px] text-[#a1a4a5] mb-5">
          {booking?.hotelId?.name}
        </p>

        {/* Stars */}
        <div className="flex gap-1.5 mb-5">
          {[1, 2, 3, 4, 5].map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
            >
              <Star
                size={28}
                fill={(hovered || rating) >= s ? "#ffc53d" : "transparent"}
                className={
                  (hovered || rating) >= s ? "text-[#ffc53d]" : "text-[#464a4d]"
                }
              />
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">
              Review Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarise your experience"
              className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell others about your stay…"
              className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[13px] text-[#f0f0f0] hover:bg-white/8 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity"
          >
            Submit Review
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BookingsClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    myBookings: bookings,
    listStatus,
    cancelStatus,
  } = useAppSelector((s) => s.booking);
  const { user, isInitialized } = useAppSelector((s) => s.auth);

  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<IBooking | null>(null);
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "completed" | "cancelled"
  >("all");

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
      return;
    }
    if (user) dispatch(getMyBookings());
  }, [user, isInitialized]);

  const displayBookings = bookings.length > 0 ? bookings : MOCK_BOOKINGS;
  const filtered =
    filter === "all"
      ? displayBookings
      : displayBookings.filter((b) => b.status === filter);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    await dispatch(cancelBooking(cancelTarget));
    setCancelTarget(null);
  };

  const isLoading = listStatus === "loading";

  return (
    <div className="pt-[60px] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-5xl font-light text-white mb-2">
            My Bookings
          </h1>
          <p className="text-[#a1a4a5] text-sm">
            {displayBookings.length} booking
            {displayBookings.length !== 1 ? "s" : ""} found
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-0 rounded-xl border border-[rgba(214,235,253,0.19)] mb-8 overflow-hidden"
        >
          {(["all", "confirmed", "completed", "cancelled"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2.5 text-[12px] font-medium capitalize transition-all border-r border-[rgba(214,235,253,0.19)] last:border-r-0 ${
                  filter === f
                    ? "bg-white/6 text-[#f0f0f0]"
                    : "text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/4"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-[100px] rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)]"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        )}

        {/* Bookings list */}
        {!isLoading && (
          <motion.div
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <AnimatePresence>
              {filtered.map((booking) => {
                const status =
                  STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = status.icon;
                const emoji = EMOJI[booking.hotelId.category] ?? "🏨";
                const img = booking.hotelId.images?.[0]?.url;

                return (
                  <motion.div
                    key={booking._id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    layout
                    className="rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] p-5 hover:border-[rgba(214,235,253,0.35)] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Hotel image / emoji */}
                      <div className="w-16 h-16 rounded-xl bg-[#0d0d0d] flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={booking.hotelId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{emoji}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-lg text-white leading-tight mb-0.5">
                              {booking.hotelId.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[12px] text-[#a1a4a5]">
                              <MapPin size={11} />
                              {booking.hotelId.city}, {booking.hotelId.state}
                            </div>
                          </div>
                          {/* Status badge */}
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.5px] flex-shrink-0"
                            style={{
                              color: status.color,
                              background: status.bg,
                              border: `1px solid ${status.border}`,
                            }}
                          >
                            <StatusIcon size={10} />
                            {status.label}
                          </div>
                        </div>

                        {/* Dates + meta */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#a1a4a5]">
                            <CalendarDays size={11} />
                            {formatDate(booking.checkIn)} →{" "}
                            {formatDate(booking.checkOut)} · {booking.nights}N
                          </div>
                          <div className="text-[12px] text-[#a1a4a5]">
                            {booking.rooms[0]?.roomId.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#464a4d]">
                            #{booking._id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Price + actions */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="font-display text-xl text-white">
                          {formatPrice(booking.totalAmount)}
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              router.push(`/hotels/${booking.hotelId.slug}`)
                            }
                            className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all"
                          >
                            View <ChevronRight size={11} />
                          </motion.button>

                          {booking.status === "confirmed" && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setCancelTarget(booking._id)}
                              className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(255,32,71,0.25)] text-[#ff2047] bg-[rgba(255,32,71,0.08)] hover:bg-[rgba(255,32,71,0.15)] transition-colors"
                            >
                              Cancel
                            </motion.button>
                          )}

                          {booking.status === "completed" && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setReviewTarget(booking)}
                              className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(59,158,255,0.25)] text-[#3b9eff] bg-[rgba(59,158,255,0.08)] hover:bg-[rgba(59,158,255,0.15)] transition-colors"
                            >
                              <Star size={10} /> Review
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">📭</div>
                <div className="text-[#a1a4a5] text-base mb-2">
                  No {filter !== "all" ? filter : ""} bookings found
                </div>
                <button
                  onClick={() => router.push("/search")}
                  className="mt-4 text-[13px] px-5 py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] hover:bg-white/8 transition-colors"
                >
                  Explore Hotels →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelModal
            bookingId={cancelTarget}
            onConfirm={handleCancel}
            onClose={() => setCancelTarget(null)}
            loading={cancelStatus === "loading"}
          />
        )}
        {reviewTarget && (
          <ReviewModal
            booking={reviewTarget}
            onClose={() => setReviewTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
