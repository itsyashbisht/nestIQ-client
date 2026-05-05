"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Ambient red glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,32,71,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Large 500 backdrop */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontSize: "clamp(160px, 25vw, 320px)",
          fontWeight: 700,
          color: "rgba(255, 32, 71, 0.04)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        500
      </div>

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
              color: "rgba(255,32,71,0.9)",
              border: "1px solid rgba(255,32,71,0.25)",
              background: "rgba(255,32,71,0.08)",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Something went wrong
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
          Server error.
        </h1>

        <p
          className="mb-3 text-[15px] leading-relaxed"
          style={{ color: "#464a4d", fontFamily: "Inter, sans-serif" }}
        >
          An unexpected error occurred on our end.
          <br />
          Try refreshing — it usually fixes itself.
        </p>

        {/* Error digest */}
        {error.digest && (
          <div
            className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              border: "1px solid rgba(214, 235, 253, 0.1)",
              background: "rgba(214, 235, 253, 0.03)",
            }}
          >
            <span
              className="text-[11px]"
              style={{
                color: "#464a4d",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Error ID: {error.digest}
            </span>
          </div>
        )}

        {!error.digest && <div className="mb-8" />}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-[13px] font-medium px-5 py-2 rounded-full transition-all cursor-pointer"
            style={{
              color: "#000000",
              background: "#f0f0f0",
              fontFamily: "Inter, sans-serif",
              border: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#f0f0f0";
            }}
          >
            <RotateCcw size={13} />
            Try again
          </button>

          <a
            href="/"
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
            Go Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
