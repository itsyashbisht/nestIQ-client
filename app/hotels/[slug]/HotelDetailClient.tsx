"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { getHotelBySlug } from "@/thunks/hotel.thunk";
import HotelChat from "@/components/HotelChat";
import { calcNights, formatPrice } from "@/lib/utils";
import type { IHotel } from "@/types/hotel";
import type { IRoom } from "@/types/room";
import { getRoomsByHotelId } from "@/thunks/room.thunk";

// ─── Mock fallbacks ─────────────────────────────────────────────────────────
const MOCK_HOTEL: {
  _id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string;
  category: string;
  vibes: string[];
  amenities: string[];
  images: any[];
  startingFrom: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  checkInTime: string;
  checkOutTime: string;
  nearbyAttractions: string[];
  createdAt: string;
  updatedAt: string;
} = {
  _id: "h1",
  name: "The Coral Nest",
  slug: "coral-nest",
  description:
    "Nestled on the pristine shores of Calangute, The Coral Nest is a 12-room boutique property that redefines beachside living. Wake up to ocean breezes, swim in our infinity pool, and dine under the stars. Every detail — from hand-picked local art to organic farm-to-table breakfasts — has been crafted to create an unforgettable escape.",
  city: "North Goa",
  state: "Goa",
  address: "6/A Calangute Beach Road, North Goa",
  category: "boutique",
  vibes: ["romantic", "wellness"],
  amenities: [
    "WiFi",
    "Pool",
    "Breakfast",
    "Restaurant",
    "Parking",
    "Spa",
    "AC",
  ],
  images: [],
  pricePerNight: 5200,
  rating: 4.8,
  reviewCount: 198,
  isActive: true,
  checkInTime: "14:00",
  checkOutTime: "11:00",
  nearbyAttractions: [
    "Calangute Beach (200m)",
    "Baga Beach (2km)",
    "Fort Aguada (12km)",
  ],
  createdAt: "",
  updatedAt: "",
};

const MOCK_ROOMS: IRoom[] = [
  {
    _id: "r1",
    hotelId: "h1",
    name: "Standard Ocean View",
    type: "standard",
    description:
      "Cozy room with balcony overlooking the Arabian Sea. King bed, en-suite bathroom, 28 sqm.",
    images: [],
    pricePerNight: 4200,
    maxGuests: 2,
    amenities: ["AC", "WiFi", "Balcony", "Sea View", "Mini Bar", "TV"],
    isAvailable: true,
    totalRooms: 4,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "r2",
    hotelId: "h1",
    name: "Deluxe Pool Room",
    type: "deluxe",
    description:
      "Spacious room with direct pool access. King bed, rainfall shower, private terrace, 40 sqm.",
    images: [],
    pricePerNight: 6500,
    maxGuests: 2,
    amenities: [
      "AC",
      "WiFi",
      "Pool Access",
      "Terrace",
      "Bathtub",
      "Minibar",
      "TV",
    ],
    isAvailable: true,
    totalRooms: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "r3",
    hotelId: "h1",
    name: "Coral Suite",
    type: "suite",
    description:
      "Our signature suite. Private plunge pool, butler service, jacuzzi, separate living area. 55 sqm.",
    images: [],
    pricePerNight: 9800,
    maxGuests: 2,
    amenities: [
      "Private Plunge Pool",
      "Butler",
      "Jacuzzi",
      "Living Room",
      "AC",
      "WiFi",
      "TV",
    ],
    isAvailable: true,
    totalRooms: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "r4",
    hotelId: "h1",
    name: "Garden Family Villa",
    type: "villa",
    description:
      "Standalone villa with private garden, 2 bedrooms, full kitchen. Ideal for families. 90 sqm.",
    images: [],
    pricePerNight: 14000,
    maxGuests: 4,
    amenities: [
      "Private Garden",
      "Full Kitchen",
      "2 Bedrooms",
      "Pool Access",
      "AC",
      "WiFi",
      "Parking",
    ],
    isAvailable: false,
    totalRooms: 1,
    createdAt: "",
    updatedAt: "",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const AMENITY_ICON: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  Pool: <Waves size={12} />,
  Parking: <Car size={12} />,
  Breakfast: <Coffee size={12} />,
  Restaurant: <Utensils size={12} />,
  Gym: <Dumbbell size={12} />,
  AC: <Wind size={12} />,
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

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Single room card */
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
      {/* Unavailable ribbon */}
      {!room.isAvailable && (
        <div className="absolute top-0 right-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[rgba(255,32,71,0.2)] text-[#ff2047] rounded-bl-lg">
          Sold Out
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ff801f] flex items-center justify-center z-10"
        >
          <Check size={12} className="text-black" />
        </motion.div>
      )}

      <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr]">
        {/* Room image */}
        <div className="relative bg-[#0a0a0a] flex items-center justify-center text-5xl min-h-[140px] overflow-hidden">
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

        {/* Room info */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1.5 gap-2">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#ff801f] mb-1 block">
                  {ROOM_TYPE_LABEL[room.type] ?? room.type}
                </span>
                <h3 className="font-display text-[17px] text-white leading-tight">
                  {room.name}
                </h3>
              </div>
            </div>

            <p className="text-[12px] text-[#a1a4a5] leading-relaxed mb-3 line-clamp-2">
              {room.description}
            </p>

            <div className="flex items-center gap-2 text-[12px] text-[#a1a4a5] mb-3">
              <Users size={11} />
              <span>
                Up to {room.maxGuests} guest{room.maxGuests > 1 ? "s" : ""}
              </span>
              <span className="text-[#464a4d]">·</span>
              <span>
                {room.totalRooms} room{room.totalRooms > 1 ? "s" : ""} available
              </span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 5).map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5]"
                >
                  {AMENITY_ICON[a] ?? <Check size={9} />}
                  {a}
                </span>
              ))}
              {room.amenities.length > 5 && (
                <span className="text-[9px] text-[#464a4d]">
                  +{room.amenities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(214,235,253,0.1)]">
            <div>
              <div className="font-display text-xl text-white leading-none">
                {formatPrice(room.pricePerNight)}
              </div>
              <div className="text-[10px] text-[#a1a4a5]">
                per night
                {checkIn && checkOut && nights > 1 && (
                  <span className="ml-1 text-[#ff801f]">
                    · {formatPrice(total)} total ({nights}N)
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
                className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                  selected
                    ? "bg-[#ff801f] text-black"
                    : "bg-white text-black hover:opacity-85"
                }`}
              >
                {selected ? "✓ Selected" : "Select Room"}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Booking summary widget — only active once room is selected */
function BookingWidget({
  hotel,
  selectedRoom,
  onProceed,
}: {
  hotel: IHotel;
  selectedRoom: IRoom | null;
  onProceed: (checkIn: string, checkOut: string, guests: number) => void;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(
    selectedRoom?.maxGuests ? Math.min(2, selectedRoom.maxGuests) : 2,
  );

  const today = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const subtotal = (selectedRoom?.pricePerNight ?? 0) * Math.max(nights, 0);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  const canBook = !!selectedRoom && !!checkIn && !!checkOut && nights > 0;

  // Sync guests when room changes
  useEffect(() => {
    if (selectedRoom) setGuests(Math.min(guests, selectedRoom.maxGuests));
  }, [selectedRoom]);

  return (
    <div
      className="sticky top-20 rounded-2xl border border-[rgba(214,235,253,0.19)] p-5 bg-[rgba(255,255,255,0.02)]"
      style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
    >
      <h3 className="font-display text-xl text-white mb-4">Reserve</h3>

      {/* Selected room indicator */}
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

      {/* Date pickers */}
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
            -
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

      {/* Price breakdown — only when room + dates selected */}
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
                  {formatPrice(selectedRoom.pricePerNight)} × {nights} night
                  {nights > 1 ? "s" : ""}
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

// ─── Main page ───────────────────────────────────────────────────────────────

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

  const hotel: IHotel = currentHotel ?? MOCK_HOTEL;
  console.log(hotel);
  const rooms: IRoom[] =
    currentHotelRooms?.length > 0 ? currentHotelRooms : MOCK_ROOMS;

  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const roomsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch hotel if not already loaded
    if (!currentHotel || currentHotel.slug !== slug) {
      dispatch(getHotelBySlug(slug)).then((action) => {
        const h = action.payload as IHotel;
        console.log(h?._id);
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

  const scrollToRooms = () =>
    roomsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const accentColor = CAT_COLOR[hotel.category] ?? "#ff801f";
  const coverImg = hotel.images?.[0]?.url;
  const EMOJI_MAP: Record<string, string> = {
    luxury: "🏛️",
    boutique: "🌊",
    comfort: "🌿",
    budget: "🎒",
  };

  return (
    <div className="pt-[60px] min-h-screen">
      {/* ── Back ────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-[#a1a4a5] hover:text-white transition-colors"
        >
          <ChevronLeft size={14} /> Back to results
        </button>
      </div>

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[400px] md:h-[460px] bg-[#0d0d0d] flex items-center justify-center overflow-hidden"
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
            className="text-[110px]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            {EMOJI_MAP[hotel.category] ?? "🏨"}
          </motion.span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Thumbnail strip */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {hotel.images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${activeImg === i ? "border-white" : "border-transparent opacity-60"}`}
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

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-6 max-w-6xl mx-auto"
        >
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full capitalize"
              style={{
                color: accentColor,
                background: `${accentColor}20`,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {hotel.category}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full text-[#11ff99] bg-[rgba(17,255,153,0.1)] border border-[rgba(17,255,153,0.25)]">
              Verified
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-light text-white mb-2">
            {hotel.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[rgba(255,255,255,0.65)]">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {hotel.address || `${hotel.city}, ${hotel.state}`}
            </span>
            <span className="flex items-center gap-1 text-[#ffc53d]">
              <Star size={11} fill="#ffc53d" />
              {hotel.rating.toFixed(1)} · {hotel.reviewCount} reviews
            </span>
            <span>
              Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Body grid ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* LEFT COLUMN */}
        <div>
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl text-white mb-3">About</h2>
            <p className="text-[14px] text-[#a1a4a5] leading-relaxed">
              {hotel.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {hotel.vibes.map((v) => (
                <span
                  key={v}
                  className="text-[11px] px-3 py-1 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                >
                  {v}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {hotel.amenities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[rgba(214,235,253,0.19)] text-[12px] text-[#a1a4a5]"
                >
                  <span>{AMENITY_ICON[a] ?? <Check size={11} />}</span>
                  {a}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nearby */}
          {hotel.nearbyAttractions?.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-2xl text-white mb-4">Nearby</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.nearbyAttractions.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5]"
                  >
                    <MapPin size={10} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── ROOM SELECTION (CRITICAL) ────────────────────────────── */}
          <div ref={roomsSectionRef} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-white">
                Choose Your Room
              </h2>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-[11px] text-[#ff801f]"
                >
                  <Check size={12} />
                  {selectedRoom.name} selected
                </motion.div>
              )}
            </div>

            {/* Context banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[rgba(59,158,255,0.15)] bg-[rgba(59,158,255,0.04)] mb-5"
            >
              <Info size={13} className="text-[#3b9eff] flex-shrink-0" />
              <p className="text-[12px] text-[#a1a4a5]">
                Select a room type below, then choose your dates in the booking
                panel to proceed to checkout.
              </p>
            </motion.div>

            {/* Room loading */}
            {roomsStatus === "loading" && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-[140px] rounded-xl border border-[rgba(214,235,253,0.19)] bg-[#0a0a0a]"
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
              <div className="flex flex-col gap-4">
                {rooms.map((room, i) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <RoomCard
                      room={room}
                      selected={selectedRoom?._id === room._id}
                      onSelect={() => handleRoomSelect(room)}
                      checkIn={""}
                      checkOut={""}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Proceed CTA — sticky mobile */}
            <AnimatePresence>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="lg:hidden fixed bottom-4 left-4 right-4 z-40"
                >
                  <div
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-[#ff801f]"
                    style={{ boxShadow: "0 0 24px rgba(255,128,31,0.2)" }}
                  >
                    <div>
                      <div className="text-[11px] text-[#ff801f]">
                        Selected: {selectedRoom.name}
                      </div>
                      <div className="text-[13px] font-semibold text-white">
                        {formatPrice(selectedRoom.pricePerNight)}/night
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        roomsSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-[13px] font-semibold"
                    >
                      Continue <ChevronRight size={13} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-white">
                Ask about {hotel.name}
              </h2>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setChatOpen(!chatOpen)}
                className="flex items-center gap-1.5 text-[11px] px-3.5 py-1.5 rounded-full border border-[rgba(59,158,255,0.3)] text-[#3b9eff] bg-[rgba(59,158,255,0.07)] hover:bg-[rgba(59,158,255,0.12)] transition-colors"
              >
                <MessageSquare size={11} />
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
                className="flex items-center gap-3 px-4 py-4 rounded-xl border border-[rgba(59,158,255,0.15)] bg-[rgba(59,158,255,0.03)] cursor-pointer hover:bg-[rgba(59,158,255,0.05)] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(59,158,255,0.15)] flex items-center justify-center">
                  <MessageSquare size={14} className="text-[#3b9eff]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-white">
                    Have questions? Ask our AI
                  </div>
                  <div className="text-[11px] text-[#a1a4a5]">
                    Pool hours, pet policy, nearby restaurants…
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#a1a4a5]" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Booking widget */}
        <div className="hidden lg:block">
          <BookingWidget
            hotel={hotel}
            selectedRoom={selectedRoom}
            onProceed={handleProceedToCheckout}
          />

          {/* Scroll to rooms CTA when nothing selected */}
          {!selectedRoom && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToRooms}
              className="mt-3 w-full py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] text-[13px] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all flex items-center justify-center gap-1.5"
            >
              <CalendarDays size={13} /> Browse room types ↓
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
