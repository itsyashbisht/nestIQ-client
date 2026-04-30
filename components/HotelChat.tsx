"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
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
    onError: (err) => {
      console.error("Chat error:", err);
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I'm the AI assistant for **${hotelName}**. Ask me anything — amenities, nearby places, policies, or special requests. I'm here to help!`,
      },
    ],
  });

  console.log(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-2xl border border-[rgba(59,158,255,0.2)] overflow-hidden"
      style={{ background: "rgba(59,158,255,0.03)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[rgba(59,158,255,0.15)]">
        <motion.div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,158,255,0.15)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot size={14} className="text-[#3b9eff]" />
        </motion.div>
        <div className="flex-1">
          <div className="text-[13px] font-medium text-[#f0f0f0]">
            Ask about {hotelName}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#3b9eff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b9eff] inline-block animate-pulse" />
            Powered by Groq · Llama 3.1
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#464a4d] hover:text-[#a1a4a5] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="h-[280px] overflow-y-auto px-4 py-3 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-5 h-5 rounded-full bg-[rgba(59,158,255,0.2)] flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <Sparkles size={10} className="text-[#3b9eff]" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed",
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
            <div className="flex gap-1.5 px-3.5 py-3 rounded-xl bg-[rgba(59,158,255,0.08)] border border-[rgba(59,158,255,0.2)]">
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

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setInput(s)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[#3b9eff] hover:text-[#3b9eff] hover:bg-[rgba(59,158,255,0.05)] transition-all"
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t border-[rgba(59,158,255,0.1)]"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything about this hotel..."
          className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg px-3 py-2 text-[13px] text-[#f0f0f0] placeholder-[#464a4d] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors"
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-lg bg-[#3b9eff] flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <Send size={14} className="text-white" />
        </motion.button>
      </form>
    </motion.div>
  );
}
