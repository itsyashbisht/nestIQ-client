"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  Info,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { getHotelBySlug } from "@/thunks/hotel.thunk";
import { getRoomsByHotelId } from "@/thunks/room.thunk";
import HotelChat from "@/components/HotelChat";
import { calcNights, formatPrice } from "@/lib/utils";
import type { IHotel } from "@/types/hotel";
import type { IRoom } from "@/types/room";

// ─── Constants ───────────────────────────────────────────────────────────────
const AMENITY_ICON: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={11} />,
  Pool: <Waves size={11} />,
  Parking: <Car size={11} />,
  Breakfast: <Coffee size={11} />,
  Restaurant: <Utensils size={11} />,
  Gym: <Dumbbell size={11} />,
  AC: <Wind size={11} />,
};
const ROOM_TYPE_LABEL: Record<string, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  villa: "Villa",
  dormitory: "Dormitory",
};
const ROOM_EMOJI: Record<string, string> = {
  standard: "🌅",
  deluxe: "✨",
  suite: "💎",
  villa: "🏡",
  dormitory: "🛏️",
};
const CAT_COLOR: Record<string, string> = {
  luxury: "#ff801f",
  boutique: "#3b9eff",
  comfort: "#11ff99",
  budget: "#ffc53d",
};

// ─── Mobile Booking Sheet ────────────────────────────────────────────────────
// Opens as a bottom-sheet on mobile after room is selected.
// This is the fix for the "Continue" button bug — instead of scrolling,
// we show a full booking form inline on mobile.
function MobileBookingSheet({
  open,
  onClose,
  selectedRoom,
  onProceed,
}: {
  open: boolean;
  onClose: () => void;
  selectedRoom: IRoom | null;
  onProceed: (checkIn: string, checkOut: string, guests: number) => void;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(
    selectedRoom ? Math.min(2, selectedRoom.maxGuests) : 2,
  );

  const today = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const subtotal = (selectedRoom?.pricePerNight ?? 0) * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  const canBook = !!selectedRoom && !!checkIn && !!checkOut && nights > 0;

  useEffect(() => {
    if (selectedRoom) setGuests((g) => Math.min(g, selectedRoom.maxGuests));
  }, [selectedRoom]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl overflow-hidden"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(214,235,253,0.19)",
              borderBottom: "none",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[rgba(214,235,253,0.2)]" />
            </div>

            <div className="px-5 pb-8 pt-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-white">Reserve</h3>
                <button
                  onClick={onClose}
                  className="text-[#464a4d] hover:text-[#a1a4a5] p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selected room badge */}
              {selectedRoom && (
                <div className="px-3 py-2.5 rounded-lg bg-[rgba(255,128,31,0.08)] border border-[rgba(255,128,31,0.25)]">
                  <div className="text-[9px] text-[#ff801f] uppercase tracking-[0.6px] mb-0.5">
                    Selected Room
                  </div>
                  <div className="text-[13px] font-medium text-white">
                    {selectedRoom.name}
                  </div>
                  <div className="text-[11px] text-[#a1a4a5]">
                    {formatPrice(selectedRoom.pricePerNight)}/night · Max{" "}
                    {selectedRoom.maxGuests} guests
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-xl text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(255,128,31,0.5)] transition-colors"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-xl text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(255,128,31,0.5)] transition-colors"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                  Guests
                </label>
                <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)] w-fit">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-base"
                  >
                    −
                  </motion.button>
                  <span className="text-[15px] font-medium text-white w-5 text-center">
                    {guests}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() =>
                      setGuests(
                        Math.min(selectedRoom?.maxGuests ?? 10, guests + 1),
                      )
                    }
                    className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-base"
                  >
                    +
                  </motion.button>
                  <span className="text-[12px] text-[#a1a4a5]">
                    guest{guests > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Price breakdown */}
              {canBook && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-[rgba(214,235,253,0.12)] p-3.5 flex flex-col gap-2 text-[12px]"
                >
                  <div className="flex justify-between text-[#a1a4a5]">
                    <span>
                      {formatPrice(selectedRoom!.pricePerNight)} × {nights}{" "}
                      night{nights > 1 ? "s" : ""}
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#a1a4a5]">
                    <span>GST (12%)</span>
                    <span>{formatPrice(taxes)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white text-[14px] border-t border-[rgba(214,235,253,0.12)] pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.button
                whileHover={{ scale: canBook ? 1.02 : 1 }}
                whileTap={{ scale: canBook ? 0.97 : 1 }}
                onClick={() => canBook && onProceed(checkIn, checkOut, guests)}
                disabled={!canBook}
                className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all ${
                  canBook
                    ? "bg-white text-black cursor-pointer hover:opacity-90"
                    : "bg-[rgba(255,255,255,0.08)] text-[#464a4d] cursor-not-allowed"
                }`}
              >
                {!checkIn || !checkOut ? "Choose your dates" : "Reserve Now →"}
              </motion.button>

              <div className="flex items-center gap-1.5 justify-center text-[10px] text-[#464a4d]">
                <ShieldCheck size={10} />
                Free cancellation · 48h policy
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop Booking Widget ───────────────────────────────────────────────────
function BookingWidget({
  selectedRoom,
  onProceed,
}: {
  selectedRoom: IRoom | null;
  onProceed: (checkIn: string, checkOut: string, guests: number) => void;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(
    selectedRoom ? Math.min(2, selectedRoom.maxGuests) : 2,
  );

  const today = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const subtotal = (selectedRoom?.pricePerNight ?? 0) * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  const canBook = !!selectedRoom && !!checkIn && !!checkOut && nights > 0;

  useEffect(() => {
    if (selectedRoom) setGuests((g) => Math.min(g, selectedRoom.maxGuests));
  }, [selectedRoom]);

  return (
    <div
      className="sticky top-20 rounded-2xl border border-[rgba(214,235,253,0.19)] p-5 bg-[rgba(255,255,255,0.02)]"
      style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
    >
      <h3 className="font-display text-xl text-white mb-4">Reserve</h3>

      {/* Room indicator */}
      <AnimatePresence mode="wait">
        {selectedRoom ? (
          <motion.div
            key="room"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 px-3 py-2.5 rounded-lg bg-[rgba(255,128,31,0.08)] border border-[rgba(255,128,31,0.25)]"
          >
            <div className="text-[9px] text-[#ff801f] uppercase tracking-[0.6px] mb-0.5">
              Selected Room
            </div>
            <div className="text-[13px] font-medium text-white">
              {selectedRoom.name}
            </div>
            <div className="text-[11px] text-[#a1a4a5]">
              {formatPrice(selectedRoom.pricePerNight)}/night · Max{" "}
              {selectedRoom.maxGuests} guests
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-3 py-3 rounded-lg border border-dashed border-[rgba(214,235,253,0.25)] text-center"
          >
            <div className="text-[12px] text-[#464a4d]">
              👆 Select a room below to continue
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-[9px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
            Check In
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-2.5 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[12px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.5)] transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className="block text-[9px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
            Check Out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-2.5 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[12px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.5)] transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mb-4">
        <label className="block text-[9px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
          Guests
        </label>
        <div className="flex items-center gap-3 px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="text-[#a1a4a5] hover:text-white w-5 text-center"
          >
            −
          </button>
          <span className="flex-1 text-center text-[13px] text-white">
            {guests} guest{guests > 1 ? "s" : ""}
          </span>
          <button
            onClick={() =>
              setGuests(Math.min(selectedRoom?.maxGuests ?? 10, guests + 1))
            }
            className="text-[#a1a4a5] hover:text-white w-5 text-center"
          >
            +
          </button>
        </div>
        {selectedRoom && guests > selectedRoom.maxGuests && (
          <p className="text-[10px] text-[#ff2047] mt-1">
            Max {selectedRoom.maxGuests} guests for this room
          </p>
        )}
      </div>

      {/* Price breakdown */}
      <AnimatePresence>
        {selectedRoom && nights > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[rgba(214,235,253,0.19)] pt-3 mb-4"
          >
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between text-[#a1a4a5]">
                <span>
                  {formatPrice(selectedRoom.pricePerNight)} × {nights}N
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#a1a4a5]">
                <span>GST (12%)</span>
                <span>{formatPrice(taxes)}</span>
              </div>
              <div className="flex justify-between font-semibold text-white text-[14px] border-t border-[rgba(214,235,253,0.19)] pt-2 mt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: canBook ? 1.02 : 1 }}
        whileTap={{ scale: canBook ? 0.97 : 1 }}
        onClick={() => canBook && onProceed(checkIn, checkOut, guests)}
        disabled={!canBook}
        className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all ${
          canBook
            ? "bg-white text-black hover:opacity-85 cursor-pointer"
            : "bg-[rgba(255,255,255,0.08)] text-[#464a4d] cursor-not-allowed"
        }`}
      >
        {!selectedRoom
          ? "Select a room first"
          : !checkIn || !checkOut
            ? "Choose your dates"
            : "Reserve Now →"}
      </motion.button>

      <div className="flex items-center gap-1.5 justify-center mt-3 text-[10px] text-[#464a4d]">
        <ShieldCheck size={11} />
        <span>Free cancellation · 48h policy</span>
      </div>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({
  room,
  selected,
  onSelect,
  checkIn,
  checkOut,
}: {
  room: IRoom;
  selected: boolean;
  onSelect: () => void;
  checkIn: string;
  checkOut: string;
}) {
  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 1;
  const total = room.pricePerNight * nights;

  return (
    <motion.div
      layout
      whileHover={{
        borderColor: selected ? undefined : "rgba(214,235,253,0.4)",
      }}
      onClick={() => room.isAvailable && onSelect()}
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
        !room.isAvailable
          ? "opacity-50 cursor-not-allowed border-[rgba(214,235,253,0.1)]"
          : selected
            ? "border-[#ff801f] bg-[rgba(255,128,31,0.04)] cursor-pointer"
            : "border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)] cursor-pointer"
      }`}
    >
      {!room.isAvailable && (
        <div className="absolute top-0 right-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[rgba(255,32,71,0.2)] text-[#ff2047] rounded-bl-lg z-10">
          Sold Out
        </div>
      )}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ff801f] flex items-center justify-center z-10"
        >
          <Check size={10} className="text-black" />
        </motion.div>
      )}

      {/* Layout: stacked on mobile (<sm), side-by-side on sm+ */}
      <div className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr]">
        {/* Image */}
        <div className="relative bg-[#0a0a0a] flex items-center justify-center text-4xl sm:text-5xl overflow-hidden h-[140px] sm:h-full sm:min-h-[140px]">
          {room.images?.[0]?.url ? (
            <Image
              src={room.images[0].url}
              alt={room.name}
              fill
              className="object-cover"
            />
          ) : (
            <span>{ROOM_EMOJI[room.type] ?? "🛏️"}</span>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1 sm:mb-1.5 gap-2">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#ff801f] mb-0.5 block">
                  {ROOM_TYPE_LABEL[room.type] ?? room.type}
                </span>
                <h3 className="font-display text-[15px] sm:text-[17px] text-white leading-tight">
                  {room.name}
                </h3>
              </div>
            </div>

            <p className="text-[11px] sm:text-[12px] text-[#a1a4a5] leading-relaxed mb-2 sm:mb-3 line-clamp-2">
              {room.description}
            </p>

            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#a1a4a5] mb-2 sm:mb-3">
              <span className="flex items-center gap-1">
                <Users size={10} />
                Up to {room.maxGuests} guest{room.maxGuests > 1 ? "s" : ""}
              </span>
              <span className="text-[#464a4d] hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                {room.totalRooms} room{room.totalRooms > 1 ? "s" : ""} available
              </span>
            </div>

            {/* Amenity pills */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {room.amenities.slice(0, 4).map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5]"
                >
                  {AMENITY_ICON[a] ?? <Check size={9} />}
                  {a}
                </span>
              ))}
              {room.amenities.length > 4 && (
                <span className="text-[9px] text-[#464a4d]">
                  +{room.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(214,235,253,0.1)]">
            <div>
              <div className="font-display text-[18px] sm:text-xl text-white leading-none">
                {formatPrice(room.pricePerNight)}
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#a1a4a5]">
                per night
                {checkIn && checkOut && nights > 1 && (
                  <span className="ml-1 text-[#ff801f]">
                    · {formatPrice(total)} total
                  </span>
                )}
              </div>
            </div>
            {room.isAvailable && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`text-[11px] sm:text-[12px] font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
                  selected
                    ? "bg-[#ff801f] text-black"
                    : "bg-white text-black hover:opacity-85"
                }`}
              >
                {selected ? "✓ Selected" : "Select"}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
interface Props {
  slug: string;
}

export default function HotelDetailClient({ slug }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { hotel: currentHotel } = useAppSelector((s) => s.hotel);
  const { rooms: currentHotelRooms, status: roomsStatus } = useAppSelector(
    (s) => s.room,
  );
  const { user } = useAppSelector((s) => s.auth);

  const hotel: IHotel = currentHotel;
  const rooms: IRoom[] = currentHotelRooms?.length > 0 ? currentHotelRooms : [];

  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false); // ← FIX

  const roomsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentHotel || currentHotel.slug !== slug) {
      dispatch(getHotelBySlug(slug)).then((action) => {
        const h = action.payload as IHotel;
        if (h?._id) dispatch(getRoomsByHotelId(h._id));
      });
    } else {
      dispatch(getRoomsByHotelId(hotel._id));
    }
  }, [slug]); // eslint-disable-line

  const handleRoomSelect = (room: IRoom) => {
    setSelectedRoom((prev) => (prev?._id === room._id ? null : room));
  };

  const handleProceedToCheckout = (
    checkIn: string,
    checkOut: string,
    guests: number,
  ) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedRoom) return;
    const params = new URLSearchParams({
      roomId: selectedRoom._id,
      roomName: selectedRoom.name,
      pricePerNight: String(selectedRoom.pricePerNight),
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/hotels/${slug}/book?${params.toString()}`);
  };

  const accentColor = CAT_COLOR[hotel?.category] ?? "#ff801f";
  const coverImg = hotel?.images?.[0]?.url ?? "";
  const EMOJI_MAP: Record<string, string> = {
    luxury: "🏛️",
    boutique: "🌊",
    comfort: "🌿",
    budget: "🎒",
  };

  if (!hotel) return null;

  return (
    <div className="pt-[60px] min-h-screen">
      {/* ── Back ─────────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#a1a4a5] hover:text-white transition-colors"
        >
          <ChevronLeft size={13} /> Back to results
        </button>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[280px] sm:h-[380px] md:h-[460px] bg-[#0d0d0d] flex items-center justify-center overflow-hidden"
      >
        {coverImg ? (
          <Image
            src={coverImg}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <motion.span
            className="text-[80px] sm:text-[110px]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            {EMOJI_MAP[hotel.category] ?? "🏨"}
          </motion.span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Thumbnail strip */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {hotel.images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden border-2 transition-all ${activeImg === i ? "border-white" : "border-transparent opacity-50"}`}
              >
                <Image
                  src={img.url}
                  alt=""
                  width={48}
                  height={32}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 px-3 sm:px-6 pb-4 sm:pb-6 max-w-6xl mx-auto"
        >
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span
              className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.8px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full capitalize"
              style={{
                color: accentColor,
                background: `${accentColor}20`,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {hotel.category}
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.8px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[#11ff99] bg-[rgba(17,255,153,0.1)] border border-[rgba(17,255,153,0.25)]">
              Verified
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-light text-white mb-1.5 sm:mb-2 leading-tight">
            {hotel.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[12px] text-[rgba(255,255,255,0.65)]">
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {hotel.city}, {hotel.state}
            </span>
            <span className="flex items-center gap-1 text-[#ffc53d]">
              <Star size={10} fill="#ffc53d" />
              {hotel.rating.toFixed(1)} · {hotel.reviewCount} reviews
            </span>
            <span className="hidden sm:inline">
              Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 sm:gap-10">
        {/* ── LEFT ─────────────────────────────────────────────────── */}
        <div>
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="font-display text-xl sm:text-2xl text-white mb-2 sm:mb-3">
              About
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#a1a4a5] leading-relaxed">
              {hotel.description}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {hotel.vibes.map((v) => (
                <span
                  key={v}
                  className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                >
                  {v}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
              {hotel.amenities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-[rgba(214,235,253,0.19)] text-[11px] sm:text-[12px] text-[#a1a4a5]"
                >
                  <span>{AMENITY_ICON[a] ?? <Check size={10} />}</span>
                  {a}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nearby */}
          {hotel.nearbyAttractions?.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display text-xl sm:text-2xl text-white mb-3 sm:mb-4">
                Nearby
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {hotel.nearbyAttractions.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5]"
                  >
                    <MapPin size={9} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Room Selection ──────────────────────────────────────── */}
          <div ref={roomsSectionRef} className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <h2 className="font-display text-xl sm:text-2xl text-white">
                Choose Your Room
              </h2>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#ff801f]"
                >
                  <Check size={11} />
                  {selectedRoom.name}
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[rgba(59,158,255,0.15)] bg-[rgba(59,158,255,0.04)] mb-4 sm:mb-5"
            >
              <Info size={12} className="text-[#3b9eff] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-[12px] text-[#a1a4a5] leading-relaxed">
                Select a room below, then choose your dates to proceed to
                checkout.
              </p>
            </motion.div>

            {/* Skeletons */}
            {roomsStatus === "loading" && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-[140px] sm:h-[150px] rounded-xl border border-[rgba(214,235,253,0.19)] bg-[#0a0a0a]"
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

            {/* Room cards */}
            {roomsStatus !== "loading" && (
              <div className="flex flex-col gap-3 sm:gap-4">
                {rooms.map((room, i) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <RoomCard
                      room={room}
                      selected={selectedRoom?._id === room._id}
                      onSelect={() => handleRoomSelect(room)}
                      checkIn=""
                      checkOut=""
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Mobile sticky bar — FIX: opens MobileBookingSheet ── */}
            <AnimatePresence>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-3"
                  style={{
                    background:
                      "linear-gradient(to top, black 60%, transparent)",
                  }}
                >
                  <div
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-[#ff801f]"
                    style={{ boxShadow: "0 0 24px rgba(255,128,31,0.18)" }}
                  >
                    <div>
                      <div className="text-[10px] text-[#ff801f] mb-0.5">
                        {selectedRoom.name}
                      </div>
                      <div className="text-[14px] font-semibold text-white">
                        {formatPrice(selectedRoom.pricePerNight)}
                        <span className="text-[10px] text-[#a1a4a5] font-normal">
                          /night
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMobileSheetOpen(true)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold"
                    >
                      Continue <ChevronRight size={13} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-display text-xl sm:text-2xl text-white">
                Ask about {hotel.name}
              </h2>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setChatOpen(!chatOpen)}
                className="flex items-center gap-1.5 text-[10px] sm:text-[11px] px-3 sm:px-3.5 py-1.5 rounded-full border border-[rgba(59,158,255,0.3)] text-[#3b9eff] bg-[rgba(59,158,255,0.07)] hover:bg-[rgba(59,158,255,0.12)] transition-colors"
              >
                <MessageSquare size={10} />
                {chatOpen ? "Close" : "Open Chat"}
              </motion.button>
            </div>
            <AnimatePresence>
              {chatOpen && (
                <HotelChat
                  hotelId={hotel._id}
                  hotelName={hotel.name}
                  onClose={() => setChatOpen(false)}
                />
              )}
            </AnimatePresence>
            {!chatOpen && (
              <div
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 sm:py-4 rounded-xl border border-[rgba(59,158,255,0.15)] bg-[rgba(59,158,255,0.03)] cursor-pointer hover:bg-[rgba(59,158,255,0.05)] transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[rgba(59,158,255,0.15)] flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={13} className="text-[#3b9eff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] sm:text-[13px] text-white">
                    Have questions? Ask our AI
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#a1a4a5]">
                    Pool hours, pet policy, nearby restaurants…
                  </div>
                </div>
                <ChevronRight
                  size={13}
                  className="text-[#a1a4a5] flex-shrink-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT — desktop booking widget only ───────────────────── */}
        <div className="hidden lg:block">
          <BookingWidget
            selectedRoom={selectedRoom}
            onProceed={handleProceedToCheckout}
          />
          {!selectedRoom && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                roomsSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="mt-3 w-full py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] text-[13px] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all flex items-center justify-center gap-1.5"
            >
              <CalendarDays size={13} /> Browse room types ↓
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Mobile Booking Sheet ───────────────────────────────────── */}
      <MobileBookingSheet
        open={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        selectedRoom={selectedRoom}
        onProceed={handleProceedToCheckout}
      />
    </div>
  );
}
