"use client";

import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelChatProps {
  hotelId: string;
  hotelName: string;
  onClose?: () => void;
}

const SUGGESTIONS = [
  "Is breakfast included?",
  "What's the check-in time?",
  "What's the check-out time?",
  "Do you allow pets?",
  "Nearby restaurants?",
];

export default function HotelChat({
  hotelId,
  hotelName,
  onClose,
}: HotelChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nestiq-ai/chat`,
    body: { hotelId },
    streamMode: "text",
    onError: (err) => console.error("Chat error:", err),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I'm the AI assistant for **${hotelName}**. Ask me anything — amenities, nearby places, policies, or special requests!`,
      },
    ],
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="rounded-2xl border border-[rgba(59,158,255,0.2)] overflow-hidden"
      style={{ background: "rgba(59,158,255,0.03)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-[rgba(59,158,255,0.15)]">
        <motion.div
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(59,158,255,0.15)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot size={12} className="text-[#3b9eff]" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="text-[12px] sm:text-[13px] font-medium text-[#f0f0f0] truncate">
            Ask about {hotelName}
          </div>
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#3b9eff]">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#3b9eff] inline-block flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            NestIQ AI · Streaming
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#464a4d] hover:text-[#a1a4a5] transition-colors p-1 flex-shrink-0"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Messages — taller on desktop, shorter on mobile */}
      <div
        className="h-[220px] sm:h-[260px] md:h-[290px] overflow-y-auto px-3.5 sm:px-4 py-3 flex flex-col gap-2.5 sm:gap-3"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(59,158,255,0.15) transparent",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-5 h-5 rounded-full bg-[rgba(59,158,255,0.18)] flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0">
                  <Sparkles size={9} className="text-[#3b9eff]" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] sm:max-w-[82%] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] leading-relaxed break-words",
                  msg.role === "user"
                    ? "bg-[rgba(255,255,255,0.07)] border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] rounded-br-sm"
                    : "bg-[rgba(59,158,255,0.08)] border border-[rgba(59,158,255,0.2)] text-[#f0f0f0] rounded-bl-sm",
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-xl bg-[rgba(59,158,255,0.08)] border border-[rgba(59,158,255,0.2)]">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#3b9eff]"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion pills — scrollable row on mobile */}
      {messages.length <= 1 && (
        <div
          className="px-3.5 sm:px-4 pb-2 flex gap-1.5 sm:gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setInput(s)}
              className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[#3b9eff] hover:text-[#3b9eff] hover:bg-[rgba(59,158,255,0.05)] transition-all whitespace-nowrap flex-shrink-0"
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-2.5 sm:p-3 border-t border-[rgba(59,158,255,0.1)]"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything about this hotel..."
          className="flex-1 min-w-0 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg px-3 py-2 text-[12px] sm:text-[13px] text-[#f0f0f0] placeholder-[#464a4d] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#3b9eff] flex items-center justify-center disabled:opacity-35 transition-opacity flex-shrink-0"
        >
          <Send size={13} className="text-white" />
        </motion.button>
      </form>
    </motion.div>
  );
}
