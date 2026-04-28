"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, Bot, Search, MapPin,
  Wallet, Hotel, RotateCcw,
} from "lucide-react";

const SUGGESTIONS = [
  { icon: <MapPin size={13} />, label: "5-day Rajasthan itinerary for ₹60k", text: "Plan a 5-day Rajasthan trip for 2 people with a budget of ₹60,000" },
  { icon: <Search size={13} />, label: "Romantic beach stays in Goa", text: "Find the best romantic beach hotels in Goa under ₹6000 per night" },
  { icon: <Wallet size={13} />, label: "Kerala honeymoon budget planner", text: "Create a complete budget breakdown for a 7-day Kerala honeymoon" },
  { icon: <Hotel size={13} />, label: "Luxury Mumbai rooftop pool hotels", text: "Show me luxury hotels in Mumbai with a rooftop pool" },
  { icon: <MapPin size={13} />, label: "Hidden gems in Himachal Pradesh", text: "Find hidden gem stays in Himachal Pradesh for adventure travellers" },
  { icon: <Wallet size={13} />, label: "Budget solo trip to Rishikesh", text: "Plan a budget solo trip to Rishikesh under ₹15,000 for 4 nights" },
];

const WELCOME_FEATURES = [
  { icon: <Search size={15} />, color: "#3b9eff", bg: "rgba(59,158,255,0.12)", title: "Hotel Search", desc: "Natural language search across India" },
  { icon: <Wallet size={15} />, color: "#ff801f", bg: "rgba(255,128,31,0.12)", title: "Budget Planner", desc: "Full trip cost breakdown" },
  { icon: <MapPin size={15} />, color: "#11ff99", bg: "rgba(17,255,153,0.1)", title: "Itinerary Builder", desc: "Day-by-day trip planning" },
];

export default function ConciergeClient() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat({
    api: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/ai/concierge`,
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

  const hasMessages = messages.length > 0;

  return (
    <div className="pt-[60px] h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-[rgba(214,235,253,0.19)] px-6 py-4"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(59,158,255,0.15)" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Bot size={16} className="text-[#3b9eff]" />
            </motion.div>
            <div>
              <div className="text-[14px] font-medium text-white">AI Concierge</div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#3b9eff]">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#3b9eff] inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Groq AI · Llama 3.1-70b · Streaming
              </div>
            </div>
          </div>
          {hasMessages && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 text-[11px] text-[#a1a4a5] hover:text-white border border-[rgba(214,235,253,0.19)] px-3 py-1.5 rounded-full transition-colors"
            >
              <RotateCcw size={11} /> New chat
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">

          {/* Welcome state */}
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(59,158,255,0.12)", border: "1px solid rgba(59,158,255,0.2)" }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles size={28} className="text-[#3b9eff]" />
              </motion.div>
              <h2 className="font-display text-4xl font-light text-white mb-2">How can I help?</h2>
              <p className="text-[#a1a4a5] text-sm mb-8">Your AI travel assistant for India. Search hotels, plan budgets, build itineraries.</p>

              {/* Feature pills */}
              <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {WELCOME_FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(214,235,253,0.19)]"
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.bg, color: f.color }}>
                      {f.icon}
                    </div>
                    <span className="text-[12px] text-[#a1a4a5]">{f.title}</span>
                  </div>
                ))}
              </div>

              {/* Suggestion grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.02, borderColor: "rgba(214,235,253,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestion(s.text)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] text-left hover:bg-[rgba(255,255,255,0.04)] transition-all"
                  >
                    <span className="text-[#a1a4a5]">{s.icon}</span>
                    <span className="text-[13px] text-[#a1a4a5]">{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(59,158,255,0.15)" }}>
                    <Sparkles size={13} className="text-[#3b9eff]" />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? {
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(214,235,253,0.19)",
                          color: "#f0f0f0",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "rgba(59,158,255,0.07)",
                          border: "1px solid rgba(59,158,255,0.18)",
                          color: "#f0f0f0",
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,158,255,0.15)" }}>
                <Sparkles size={13} className="text-[#3b9eff]" />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(59,158,255,0.07)", border: "1px solid rgba(59,158,255,0.18)", borderBottomLeftRadius: 4 }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#3b9eff]"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Inline suggestions after first response */}
          {hasMessages && !isLoading && messages[messages.length - 1]?.role === "assistant" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 pl-11"
            >
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <motion.button
                  key={s.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestion(s.text)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[#3b9eff] hover:text-[#3b9eff] hover:bg-[rgba(59,158,255,0.05)] transition-all"
                >
                  {s.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-t border-[rgba(214,235,253,0.19)] px-6 py-4"
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.03)] px-4 py-3 focus-within:border-[rgba(214,235,253,0.45)] transition-colors"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about travel in India…"
              rows={1}
              className="flex-1 bg-transparent text-[14px] text-[#f0f0f0] placeholder-[#464a4d] outline-none resize-none max-h-[120px] leading-relaxed"
              style={{ scrollbarWidth: "none" }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
              style={{ background: input.trim() ? "#3b9eff" : "rgba(59,158,255,0.3)" }}
            >
              <Send size={14} className="text-white" />
            </motion.button>
          </div>
          <p className="text-center text-[10px] text-[#464a4d] mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </form>
      </motion.div>
    </div>
  );
}
