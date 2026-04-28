"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { registerUser } from "@/thunks/auth.thunk";

/* ─── Password rules ────────────────────────────────────────────────── */
const PWD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

/* ─── Indian states list ─────────────────────────────────────────────── */
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* ─── Particles for left panel ───────────────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 8 + ((i * 29 + 11) % 84),
  y: 8 + ((i * 37 + 17) % 84),
  size: (i % 3) + 1,
  duration: 7 + (i % 4) * 2.5,
  delay: (i % 5) * 0.9,
}));

/* ─── Steps for the multistep form ──────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Account", desc: "Basic credentials" },
  { id: 2, label: "Personal", desc: "Your details" },
  { id: 3, label: "Address", desc: "Location info" },
];

/* ─── Left panel (same theme as login, different copy) ────────────────── */
function LeftPanel() {
  return (
    <div
      className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden px-10 py-12"
      style={{
        background:
          "linear-gradient(145deg, #080808 0%, #060b0d 40%, #0b0a06 100%)",
      }}
    >
      {/* Glow blobs */}
      <motion.div
        className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,158,255,0.1) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,128,31,0.1) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />
      <motion.div
        className="absolute top-[45%] left-[5%] w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(17,255,153,0.07) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.28, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Particles */}
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
                ? "rgba(59,158,255,0.7)"
                : p.id % 3 === 1
                  ? "rgba(255,128,31,0.6)"
                  : "rgba(17,255,153,0.5)",
          }}
          animate={{ y: [0, -25, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid */}
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

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated hotel showcase cards */}
          <div className="space-y-3 mb-8">
            {[
              {
                emoji: "🌊",
                name: "The Coral Nest",
                loc: "North Goa",
                price: "₹5,200",
                rating: "4.8",
                color: "#3b9eff",
              },
              {
                emoji: "🌿",
                name: "Misty Valley Resort",
                loc: "Munnar, Kerala",
                price: "₹3,800",
                rating: "4.7",
                color: "#11ff99",
              },
            ].map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[rgba(214,235,253,0.1)] bg-[rgba(255,255,255,0.03)]"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${h.color}15` }}
                >
                  {h.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-white truncate">
                    {h.name}
                  </div>
                  <div className="text-[10px] text-[#a1a4a5]">{h.loc}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] font-semibold text-white">
                    {h.price}
                  </div>
                  <div className="flex items-center gap-0.5 text-[#ffc53d] text-[9px]">
                    <Star size={8} fill="#ffc53d" /> {h.rating}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h2
            className="font-display text-4xl font-light text-white leading-tight mb-3"
            style={{ letterSpacing: "-0.5px" }}
          >
            Join 50,000+
            <br />
            <motion.em
              className="not-italic"
              style={{ color: "#3b9eff" }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              happy travellers
            </motion.em>
          </h2>

          <p className="text-[13px] text-[#a1a4a5] leading-relaxed mb-6 max-w-xs">
            Create your free account and unlock AI-powered search, instant
            booking, and personalised hotel recommendations.
          </p>

          {/* Benefits */}
          <div className="space-y-2.5">
            {[
              {
                icon: "✦",
                text: "Natural language hotel search",
                color: "#3b9eff",
              },
              { icon: "✦", text: "AI concierge 24/7", color: "#ff801f" },
              {
                icon: "✦",
                text: "Free cancellation on most stays",
                color: "#11ff99",
              },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2.5 text-[12px] text-[#a1a4a5]"
              >
                <span style={{ color: b.color }} className="text-sm">
                  {b.icon}
                </span>
                {b.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center gap-8"
      >
        {[
          ["500+", "Hotels"],
          ["120+", "Cities"],
          ["Free", "Sign Up"],
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

/* ─── Field component ────────────────────────────────────────────────── */
function Field({
  label,
  children,
  required: req,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
        {label}
        {req && <span className="text-[#ff2047] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl text-[13px] text-[#f0f0f0] outline-none placeholder-[#464a4d] transition-all duration-200";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(214,235,253,0.19)",
};
function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(59,158,255,0.6)";
}
function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(214,235,253,0.19)";
}

/* ─── Main Register Page ─────────────────────────────────────────────── */
export default function RegisterClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState(1);

  /*
   * All fields map 1:1 to backend controller:
   * { email, password, username, fullname, phoneNumber, address, city, state, pincode, role }
   */
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, [user]); // eslint-disable-line

  const up =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  /* Step validation */
  const step1Valid =
    form.fullname.trim() &&
    form.username.trim() &&
    form.email.includes("@") &&
    form.password.length >= 8;
  const step2Valid = form.phoneNumber.trim();
  const step3Valid =
    form.address.trim() &&
    form.city.trim() &&
    form.state &&
    form.pincode.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    /* role defaults to "Guest" on backend if not sent */
    // @ts-ignore
    await dispatch(registerUser({ ...form }));
  };

  const isLoading = status === "loading";

  const stepVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LeftPanel />

      {/* RIGHT — form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 xl:px-14 py-8 bg-black relative min-h-screen overflow-y-auto">
        {/* Glows */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(59,158,255,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(255,128,31,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
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
          className="w-full max-w-[420px] mx-auto"
        >
          {/* Heading */}
          <div className="mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-light text-white mb-1.5"
              style={{ letterSpacing: "-0.5px" }}
            >
              Create account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[13px] text-[#a1a4a5]"
            >
              Start exploring India&apos;s best hotels with AI-powered search.
            </motion.p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-7">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <motion.div
                  animate={{
                    background:
                      s.id < step
                        ? "#ff801f"
                        : s.id === step
                          ? "transparent"
                          : "transparent",
                    borderColor:
                      s.id <= step ? "#ff801f" : "rgba(214,235,253,0.19)",
                  }}
                  className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    color:
                      s.id < step
                        ? "black"
                        : s.id === step
                          ? "#ff801f"
                          : "#464a4d",
                  }}
                >
                  {s.id < step ? <Check size={11} /> : s.id}
                </motion.div>
                <div className="ml-1.5 flex-shrink-0">
                  <div
                    className={`text-[11px] font-medium ${s.id <= step ? "text-[#f0f0f0]" : "text-[#464a4d]"}`}
                  >
                    {s.label}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-2"
                    style={{
                      background:
                        s.id < step ? "#ff801f" : "rgba(214,235,253,0.15)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Account credentials ──────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Full Name" required>
                      <input
                        value={form.fullname}
                        onChange={up("fullname")}
                        required
                        placeholder="Rahul Sharma"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </Field>
                    <Field label="Username" required>
                      <input
                        value={form.username}
                        onChange={up("username")}
                        required
                        placeholder="rahuls92"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={up("email")}
                      required
                      placeholder="rahul@example.com"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </Field>

                  <Field label="Password" required>
                    <div className="relative">
                      <input
                        type={showPwd ? "text" : "password"}
                        value={form.password}
                        onChange={up("password")}
                        required
                        placeholder="••••••••"
                        className={`${inputClass} pr-12`}
                        style={inputStyle}
                        onFocus={(e) => {
                          setPwdFocus(true);
                          focusStyle(e);
                        }}
                        onBlur={(e) => {
                          setPwdFocus(false);
                          blurStyle(e);
                        }}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#464a4d] hover:text-[#a1a4a5] transition-colors"
                      >
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </motion.button>
                    </div>

                    {/* Password strength */}
                    <AnimatePresence>
                      {(pwdFocus || form.password) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex flex-col gap-1 overflow-hidden"
                        >
                          {PWD_RULES.map((r) => {
                            const ok = r.test(form.password);
                            return (
                              <div
                                key={r.label}
                                className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? "text-[#11ff99]" : "text-[#464a4d]"}`}
                              >
                                <motion.span
                                  animate={{
                                    scale: ok ? 1 : 0.8,
                                    opacity: ok ? 1 : 0.4,
                                  }}
                                >
                                  <Check size={10} />
                                </motion.span>
                                {r.label}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Field>

                  <motion.button
                    type="button"
                    onClick={() => step1Valid && setStep(2)}
                    disabled={!step1Valid}
                    whileHover={{ scale: step1Valid ? 1.02 : 1 }}
                    whileTap={{ scale: step1Valid ? 0.97 : 1 }}
                    className="w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 mt-1 transition-all"
                    style={{
                      background: step1Valid
                        ? "white"
                        : "rgba(255,255,255,0.08)",
                      color: step1Valid ? "black" : "#464a4d",
                      cursor: step1Valid ? "pointer" : "not-allowed",
                    }}
                  >
                    Continue <ArrowRight size={15} />
                  </motion.button>
                </motion.div>
              )}

              {/* ── STEP 2: Personal info ─────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4"
                >
                  <Field label="Phone Number" required>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={up("phoneNumber")}
                      required
                      placeholder="+91 98765 43210"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </Field>

                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(59,158,255,0.06)",
                      border: "1px solid rgba(59,158,255,0.15)",
                    }}
                  >
                    <span className="text-[#3b9eff] text-sm">ℹ</span>
                    <p className="text-[11px] text-[#a1a4a5]">
                      Your phone number is used for booking confirmations only.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-xl text-[13px] font-medium text-[#a1a4a5] hover:text-white transition-colors"
                      style={{ border: "1px solid rgba(214,235,253,0.19)" }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => step2Valid && setStep(3)}
                      disabled={!step2Valid}
                      whileHover={{ scale: step2Valid ? 1.02 : 1 }}
                      whileTap={{ scale: step2Valid ? 0.97 : 1 }}
                      className="flex-[2] py-3 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: step2Valid
                          ? "white"
                          : "rgba(255,255,255,0.08)",
                        color: step2Valid ? "black" : "#464a4d",
                        cursor: step2Valid ? "pointer" : "not-allowed",
                      }}
                    >
                      Continue <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Address ───────────────────────────────────── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4"
                >
                  <Field label="Street Address" required>
                    <input
                      value={form.address}
                      onChange={up("address")}
                      required
                      placeholder="123, MG Road, Apartment 4B"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City" required>
                      <input
                        value={form.city}
                        onChange={up("city")}
                        required
                        placeholder="Mumbai"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </Field>
                    <Field label="Pincode" required>
                      <input
                        value={form.pincode}
                        onChange={up("pincode")}
                        required
                        placeholder="400001"
                        maxLength={6}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </Field>
                  </div>

                  <Field label="State" required>
                    <select
                      value={form.state}
                      onChange={up("state")}
                      required
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    >
                      <option value="" style={{ background: "#0d0d0d" }}>
                        Select your state
                      </option>
                      {INDIAN_STATES.map((s) => (
                        <option
                          key={s}
                          value={s}
                          style={{ background: "#0d0d0d" }}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl overflow-hidden"
                        style={{
                          background: "rgba(255,32,71,0.08)",
                          border: "1px solid rgba(255,32,71,0.2)",
                        }}
                      >
                        <AlertCircle
                          size={14}
                          className="text-[#ff2047] flex-shrink-0"
                        />
                        <span className="text-[12px] text-[#ff2047]">
                          {error}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-1">
                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-xl text-[13px] font-medium text-[#a1a4a5] hover:text-white transition-colors"
                      style={{ border: "1px solid rgba(214,235,253,0.19)" }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={!step3Valid || isLoading}
                      whileHover={{
                        scale: step3Valid && !isLoading ? 1.02 : 1,
                      }}
                      whileTap={{ scale: step3Valid && !isLoading ? 0.97 : 1 }}
                      className="flex-[2] py-3 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{
                        background:
                          step3Valid && !isLoading
                            ? "white"
                            : "rgba(255,255,255,0.08)",
                        color: step3Valid && !isLoading ? "black" : "#464a4d",
                        cursor:
                          step3Valid && !isLoading ? "pointer" : "not-allowed",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />{" "}
                          Creating…
                        </>
                      ) : (
                        <>
                          Create Account <ArrowRight size={15} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="flex-1 h-px bg-[rgba(214,235,253,0.1)]" />
            <span className="text-[11px] text-[#464a4d]">
              already have one?
            </span>
            <div className="flex-1 h-px bg-[rgba(214,235,253,0.1)]" />
          </div>

          <p className="text-center text-[13px] text-[#a1a4a5]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#ff801f] hover:text-[#ffa057] font-medium transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
