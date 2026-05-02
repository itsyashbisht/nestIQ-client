"use client";

import { motion } from "framer-motion";
import { ChevronRight, Users, Zap } from "lucide-react";
import Link from "next/link";
import type { RoomCard } from "@/lib/parseConciergeMessage";

interface Props {
  rooms: RoomCard[];
  hotelName: string;
  hotelSlug: string;
}

const ROOM_STYLE: Record<string, { icon: string; color: string; bg: string }> =
  {
    dormitory: { icon: "🛏", color: "#11ff99", bg: "rgba(17,255,153,0.07)" },
    standard: { icon: "🏠", color: "#3b9eff", bg: "rgba(59,158,255,0.07)" },
    deluxe: { icon: "✨", color: "#b983ff", bg: "rgba(185,131,255,0.07)" },
    suite: { icon: "👑", color: "#f0b429", bg: "rgba(240,180,41,0.07)" },
    villa: { icon: "🏡", color: "#ff6b6b", bg: "rgba(255,107,107,0.07)" },
  };

export default function RoomOptionCards({
  rooms,
  hotelName,
  hotelSlug,
}: Props) {
  // Support both `rooms` array directly and `rooms.rooms`
  const list: RoomCard[] =
    (Array.isArray(rooms) ? rooms : (rooms as any).rooms) ?? [];

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
          style={{ background: "rgba(185,131,255,0.12)" }}
        />
        <span className="text-[9px] text-[#b983ff] font-bold tracking-widest uppercase">
          {list.length} room{list.length !== 1 ? "s" : ""} · {hotelName}
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "rgba(185,131,255,0.12)" }}
        />
      </div>

      {list.map((room, i) => {
        const style = ROOM_STYLE[room.type] ?? ROOM_STYLE.standard;
        return (
          <motion.div
            key={room._id ?? i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              href={room.bookingLink}
              className="block rounded-xl overflow-hidden transition-all group"
              style={{
                background: style.bg,
                border: `1px solid ${style.color}22`,
              }}
            >
              <div className="p-3 sm:p-3.5">
                {/* Top row */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{
                        background: `${style.color}18`,
                        border: `1px solid ${style.color}28`,
                      }}
                    >
                      {style.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight truncate">
                        {room.name}
                      </p>
                      <span
                        className="text-[9px] capitalize font-medium"
                        style={{ color: style.color }}
                      >
                        {room.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] sm:text-[14px] font-bold text-white">
                      ₹{room.pricePerNight?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[9px] text-[#464a4d]">/night</p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-[10px] text-[#5a6070]">
                    <Users size={9} />
                    <span>
                      Max {room.maxGuests}
                      {room.maxGuests > 1 ? " guests" : " guest"}
                    </span>
                  </div>
                  {room.amenities?.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-[#5a6070] min-w-0">
                      <Zap size={9} className="flex-shrink-0" />
                      <span className="truncate">
                        {room.amenities.slice(0, 2).join(" · ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: `1px solid ${style.color}12` }}
                >
                  <span className="text-[9px] text-[#333]">Click to book</span>
                  <div
                    className="flex items-center gap-0.5 text-[10px] font-semibold opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ color: style.color }}
                  >
                    Book now <ChevronRight size={11} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
