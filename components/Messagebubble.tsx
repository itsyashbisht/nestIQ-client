"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  type HotelCard,
  parseConciergeMessage,
} from "@/lib/parseConciergeMessage";
import HotelOptionCards from "./HotelOptionCard";
import RoomOptionCards from "./RoomOptionCards";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  message: Message;
  onHotelSelect: (hotel: HotelCard) => void;
}

export default function MessageBubble({ message, onHotelSelect }: Props) {
  // ── User bubble ────────────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex justify-end"
      >
        <div
          className="max-w-[78%] sm:max-w-[72%] px-3.5 py-2.5 rounded-2xl text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap break-words"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(214,235,253,0.16)",
            color: "#e8e8e8",
            borderBottomRightRadius: 4,
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  // ── Assistant bubble — parse structured parts ──────────────────────────────
  const parts = parseConciergeMessage(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex justify-start gap-2.5"
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: "rgba(59,158,255,0.12)",
          border: "1px solid rgba(59,158,255,0.18)",
        }}
      >
        <Sparkles size={12} className="text-[#3b9eff]" />
      </div>

      {/* Content parts */}
      <div className="flex flex-col gap-2 min-w-0 max-w-[84%] sm:max-w-[80%]">
        {parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className="px-3.5 py-2.5 rounded-2xl text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap break-words"
                style={{
                  background: "rgba(59,158,255,0.06)",
                  border: "1px solid rgba(59,158,255,0.14)",
                  color: "#e8e8e8",
                  borderBottomLeftRadius: 4,
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
                hotelName={part.hotelName}
                hotelSlug={part.hotelSlug}
              />
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
}
