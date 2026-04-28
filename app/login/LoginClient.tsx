"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { loginUser } from "@/thunks/auth.thunk";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 5 + ((i * 23 + 7) % 90),
  y: 5 + ((i * 31 + 13) % 90),
  size: (i % 3) + 1.5,
  duration: 6 + (i % 5) * 2,
  delay: (i % 6) * 0.7,
}));

const FEATURES = [
  { icon: "🏛️", label: "Heritage Palaces" },
  { icon: "🌊", label: "Beachfront Stays" },
  { icon: "🌿", label: "Nature Retreats" },
  { icon: "✨", label: "Luxury Suites" },
];

function LeftPanel() {
  return (
    <div
      className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden px-10 py-12"
      style={{
        background:
          "linear-gradient(145deg, #080808 0%, #0d0a06 40%, #0a0d12 100%)",
      }}
    >
      {/* Ambient glow blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,128,31,0.12) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-5%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,158,255,0.1) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[5%] w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(17,255,153,0.06) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? "rgba(255,128,31,0.7)"
                : p.id % 3 === 1
                  ? "rgba(59,158,255,0.6)"
                  : "rgba(17,255,153,0.5)",
          }}
          animate={{ y: [0, -28, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(214,235,253,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(214,235,253,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "#f0f0f0" }}
          >
            Nest<span style={{ color: "#ff801f" }}>IQ</span>
          </span>
        </Link>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative hotel card */}
          <motion.div
            className="mb-8 p-5 rounded-2xl border border-[rgba(214,235,253,0.12)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm"
            whileHover={{
              borderColor: "rgba(255,128,31,0.3)",
              background: "rgba(255,255,255,0.05)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,128,31,0.15)] flex items-center justify-center text-xl">
                🏛️
              </div>
              <div>
                <div className="text-[13px] font-medium text-white">
                  Rajputana Palace & Spa
                </div>
                <div className="text-[11px] text-[#a1a4a5]">
                  Jaipur, Rajasthan
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[#ffc53d] text-[11px]">
                <Star size={10} fill="#ffc53d" /> 4.9
              </div>
            </div>
            <div className="h-px bg-[rgba(214,235,253,0.1)] mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] text-[#a1a4a5] mb-0.5">
                  rooms from
                </div>
                <div className="font-display text-xl text-white">
                  ₹8,500{" "}
                  <span className="text-[11px] font-sans text-[#a1a4a5]">
                    /night
                  </span>
                </div>
              </div>
              <motion.div
                className="text-[9px] font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(17,255,153,0.12)",
                  color: "#11ff99",
                  border: "1px solid rgba(17,255,153,0.25)",
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✓ Available Now
              </motion.div>
            </div>
          </motion.div>

          <h2
            className="font-display text-4xl font-light text-white leading-tight mb-3"
            style={{ letterSpacing: "-0.5px" }}
          >
            Discover India&apos;s
            <br />
            <motion.em
              className="not-italic"
              style={{ color: "#ff801f" }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              finest stays
            </motion.em>
          </h2>

          <p className="text-[13px] text-[#a1a4a5] leading-relaxed mb-6 max-w-xs">
            From heritage palaces to beachfront villas — AI-powered search finds
            your perfect room in seconds.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.15)] bg-[rgba(255,255,255,0.03)] text-[11px] text-[#a1a4a5]"
              >
                <span>{f.icon}</span> {f.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Review card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl border border-[rgba(214,235,253,0.1)] bg-[rgba(255,255,255,0.02)]"
        >
          <div className="text-[#ffc53d] text-xs mb-2">★★★★★</div>
          <p className="text-[12px] text-[#a1a4a5] italic mb-3">
            &ldquo;Found the perfect Goa stay in seconds. The AI knew exactly
            what I wanted.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#ff801f] flex items-center justify-center text-[9px] font-bold text-black">
              P
            </div>
            <span className="text-[11px] text-[#a1a4a5]">
              Priya S. · Mumbai
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center gap-8"
      >
        {[
          ["500+", "Hotels"],
          ["50K+", "Guests"],
          ["4.9★", "Rating"],
        ].map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="font-display text-xl text-white">{num}</div>
            <div className="text-[10px] text-[#464a4d]">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function LoginClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector((s) => s.auth);

  /* Backend: { email, password } */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, [user]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
  };

  const isLoading = status === "loading";
  const canSubmit = !!email && !!password && !isLoading;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LeftPanel />

      {/* RIGHT — form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 xl:px-16 py-12 bg-black relative min-h-screen">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(255,128,31,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(59,158,255,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/">
            <span
              className="font-display text-2xl font-semibold"
              style={{ color: "#f0f0f0" }}
            >
              Nest<span style={{ color: "#ff801f" }}>IQ</span>
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px] mx-auto"
        >
          {/* Heading */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-light text-white mb-2"
              style={{ letterSpacing: "-0.5px" }}
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[13px] text-[#a1a4a5]"
            >
              Sign in to manage your bookings and explore hotels.
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                Email Address
              </label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="rahul@example.com"
                whileFocus={{ borderColor: "rgba(255,128,31,0.6)" }}
                className="w-full px-4 py-3 rounded-xl text-[14px] text-[#f0f0f0] outline-none placeholder-[#464a4d] transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(214,235,253,0.19)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#3b9eff] hover:text-[#60b0ff] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-[14px] text-[#f0f0f0] outline-none placeholder-[#464a4d] pr-12 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(214,235,253,0.19)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,128,31,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(214,235,253,0.19)")
                  }
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#464a4d] hover:text-[#a1a4a5] transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,32,71,0.08)",
                    border: "1px solid rgba(255,32,71,0.2)",
                  }}
                >
                  <AlertCircle
                    size={14}
                    className="text-[#ff2047] flex-shrink-0"
                  />
                  <span className="text-[12px] text-[#ff2047]">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileHover={{ scale: canSubmit ? 1.02 : 1 }}
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
              className="w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 mt-1 transition-all duration-200"
              style={{
                background: canSubmit ? "white" : "rgba(255,255,255,0.08)",
                color: canSubmit ? "black" : "#464a4d",
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </motion.form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[rgba(214,235,253,0.1)]" />
            <span className="text-[11px] text-[#464a4d]">new here?</span>
            <div className="flex-1 h-px bg-[rgba(214,235,253,0.1)]" />
          </div>

          <p className="text-center text-[13px] text-[#a1a4a5]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#ff801f] hover:text-[#ffa057] font-medium transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
