"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Ambient glow — top left */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,158,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Large 404 backdrop */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontSize: "clamp(160px, 25vw, 320px)",
          fontWeight: 700,
          color: "rgba(214, 235, 253, 0.03)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        404
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span
            className="text-[11px] font-medium px-3 py-1 rounded-full"
            style={{
              color: "#3b9eff",
              border: "1px solid rgba(59,158,255,0.25)",
              background: "rgba(59,158,255,0.08)",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            404 — Not Found
          </span>
        </div>

        {/* Heading */}
        <h1
          className="mb-4"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#f0f0f0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Page not found.
        </h1>

        {/* Sub */}
        <p
          className="mb-10 text-[15px] leading-relaxed"
          style={{ color: "#464a4d", fontFamily: "Inter, sans-serif" }}
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          Head back and try again.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="text-[13px] font-medium px-5 py-2 rounded-full transition-all"
            style={{
              color: "#000000",
              background: "#f0f0f0",
              fontFamily: "Inter, sans-serif",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#f0f0f0";
            }}
          >
            Go Home
          </Link>

          <Link
            href="/search"
            className="text-[13px] font-medium px-5 py-2 rounded-full transition-all"
            style={{
              color: "#f0f0f0",
              border: "1px solid rgba(214, 235, 253, 0.19)",
              background: "transparent",
              fontFamily: "Inter, sans-serif",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            Browse Hotels
          </Link>
        </div>
      </motion.div>

      {/* Bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "rgba(214, 235, 253, 0.08)" }}
      />
    </div>
  );
}
