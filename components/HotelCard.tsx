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
  lowestRoomPrice?: number;
}

const CAT: Record<string, { text: string; bg: string; border: string }> = {
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

export default function HotelCard({
  hotel,
  variant = "default",
  index = 0,
  lowestRoomPrice,
}: HotelCardProps) {
  const cat = CAT[hotel.category] ?? CAT.budget;
  const emoji = EMOJI[hotel.category] ?? "🏨";
  const price = lowestRoomPrice ?? hotel.pricePerNight;
  const coverImg = hotel.images?.[0]?.url;

  const anim = {
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

  // ── FEATURED ────────────────────────────────────────────────────────────
  if (variant === "featured") {
    return (
      <motion.div
        variants={anim}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -4 }}
        className="col-span-1 sm:col-span-2"
      >
        <Link href={`/hotels/${hotel.slug}`}>
          <div
            className="group grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(214,235,253,0.4)] transition-all duration-300"
            style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
          >
            {/* Image */}
            <div className="relative h-[200px] sm:min-h-[260px] bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <motion.span
                  className="text-7xl sm:text-8xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {emoji}
                </motion.span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>
            {/* Body */}
            <div className="p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <span
                  className="inline-block text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.8px] px-2 sm:px-2.5 py-1 rounded-full mb-3 sm:mb-4 capitalize"
                  style={{
                    color: cat.text,
                    background: cat.bg,
                    border: `1px solid ${cat.border}`,
                  }}
                >
                  {hotel.category} · Featured
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-1.5 sm:mb-2 group-hover:text-[#ffa057] transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[#a1a4a5] text-xs sm:text-sm mb-3 sm:mb-4">
                  <MapPin size={11} />
                  {hotel.city}, {hotel.state}
                </div>
                <p className="text-[12px] sm:text-[13px] text-[#a1a4a5] leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
                  {hotel.description}
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {hotel.vibes.slice(0, 4).map((v) => (
                    <span
                      key={v}
                      className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-[rgba(214,235,253,0.19)] mt-4 sm:mt-0">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-[#a1a4a5]">
                    rooms from{" "}
                  </span>
                  <span className="font-display text-xl sm:text-2xl text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#a1a4a5]">
                    /night
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[#ffc53d] text-xs sm:text-sm font-medium">
                  <Star size={12} fill="#ffc53d" />
                  {hotel.rating.toFixed(1)}
                  <span className="text-[#464a4d] text-[10px] sm:text-xs hidden sm:inline">
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

  // ── HORIZONTAL ──────────────────────────────────────────────────────────
  if (variant === "horizontal") {
    return (
      <motion.div
        variants={anim}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
      >
        <Link href={`/hotels/${hotel.slug}`}>
          <div
            className="group flex rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(214,235,253,0.4)] transition-all duration-300"
            style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
          >
            {/* Image — narrower on mobile */}
            <div className="relative w-[120px] sm:w-[200px] flex-shrink-0 bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-5xl">{emoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0 p-3 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span
                    className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.8px] capitalize"
                    style={{ color: cat.text }}
                  >
                    {hotel.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#ffc53d] text-[10px] sm:text-xs font-medium">
                    <Star size={10} fill="#ffc53d" />
                    {hotel.rating.toFixed(1)}
                    <span className="text-[#464a4d] hidden sm:inline">
                      ({hotel.reviewCount})
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-[16px] sm:text-xl text-white mb-1 group-hover:text-[#ffa057] transition-colors leading-tight truncate">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-[#a1a4a5] text-[10px] sm:text-xs mb-2 sm:mb-3">
                  <MapPin size={10} />
                  {hotel.city}, {hotel.state}
                </div>
                <div className="hidden sm:flex flex-wrap gap-1.5">
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
              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-[rgba(214,235,253,0.1)]">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-[#a1a4a5]">
                    from{" "}
                  </span>
                  <span className="font-display text-[16px] sm:text-lg text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#a1a4a5]">
                    /night
                  </span>
                </div>
                <span className="text-[11px] sm:text-[12px] font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white text-black hover:opacity-85">
                  View →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── DEFAULT ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={anim}
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
          <div className="relative aspect-[4/3] bg-[#0d0d0d] flex items-center justify-center overflow-hidden flex-shrink-0">
            {coverImg ? (
              <Image
                src={coverImg}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <motion.span
                className="text-5xl sm:text-6xl"
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
            <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
              <span
                className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.8px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full capitalize"
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
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-1 sm:mb-1.5 gap-2">
              <h3 className="font-display text-[15px] sm:text-[17px] font-normal text-white leading-snug group-hover:text-[#ffa057] transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[#ffc53d] text-[10px] sm:text-xs font-medium flex-shrink-0">
                <Star size={10} fill="#ffc53d" />
                {hotel.rating.toFixed(1)}
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#a1a4a5] text-[10px] sm:text-[11px] mb-2 sm:mb-3">
              <MapPin size={10} />
              {hotel.city}, {hotel.state}
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
              {hotel.vibes.slice(0, 3).map((v) => (
                <span
                  key={v}
                  className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] capitalize"
                >
                  {v}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-[rgba(214,235,253,0.1)] mt-auto">
              <div>
                <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-[#a1a4a5] mb-0.5">
                  <Tag size={8} /> rooms from
                </div>
                <div>
                  <span className="font-display text-[15px] sm:text-[17px] text-white">
                    {formatPrice(price)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#a1a4a5]">
                    /night
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-[#a1a4a5]">
                <Users size={10} />
                <span className="hidden sm:inline">
                  {hotel.reviewCount} reviews
                </span>
                <span className="sm:hidden">{hotel.reviewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
