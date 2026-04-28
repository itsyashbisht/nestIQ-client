"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, Tag, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { IHotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: IHotel;
  variant?: "default" | "horizontal" | "featured";
  index?: number;
  /** Lowest room price — passed from parent when rooms are fetched */
  lowestRoomPrice?: number;
}

const CATEGORY_COLOR: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  luxury: {
    text: "#ff801f",
    bg: "rgba(255,128,31,0.1)",
    border: "rgba(255,128,31,0.3)",
  },
  boutique: {
    text: "#3b9eff",
    bg: "rgba(59,158,255,0.1)",
    border: "rgba(59,158,255,0.3)",
  },
  comfort: {
    text: "#11ff99",
    bg: "rgba(17,255,153,0.08)",
    border: "rgba(17,255,153,0.25)",
  },
  budget: {
    text: "#ffc53d",
    bg: "rgba(255,197,61,0.1)",
    border: "rgba(255,197,61,0.3)",
  },
};

const EMOJI: Record<string, string> = {
  luxury: "🏛️",
  boutique: "🌊",
  comfort: "🌿",
  budget: "🎒",
};

/** Price shown on card — prefers lowest room price, falls back to hotel.pricePerNight */
function displayPrice(hotel: IHotel, lowestRoomPrice?: number) {
  return lowestRoomPrice ?? hotel.pricePerNight;
}

export default function HotelCard({
  hotel,
  variant = "default",
  index = 0,
  lowestRoomPrice,
}: HotelCardProps) {
  const cat = CATEGORY_COLOR[hotel.category] ?? CATEGORY_COLOR.budget;
  const emoji = EMOJI[hotel.category] ?? "🏨";
  const price = displayPrice(hotel, lowestRoomPrice);
  const coverImg = hotel.images?.[0]?.url;

  const cardAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // ── FEATURED (col-span-2) ──────────────────────────────────────────────
  if (variant === "featured") {
    return (
      <motion.div
        variants={cardAnim}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -4 }}
        className="col-span-2"
      >
        <Link href={`/hotels/${hotel.slug}`}>
          <div
            className="group grid grid-cols-2 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(214,235,253,0.4)] transition-all duration-300"
            style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
          >
            {/* Image */}
            <div className="relative min-h-[280px] bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <motion.span
                  className="text-8xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {emoji}
                </motion.span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>
            {/* Body */}
            <div className="p-7 flex flex-col justify-between">
              <div>
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full mb-4 capitalize"
                  style={{
                    color: cat.text,
                    background: cat.bg,
                    border: `1px solid ${cat.border}`,
                  }}
                >
                  {hotel.category} · Featured
                </span>
                <h3 className="font-display text-3xl font-normal text-white leading-tight mb-2 group-hover:text-[#ffa057] transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[#a1a4a5] text-sm mb-4">
                  <MapPin size={12} />
                  {hotel.city}, {hotel.state}
                </div>
                <p className="text-[13px] text-[#a1a4a5] leading-relaxed line-clamp-3 mb-4">
                  {hotel.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.vibes.slice(0, 4).map((v) => (
                    <span
                      key={v}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-[rgba(214,235,253,0.19)]">
                <div>
                  <span className="text-[11px] text-[#a1a4a5]">
                    rooms from{" "}
                  </span>
                  <span className="font-display text-2xl text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[11px] text-[#a1a4a5]">/night</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#ffc53d] text-sm font-medium">
                  <Star size={13} fill="#ffc53d" />
                  {hotel.rating.toFixed(1)}
                  <span className="text-[#464a4d] text-xs">
                    ({hotel.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── HORIZONTAL ─────────────────────────────────────────────────────────
  if (variant === "horizontal") {
    return (
      <motion.div
        variants={cardAnim}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
      >
        <Link href={`/hotels/${hotel.slug}`}>
          <div
            className="group flex rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(214,235,253,0.4)] transition-all duration-300"
            style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
          >
            <div className="relative w-[200px] flex-shrink-0 bg-[#0d0d0d] flex items-center justify-center text-5xl overflow-hidden">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{emoji}</span>
              )}
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.8px] capitalize"
                    style={{ color: cat.text }}
                  >
                    {hotel.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#ffc53d] text-xs font-medium">
                    <Star size={11} fill="#ffc53d" />
                    {hotel.rating.toFixed(1)}
                    <span className="text-[#464a4d]">
                      ({hotel.reviewCount})
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl text-white mb-1 group-hover:text-[#ffa057] transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-[#a1a4a5] text-xs mb-3">
                  <MapPin size={11} />
                  {hotel.city}, {hotel.state}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.vibes.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="text-[9px] px-2 py-0.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[rgba(214,235,253,0.1)]">
                <div>
                  <span className="text-[10px] text-[#a1a4a5]">
                    rooms from{" "}
                  </span>
                  <span className="font-display text-lg text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[10px] text-[#a1a4a5]">/night</span>
                </div>
                <span className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-white text-black hover:opacity-85">
                  View →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── DEFAULT (grid card) ─────────────────────────────────────────────────
  return (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <Link href={`/hotels/${hotel.slug}`}>
        <div
          className="group rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(214,235,253,0.4)] transition-all duration-300 cursor-pointer h-full flex flex-col"
          style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
        >
          {/* Cover image */}
          <div className="relative aspect-[4/3] bg-[#0d0d0d] flex items-center justify-center text-6xl overflow-hidden flex-shrink-0">
            {coverImg ? (
              <Image
                src={coverImg}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <motion.span
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {emoji}
              </motion.span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full capitalize"
                style={{
                  color: cat.text,
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                }}
              >
                {hotel.category}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-1.5 gap-2">
              <h3 className="font-display text-[17px] font-normal text-white leading-snug group-hover:text-[#ffa057] transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 text-[#ffc53d] text-xs font-medium flex-shrink-0">
                <Star size={11} fill="#ffc53d" />
                {hotel.rating.toFixed(1)}
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#a1a4a5] text-[11px] mb-3">
              <MapPin size={11} />
              {hotel.city}, {hotel.state}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {hotel.vibes.slice(0, 3).map((v) => (
                <span
                  key={v}
                  className="text-[9px] px-2 py-0.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                >
                  {v}
                </span>
              ))}
            </div>

            {/* Price + reviews — pinned to bottom */}
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(214,235,253,0.1)] mt-auto">
              <div>
                <div className="flex items-center gap-1 text-[9px] text-[#a1a4a5] mb-0.5">
                  <Tag size={9} /> rooms from
                </div>
                <div>
                  <span className="font-display text-[17px] text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[10px] text-[#a1a4a5]">/night</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#a1a4a5]">
                <Users size={11} />
                {hotel.reviewCount} reviews
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
