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
import type { HotelCard } from "@/lib/parseConciergeMessage";

const SUGGESTIONS = [
  {
    icon: <MapPin size={12} />,
    label: "5-day Rajasthan for ₹60k",
    text: "Plan a 5-day Rajasthan trip for 2 people with a budget of ₹60,000",
  },
  {
    icon: <Search size={12} />,
    label: "Romantic beach stays in Goa",
    text: "Find the best romantic beach hotels in Goa under ₹6000 per night",
  },
  {
    icon: <Wallet size={12} />,
    label: "Kerala honeymoon budget",
    text: "Create a complete budget breakdown for a 7-day Kerala honeymoon",
  },
  {
    icon: <Hotel size={12} />,
    label: "Luxury Mumbai rooftop pool",
    text: "Show me luxury hotels in Mumbai with a rooftop pool",
  },
  {
    icon: <MapPin size={12} />,
    label: "Hidden gems in Himachal",
    text: "Find hidden gem stays in Himachal Pradesh for adventure travellers",
  },
  {
    icon: <Wallet size={12} />,
    label: "Budget solo Rishikesh trip",
    text: "Plan a budget solo trip to Rishikesh under ₹15,000 for 4 nights",
  },
];

const FEATURES = [
  {
    icon: <Search size={13} />,
    color: "#3b9eff",
    bg: "rgba(59,158,255,0.12)",
    title: "Hotel Search",
  },
  {
    icon: <Wallet size={13} />,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.12)",
    title: "Budget Planner",
  },
  {
    icon: <MapPin size={13} />,
    color: "#11ff99",
    bg: "rgba(17,255,153,0.10)",
    title: "Itinerary Builder",
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  const hasMessages = messages.length > 0;

  return (
    <div
      className="flex flex-col bg-black"
      style={{ height: "100svh", paddingTop: "60px" }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-[rgba(214,235,253,0.12)] px-4 sm:px-6 py-3"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(59,158,255,0.12)",
                border: "1px solid rgba(59,158,255,0.2)",
              }}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Bot size={14} className="text-[#3b9eff]" />
            </motion.div>
            <div>
              <div className="text-[13px] font-medium text-white leading-tight">
                AI Concierge
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="w-1 h-1 rounded-full bg-[#11ff99] inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] text-[#464a4d]">
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
                className="flex items-center gap-1 text-[10px] text-[#a1a4a5] hover:text-white border border-[rgba(214,235,253,0.14)] px-2.5 py-1.5 rounded-full transition-colors"
              >
                <RotateCcw size={9} /> New chat
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Scroll area ─────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(214,235,253,0.08) transparent",
        }}
      >
        <div className="max-w-2xl mx-auto px-3 sm:px-5 py-5 flex flex-col gap-4">
          {/* Welcome state */}
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center pt-4 sm:pt-8 pb-2"
            >
              <motion.div
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl mb-4 flex items-center justify-center"
                style={{
                  background: "rgba(59,158,255,0.1)",
                  border: "1px solid rgba(59,158,255,0.18)",
                }}
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-[#3b9eff] sm:hidden" />
                <Sparkles
                  size={26}
                  className="text-[#3b9eff] hidden sm:block"
                />
              </motion.div>

              <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-1.5">
                How can I help?
              </h2>
              <p className="text-[11px] sm:text-[13px] text-[#a1a4a5] mb-5 max-w-[260px] sm:max-w-xs leading-relaxed">
                Search hotels, plan budgets, build itineraries across India.
              </p>

              {/* Feature chips */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.12)] bg-[rgba(255,255,255,0.02)]"
                  >
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: f.bg, color: f.color }}
                    >
                      {f.icon}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-[#a1a4a5]">
                      {f.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggestion grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 w-full max-w-md">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{
                      scale: 1.01,
                      borderColor: "rgba(214,235,253,0.28)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestion(s.text)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(214,235,253,0.1)] bg-[rgba(255,255,255,0.02)] text-left hover:bg-[rgba(255,255,255,0.04)] transition-all"
                  >
                    <span className="text-[#3b3f45] flex-shrink-0">
                      {s.icon}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-[#a1a4a5] leading-snug">
                      {s.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onHotelSelect={handleHotelSelect}
              />
            ))}
          </AnimatePresence>

          {/* Typing dots */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 justify-start"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,158,255,0.1)" }}
              >
                <Sparkles size={12} className="text-[#3b9eff]" />
              </div>
              <div
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl"
                style={{
                  background: "rgba(59,158,255,0.07)",
                  border: "1px solid rgba(59,158,255,0.14)",
                  borderBottomLeftRadius: 4,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#3b9eff]"
                    animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1, 0.7] }}
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

          {/* Follow-up suggestion pills */}
          {hasMessages &&
            !isLoading &&
            messages[messages.length - 1]?.role === "assistant" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-1.5 pl-9"
              >
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <motion.button
                    key={s.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSuggestion(s.text)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[rgba(214,235,253,0.1)] text-[#464a4d] hover:border-[rgba(59,158,255,0.4)] hover:text-[#3b9eff] hover:bg-[rgba(59,158,255,0.05)] transition-all"
                  >
                    {s.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input bar ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-shrink-0 border-t border-[rgba(214,235,253,0.1)] px-3 sm:px-5 py-3"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)" }}
      >
        <form
          id="concierge-form"
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-[rgba(214,235,253,0.14)] bg-[rgba(255,255,255,0.03)] px-3.5 py-2.5 focus-within:border-[rgba(214,235,253,0.35)] transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about travel in India…"
              rows={1}
              className="flex-1 bg-transparent text-[13px] sm:text-[14px] text-[#f0f0f0] placeholder-[#3b3f45] outline-none resize-none leading-relaxed"
              style={{ maxHeight: 96, scrollbarWidth: "none" }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-20"
              style={{
                background: input.trim() ? "#3b9eff" : "rgba(59,158,255,0.2)",
              }}
            >
              <Send size={13} className="text-white" />
            </motion.button>
          </div>
          <p className="text-center text-[9px] text-[#2a2e32] mt-1.5 select-none">
            Enter to send · Shift+Enter for new line
          </p>
        </form>
      </motion.div>
    </div>
  );
}
