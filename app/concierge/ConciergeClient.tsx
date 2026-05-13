"use client";

import React, { useEffect, useRef } from "react";
import ROUTES from "@/constants/routes.json";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Hotel,
  MapPin,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Wallet,
} from "lucide-react";
import { API_URL } from "@/lib/axios";
import MessageBubble from "@/components/Messagebubble";
import type { HotelCard, RoomCard } from "@/lib/parseConciergeMessage";

const SUGGESTIONS = [
  {
    icon: <MapPin size={14} />,
    label: "5-day Rajasthan for ₹60k",
    text: "Plan a 5-day Rajasthan trip for 2 people with a budget of ₹60,000",
  },
  {
    icon: <Search size={14} />,
    label: "Romantic beach stays in Goa",
    text: "Find the best romantic beach hotels in Goa under ₹6000 per night",
  },
  {
    icon: <Wallet size={14} />,
    label: "Kerala honeymoon budget",
    text: "Create a complete budget breakdown for a 7-day Kerala honeymoon",
  },
  {
    icon: <Hotel size={14} />,
    label: "Luxury Mumbai rooftop pool",
    text: "Show me luxury hotels in Mumbai with a rooftop pool",
  },
  {
    icon: <MapPin size={14} />,
    label: "Hidden gems in Himachal",
    text: "Find hidden gem stays in Himachal Pradesh for adventure travellers",
  },
  {
    icon: <Wallet size={14} />,
    label: "Budget solo Rishikesh trip",
    text: "Plan a budget solo trip to Rishikesh under ₹15,000 for 4 nights",
  },
];

const FEATURES = [
  {
    icon: <Search size={13} />,
    color: "#3b9eff",
    bg: "rgba(59,158,255,0.15)",
    label: "Hotel Search",
  },
  {
    icon: <Wallet size={13} />,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.15)",
    label: "Budget Planner",
  },
  {
    icon: <MapPin size={13} />,
    color: "#11ff99",
    bg: "rgba(17,255,153,0.13)",
    label: "Itinerary Builder",
  },
];

export default function ConciergeClient() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = `${API_URL}/api/v1${ROUTES.AI.CONCIERGE}`;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    setMessages,
  } = useChat({
    api: apiUrl,
    streamMode: "text",
    onError: (err) => console.error("Chat error:", err),
  });

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (hasMessages) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, hasMessages]);

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) handleSubmit(e as any);
    }
  };

  const handleHotelSelect = (hotel: HotelCard) => {
    setInput(`I like ${hotel.name}. Show me the available rooms.`);
    setTimeout(
      () =>
        (
          document.getElementById("concierge-form") as HTMLFormElement
        )?.requestSubmit(),
      50,
    );
  };

  const handleRoomSelect = (room: RoomCard, hotelSlug?: string) => {
    setInput(`I want to book the ${room.name} room${hotelSlug ? ` at ${hotelSlug}` : ""}.`);
    setTimeout(
      () =>
        (
          document.getElementById("concierge-form") as HTMLFormElement
        )?.requestSubmit(),
      50,
    );
  };

  const handleBookingLink = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div
      className="flex flex-col bg-black"
      style={{ height: "100svh", paddingTop: "60px" }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-[rgba(214,235,253,0.12)] px-4 sm:px-6 py-3"
        style={{ background: "rgba(0,0,0,0.94)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(59,158,255,0.14)",
                border: "1px solid rgba(59,158,255,0.25)",
              }}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Bot size={15} className="text-[#3b9eff]" />
            </motion.div>
            <div>
              <div className="text-[14px] font-semibold text-white leading-tight">
                AI Concierge
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#11ff99] inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] text-[#a1a4a5]">
                  NestIQ AI · Streaming
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {hasMessages && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 text-[11px] text-[#a1a4a5] hover:text-white border border-[rgba(214,235,253,0.18)] px-2.5 py-1.5 rounded-full transition-colors"
              >
                <RotateCcw size={10} /> New chat
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Scroll area ──────────────────────────────────── */}
      <div
        className={`flex-1 min-h-0 ${
          hasMessages
            ? "overflow-y-auto overscroll-contain"
            : "overflow-hidden flex flex-col"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(214,235,253,0.08) transparent",
        }}
      >
        {/* Welcome state */}
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6"
          >
            {/* Icon — smaller on desktop too */}
            <motion.div
              className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
              style={{
                background: "rgba(59,158,255,0.12)",
                border: "1px solid rgba(59,158,255,0.22)",
              }}
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Sparkles size={26} className="text-[#3b9eff]" />
            </motion.div>

            {/* Heading — scales between mobile and desktop */}
            <h2
              className="font-display text-white mb-2 text-center leading-tight"
              style={{ fontSize: "clamp(28px, 5.5vw, 44px)", fontWeight: 300 }}
            >
              How can I help?
            </h2>

            <p
              className="text-[#a1a4a5] mb-6 text-center leading-relaxed"
              style={{
                fontSize: "clamp(13px, 2vw, 15px)",
                maxWidth: "320px",
              }}
            >
              Search hotels, plan budgets, build itineraries across India.
            </p>

            {/* Feature chips */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.15)] bg-[rgba(255,255,255,0.03)]"
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[11px] sm:text-[12px] text-[#a1a4a5] font-medium whitespace-nowrap">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="grid grid-cols-2 gap-2 w-full"
              style={{ maxWidth: 540 }}
            >
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(59,158,255,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestion(s.text)}
                  className="flex items-start gap-2.5 rounded-xl border border-[rgba(214,235,253,0.14)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all text-left"
                  style={{
                    padding: "10px 12px",
                    minHeight: 48,
                  }}
                >
                  <span
                    className="text-[#3b9eff] flex-shrink-0 mt-0.5"
                    style={{ opacity: 0.85 }}
                  >
                    {s.icon}
                  </span>
                  <span
                    className="text-[#c4c8cc] leading-snug font-medium"
                    style={{ fontSize: "clamp(11px, 2.2vw, 13px)" }}
                  >
                    {s.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        {hasMessages && (
          <div className="max-w-2xl mx-auto w-full px-4 sm:px-5 py-5 flex flex-col gap-4 sm:gap-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onRoomSelect={handleRoomSelect}
                  onHotelSelect={handleHotelSelect}
                  onBookingLink={handleBookingLink}
                />
              ))}
            </AnimatePresence>

            {/* Typing dots */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5 justify-start items-start"
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(59,158,255,0.12)",
                    border: "1px solid rgba(59,158,255,0.2)",
                  }}
                >
                  <Sparkles size={13} className="text-[#3b9eff]" />
                </div>
                <div
                  className="flex items-center gap-2 px-3.5 py-3 rounded-2xl"
                  style={{
                    background: "rgba(59,158,255,0.08)",
                    border: "1px solid rgba(59,158,255,0.18)",
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#3b9eff]"
                      animate={{
                        opacity: [0.25, 1, 0.25],
                        scale: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.18,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Follow-up pills */}
            {!isLoading &&
              messages[messages.length - 1]?.role === "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap gap-2 pl-9 sm:pl-11"
                >
                  {SUGGESTIONS.slice(0, 3).map((s) => (
                    <motion.button
                      key={s.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestion(s.text)}
                      className="text-[11px] sm:text-[12px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.14)] text-[#a1a4a5] hover:border-[rgba(59,158,255,0.45)] hover:text-[#3b9eff] hover:bg-[rgba(59,158,255,0.06)] transition-all"
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-shrink-0 border-t border-[rgba(214,235,253,0.12)] px-3 sm:px-5 py-3 sm:py-3.5"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      >
        <form
          id="concierge-form"
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-end gap-2.5 rounded-xl sm:rounded-2xl border border-[rgba(214,235,253,0.18)] bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 sm:px-4 sm:py-3 focus-within:border-[rgba(214,235,253,0.38)] transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about travel in India…"
              rows={1}
              className="flex-1 bg-transparent text-[14px] sm:text-[15px] text-[#f0f0f0] placeholder-[#3a3d40] outline-none resize-none leading-relaxed"
              style={{ maxHeight: 100, scrollbarWidth: "none" }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-25"
              style={{
                background: input.trim() ? "#3b9eff" : "rgba(59,158,255,0.2)",
              }}
            >
              <Send size={14} className="text-white" />
            </motion.button>
          </div>

          {/* Only show hint on desktop — saves space on mobile */}
          <p className="hidden sm:block text-center text-[10px] text-[#2a2d30] mt-1.5 select-none">
            Enter to send · Shift+Enter for new line
          </p>
        </form>
      </motion.div>
    </div>
  );
}
