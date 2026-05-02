"use client";

import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { HotelCard } from "@/lib/parseConciergeMessage";

interface Props {
  hotels: HotelCard[];
  onSelect: (hotel: HotelCard) => void;
}

const CAT_COLOR: Record<string, string> = {
  luxury: "#f0b429",
  boutique: "#b983ff",
  comfort: "#3b9eff",
  budget: "#11ff99",
};

export default function HotelOptionCards({ hotels, onSelect }: Props) {
  // Support both `hotels` directly and `hotels.hotels` (API shape variations)
  const list: HotelCard[] =
    (Array.isArray(hotels) ? hotels : (hotels as any).hotels) ?? [];

  if (!list.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-1.5"
    >
      {/* Divider label */}
      <div className="flex items-center gap-2 px-0.5 mb-1">
        <div
          className="h-px flex-1"
          style={{ background: "rgba(59,158,255,0.12)" }}
        />
        <span className="text-[9px] text-[#3b9eff] font-semibold tracking-widest uppercase">
          {list.length} hotel{list.length !== 1 ? "s" : ""} found
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "rgba(59,158,255,0.12)" }}
        />
      </div>

      {list.map((hotel, i) => {
        const accent = CAT_COLOR[hotel.category] ?? "#3b9eff";
        return (
          <motion.button
            key={hotel._id ?? i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ x: 1, borderColor: `${accent}35` }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(hotel)}
            className="relative w-full text-left rounded-xl overflow-hidden transition-all group"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(214,235,253,0.1)",
            }}
          >
            {/* Top accent line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
              }}
            />

            <div className="p-3 sm:p-3.5">
              <div className="flex items-start gap-3">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: accent }}
                    />
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest capitalize"
                      style={{ color: accent }}
                    >
                      {hotel.category}
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-semibold text-white leading-tight truncate mb-1 group-hover:text-[#dde8f0] transition-colors">
                    {hotel.name}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#464a4d]">
                    <MapPin size={9} className="flex-shrink-0" />
                    <span className="truncate">{hotel.city}</span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-0.5">
                    <Star
                      size={10}
                      style={{ fill: "#f0b429", color: "#f0b429" }}
                    />
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#f0b429" }}
                    >
                      {hotel.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-white">
                      ₹{hotel.startingFrom?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] text-[#464a4d]">/n</span>
                  </div>
                </div>
              </div>

              {/* Vibes */}
              {hotel.vibes?.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {hotel.vibes.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="text-[9px] px-1.5 py-0.5 rounded-full capitalize"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(214,235,253,0.08)",
                        color: "#5a6070",
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div
                className="mt-2 pt-2 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(214,235,253,0.06)" }}
              >
                <span className="text-[9px] text-[#333]">Tap to see rooms</span>
                <span
                  className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: accent }}
                >
                  View rooms →
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
