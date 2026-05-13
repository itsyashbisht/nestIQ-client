"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  type HotelCard,
  parseConciergeMessage,
  RoomCard,
} from "@/lib/parseConciergeMessage";
import HotelOptionCards from "./HotelOptionCard";
import RoomOptionCards from "./RoomOptionCards";

interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool" | "function" | "data";
  content: string;
}

interface Props {
  message: Message;
  onHotelSelect: (hotel: HotelCard) => void;
  onRoomSelect: (room: RoomCard, hotelSlug?: string) => void;
  onBookingLink?: (link: string) => void;
}

export default function MessageBubble({
  message,
  onHotelSelect,
  onRoomSelect,
  onBookingLink,
}: Props) {
  // ── User ───────────────────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex justify-end"
      >
        <div
          className="max-w-[80%] sm:max-w-[72%] px-4 py-3 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(214,235,253,0.18)",
            color: "#eaeaea",
            borderBottomRightRadius: 5,
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  // ── Assistant ──────────────────────────────────────────────────────────────
  const parts = parseConciergeMessage(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex justify-start gap-3"
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: "rgba(59,158,255,0.14)",
          border: "1px solid rgba(59,158,255,0.22)",
        }}
      >
        <Sparkles size={14} className="text-[#3b9eff]" />
      </div>

      {/* Parts */}
      <div className="flex flex-col gap-2.5 min-w-0 max-w-[85%] sm:max-w-[80%]">
        {parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className="px-4 py-3 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                style={{
                  background: "rgba(59,158,255,0.07)",
                  border: "1px solid rgba(59,158,255,0.16)",
                  color: "#eaeaea",
                  borderBottomLeftRadius: 5,
                }}
              >
                {part.content}
              </div>
            );
          }
          if (part.type === "hotels") {
            return (
              <HotelOptionCards
                key={i}
                hotels={part.hotels}
                onSelect={onHotelSelect}
              />
            );
          }
          if (part.type === "rooms") {
            return (
              <RoomOptionCards
                key={i}
                rooms={part.rooms}
                onSelect={onRoomSelect}
                hotelName={part.hotelName}
                hotelSlug={part.hotelSlug}
              />
            );
          }

          if (part.type === "bookingLink") {
            return (
              <button
                key={i}
                onClick={() => onBookingLink?.(part.link)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-medium text-white bg-[#ff801f] hover:bg-[#ff9f4f] transition-colors"
              >
                Book Now →
              </button>
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
}
