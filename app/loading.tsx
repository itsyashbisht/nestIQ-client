"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
    >
      {/* Logo wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 flex items-center gap-1"
      >
        <span
          className="text-[18px] font-semibold tracking-tight"
          style={{ color: "#f0f0f0", fontFamily: "Inter, sans-serif" }}
        >
          Nest
        </span>
        <span
          className="text-[18px] font-semibold tracking-tight"
          style={{ color: "#3b9eff" }}
        >
          IQ
        </span>
      </motion.div>

      {/* Animated ring loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-8"
      >
        {/* Outer frost ring */}
        <div
          className="w-14 h-14 rounded-full"
          style={{ border: "1px solid rgba(214, 235, 253, 0.19)" }}
        />
        {/* Spinning accent arc */}
        <div
          className="absolute inset-0 w-14 h-14 rounded-full animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 70%, #3b9eff 100%)",
            animationDuration: "1s",
            animationTimingFunction: "linear",
          }}
        />
        {/* Inner black fill */}
        <div
          className="absolute inset-[3px] rounded-full"
          style={{ background: "#000000" }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#3b9eff" }}
          />
        </div>
      </motion.div>

      {/* Animated dots label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center gap-1.5"
      >
        <span
          className="text-[12px]"
          style={{ color: "#464a4d", fontFamily: "Inter, sans-serif" }}
        >
          Loading
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: "#464a4d" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
