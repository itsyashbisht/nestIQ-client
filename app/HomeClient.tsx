"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Map,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import type { IHotel } from "@/types/hotel";

const MOCK_HOTELS: IHotel[] = [
  {
    _id: "1",
    name: "Rajputana Palace & Spa",
    slug: "rajputana-palace",
    description:
      "Experience royal Rajasthani heritage with modern luxury. Marble courtyards, rooftop dining under stars.",
    city: "Jaipur",
    state: "Rajasthan",
    address: "City Palace Road",
    category: "luxury",
    vibes: ["romantic", "heritage", "spa"],
    amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
    images: [],
    pricePerNight: 8500,
    rating: 4.9,
    reviewCount: 312,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: ["Amber Fort"],
    createdAt: "",
    updatedAt: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    ownerId: "",
  },
  {
    _id: "2",
    name: "The Coral Nest",
    slug: "coral-nest",
    description:
      "Beachfront boutique on Calangute shores. Infinity pool, candlelit dinners.",
    city: "North Goa",
    state: "Goa",
    address: "Calangute Beach Road",
    category: "boutique",
    vibes: ["romantic", "beachfront", "pool"],
    amenities: ["Pool", "Beach", "Restaurant"],
    images: [],
    pricePerNight: 5200,
    rating: 4.8,
    reviewCount: 198,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: ["Calangute Beach"],
    createdAt: "",
    updatedAt: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    ownerId: "",
  },
  {
    _id: "3",
    name: "Misty Valley Resort",
    slug: "misty-valley",
    description:
      "Nestled in tea gardens of Munnar. Wake up to mist-covered hills.",
    city: "Munnar",
    state: "Kerala",
    address: "Tea Garden Road",
    category: "comfort",
    vibes: ["nature", "wellness", "family"],
    amenities: ["Spa", "Restaurant", "Trekking"],
    images: [],
    pricePerNight: 3800,
    rating: 4.7,
    reviewCount: 245,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: ["Eravikulam NP"],
    createdAt: "",
    updatedAt: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    ownerId: "",
  },
];

const STATS = [
  { num: "500+", label: "Curated Hotels" },
  { num: "50K+", label: "Happy Guests" },
  { num: "120+", label: "Cities" },
  { num: "4.9★", label: "Avg Rating" },
  { num: "24/7", label: "AI Concierge" },
];

const CATEGORIES = [
  { icon: "💎", name: "Luxury", count: 42, cat: "luxury" },
  { icon: "🏡", name: "Boutique", count: 87, cat: "boutique" },
  { icon: "🎒", name: "Budget", count: 156, cat: "budget" },
  { icon: "🛋️", name: "Comfort", count: 112, cat: "comfort" },
  { icon: "🏛️", name: "Heritage", count: 34, cat: "luxury" },
];

const AI_FEATURES = [
  {
    icon: <Search size={16} />,
    color: "#3b9eff",
    bg: "rgba(59,158,255,0.15)",
    title: "Natural Language Search",
    desc: 'Type anything — "romantic beach stay under ₹6000" — and AI extracts city, vibe, and budget instantly.',
  },
  {
    icon: <MessageSquare size={16} />,
    color: "#11ff99",
    bg: "rgba(17,255,153,0.12)",
    title: "Hotel Chat Assistant",
    desc: "Ask anything about a property — amenities, nearby places, pet policy — and get instant AI-powered answers.",
  },
  {
    icon: <Map size={16} />,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.15)",
    title: "Trip Budget Planner",
    desc: "Tell us your destination. AI plans a complete budget breakdown — stay, food, travel, activities.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Search",
    desc: "Describe your stay in natural language. AI understands vibe, budget, and location.",
  },
  {
    num: "02",
    icon: "🏨",
    title: "Choose",
    desc: "Browse AI-curated results. Chat with hotel AI for real-time answers.",
  },
  {
    num: "03",
    icon: "📅",
    title: "Reserve",
    desc: "Pick room, dates, special requests. Done in under 60 seconds.",
  },
  {
    num: "04",
    icon: "💳",
    title: "Pay",
    desc: "Secure Razorpay. UPI, cards, netbanking. Instant confirmation.",
  },
];

const TESTIMONIALS = [
  {
    text: "The AI search is genuinely magical. Typed exactly what I wanted and it found the perfect place in seconds.",
    name: "Priya S.",
    loc: "Mumbai · Luxury stay",
    initials: "PS",
    color: "#ff801f",
  },
  {
    text: "The hotel chat assistant answered every question — pool hours, pets, local restaurants. Incredible service.",
    name: "Arjun K.",
    loc: "Bangalore · Boutique stay",
    initials: "AK",
    color: "#3b9eff",
  },
  {
    text: "Budget planner helped me plan a 5-day Rajasthan trip within ₹40K for two. Absolutely remarkable.",
    name: "Neha R.",
    loc: "Delhi · Heritage trip",
    initials: "NR",
    color: "#11ff99",
  },
];

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({
  featuredHotels,
}: {
  featuredHotels: IHotel[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const hotels = featuredHotels.length > 0 ? featuredHotels : MOCK_HOTELS;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="pt-[60px]">
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-20 overflow-hidden"
      >
        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,128,31,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,158,255,0.04) 0%, transparent 70%)",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex flex-col items-center text-center z-10 max-w-5xl w-full"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] bg-[rgba(255,128,31,0.05)] mb-10"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#ff801f]"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] font-medium text-[#a1a4a5] tracking-wide">
              Powered by Groq AI · Llama 3.1
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light leading-none tracking-tight text-white mb-6"
            style={{
              fontSize: "clamp(56px, 9vw, 108px)",
              letterSpacing: "-1.5px",
            }}
          >
            Find where
            <br />
            <motion.em
              className="not-italic"
              style={{ color: "#ffa057" }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              you belong
            </motion.em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-[#a1a4a5] max-w-xl leading-relaxed mb-10 font-light"
          >
            Natural language hotel search. Tell us what you want — romantic stay
            in Goa, budget hostel in Jaipur — and AI finds the perfect match.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center gap-3 mb-12"
          >
            <motion.button
              onClick={() => router.push("/search")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              Explore Hotels <ArrowRight size={14} />
            </motion.button>
            <motion.button
              onClick={() => router.push("/concierge")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] text-sm font-medium hover:bg-white/8 transition-all"
            >
              <Sparkles size={14} className="text-[#3b9eff]" /> Ask AI Concierge
            </motion.button>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-3xl"
          >
            <div
              className="flex items-center gap-2 p-2 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.03)]"
              style={{ boxShadow: "rgba(176,199,217,0.145) 0px 0px 0px 1px" }}
            >
              {/* Query */}
              <div className="flex-1 px-3 py-1">
                <div className="text-[9px] font-medium uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Where to?
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="romantic boutique hotel in Goa..."
                  className="w-full bg-transparent text-[13px] text-[#f0f0f0] placeholder-[#464a4d] outline-none"
                />
              </div>
              <div className="w-px h-10 bg-[rgba(214,235,253,0.19)]" />
              {/* Check-in */}
              <div className="px-3 py-1 min-w-[120px]">
                <div className="text-[9px] font-medium uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Check in
                </div>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-[13px] text-[#f0f0f0] outline-none w-full"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="w-px h-10 bg-[rgba(214,235,253,0.19)]" />
              {/* Check-out */}
              <div className="px-3 py-1 min-w-[120px]">
                <div className="text-[9px] font-medium uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Check out
                </div>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-[13px] text-[#f0f0f0] outline-none w-full"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="w-px h-10 bg-[rgba(214,235,253,0.19)]" />
              {/* Guests */}
              <div className="px-3 py-1 min-w-[80px]">
                <div className="text-[9px] font-medium uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Guests
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="text-[#a1a4a5] hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-[13px] text-[#f0f0f0]">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="text-[#a1a4a5] hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Search btn */}
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ff801f] text-black text-[13px] font-semibold hover:opacity-85 transition-opacity flex-shrink-0"
              >
                <Search size={14} /> Search
              </motion.button>
            </div>
            <p className="text-center text-[11px] text-[#464a4d] mt-3">
              <span className="text-[#3b9eff] font-medium">✦ AI</span>{" "}
              understands natural language — try &ldquo;hidden gem with pool
              under ₹5000&rdquo;
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <div className="border-t border-b border-[rgba(214,235,253,0.19)] py-7 overflow-x-auto">
        <div className="flex items-center justify-center gap-10 min-w-max mx-auto px-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="text-center flex-shrink-0"
            >
              <div className="font-display text-3xl font-semibold text-white leading-none">
                {s.num}
              </div>
              <div className="text-[11px] text-[#a1a4a5] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── FEATURED HOTELS ─── */}
      <section className="py-24 px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-14">
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#ff801f] border border-[rgba(255,128,31,0.3)] bg-[rgba(255,128,31,0.07)] px-3 py-1 rounded-full mb-5">
              Featured Properties
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight tracking-tight mb-3">
              Stays that{" "}
              <em className="not-italic text-[#a1a4a5]">leave a mark</em>
            </h2>
            <p className="text-[#a1a4a5] text-base max-w-md">
              Hand-picked properties across India — from heritage havelis to
              modern urban retreats.
            </p>
          </div>
        </SectionReveal>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels[0] && (
            <HotelCard hotel={hotels[0]} variant="featured" index={0} />
          )}
          {hotels.slice(1, 3).map((h, i) => (
            <HotelCard key={h._id} hotel={h} variant="default" index={i + 1} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/search">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-sm text-[#a1a4a5] border border-[rgba(214,235,253,0.19)] px-6 py-2.5 rounded-full hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all cursor-pointer"
            >
              View all hotels <ChevronRight size={14} />
            </motion.span>
          </Link>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto text-center mb-12">
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#ff801f] border border-[rgba(255,128,31,0.3)] bg-[rgba(255,128,31,0.07)] px-3 py-1 rounded-full mb-5">
              Browse by Type
            </span>
            <h2 className="font-display text-5xl font-light text-white tracking-tight">
              Every kind of{" "}
              <em className="not-italic text-[#a1a4a5]">escape</em>
            </h2>
          </div>
        </SectionReveal>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: "rgba(255,128,31,0.6)" }}
              onClick={() => router.push(`/search?category=${c.cat}`)}
              className="cursor-pointer text-center p-6 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,128,31,0.04)] transition-all"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-[13px] font-medium text-white mb-1">
                {c.name}
              </div>
              <div className="text-[11px] text-[#a1a4a5]">{c.count} hotels</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── AI SECTION ─── */}
      <section
        className="py-24 px-6"
        style={{
          background: "rgba(59,158,255,0.02)",
          borderTop: "1px solid rgba(59,158,255,0.1)",
          borderBottom: "1px solid rgba(59,158,255,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SectionReveal>
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#3b9eff] border border-[rgba(59,158,255,0.3)] bg-[rgba(59,158,255,0.07)] px-3 py-1 rounded-full mb-5">
              AI-Powered Search
            </span>
            <h2 className="font-display text-5xl font-light text-white tracking-tight leading-tight mb-4">
              Search like you{" "}
              <em className="not-italic text-[#a1a4a5]">think</em>
            </h2>
            <p className="text-[#a1a4a5] text-base mb-8">
              No more dropdown filters. Just describe what you want in plain
              English.
            </p>
            <div className="flex flex-col gap-4">
              {AI_FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)]"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white mb-1">
                      {f.title}
                    </div>
                    <div className="text-[12px] text-[#a1a4a5] leading-relaxed">
                      {f.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* Chat demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[rgba(59,158,255,0.2)] overflow-hidden"
            style={{ background: "rgba(59,158,255,0.04)" }}
          >
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[rgba(59,158,255,0.15)]">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#3b9eff]"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[13px] font-medium text-[#f0f0f0]">
                NestIQ AI Concierge
              </span>
              <span className="ml-auto text-[10px] text-[#464a4d] font-mono">
                Llama 3.1 · Groq
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {[
                {
                  role: "user",
                  text: "Find me a romantic boutique hotel in Goa under ₹6000 with a pool",
                },
                {
                  role: "ai",
                  text: "✦ Found 8 perfect matches in North Goa.\n\nTop pick: The Coral Nest — beachfront boutique with infinity pool, candlelit dinners. ₹5,200/night.\n\nWant me to check availability for your dates?",
                },
                { role: "user", text: "Yes, Dec 20–23 for 2 guests" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-line"
                    style={
                      m.role === "user"
                        ? {
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(214,235,253,0.19)",
                            color: "#f0f0f0",
                          }
                        : {
                            background: "rgba(59,158,255,0.1)",
                            border: "1px solid rgba(59,158,255,0.25)",
                            color: "#f0f0f0",
                          }
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              <div
                className="flex gap-1.5 px-3.5 py-3 rounded-xl w-fit"
                style={{
                  background: "rgba(59,158,255,0.1)",
                  border: "1px solid rgba(59,158,255,0.2)",
                }}
              >
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-14">
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#ff801f] border border-[rgba(255,128,31,0.3)] bg-[rgba(255,128,31,0.07)] px-3 py-1 rounded-full mb-5">
              Simple Process
            </span>
            <h2 className="font-display text-5xl font-light text-white tracking-tight">
              Book in <em className="not-italic text-[#a1a4a5]">4 steps</em>
            </h2>
          </div>
        </SectionReveal>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl border border-[rgba(214,235,253,0.19)] overflow-hidden">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ background: "rgba(255,255,255,0.03)" }}
              className="p-7 border-r border-[rgba(214,235,253,0.19)] last:border-r-0 bg-[rgba(255,255,255,0.01)] transition-colors"
            >
              <div className="font-mono text-[10px] text-[#ff801f] opacity-70 mb-5">
                {s.num}
              </div>
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="font-display text-xl text-white mb-2">
                {s.title}
              </div>
              <div className="text-[12px] text-[#a1a4a5] leading-relaxed">
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-14">
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#ff801f] border border-[rgba(255,128,31,0.3)] bg-[rgba(255,128,31,0.07)] px-3 py-1 rounded-full mb-5">
              Guest Reviews
            </span>
            <h2 className="font-display text-5xl font-light text-white tracking-tight">
              Loved by <em className="not-italic text-[#a1a4a5]">travelers</em>
            </h2>
          </div>
        </SectionReveal>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)]"
            >
              <div className="text-[#ffc53d] text-sm mb-4">★★★★★</div>
              <p className="text-[13px] text-[#a1a4a5] leading-relaxed italic mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-[#a1a4a5]">{t.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(255,128,31,0.06) 0%, transparent 70%)",
          }}
        />
        <SectionReveal>
          <span className="inline-block text-[10px] font-medium uppercase tracking-[0.8px] text-[#ff801f] border border-[rgba(255,128,31,0.3)] bg-[rgba(255,128,31,0.07)] px-3 py-1 rounded-full mb-6">
            Start Today
          </span>
          <h2
            className="font-display font-light text-white leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(48px, 7vw, 84px)" }}
          >
            Your perfect stay
            <br />
            <em className="not-italic text-[#ffa057]">awaits</em>
          </h2>
          <p className="text-[#a1a4a5] text-base mb-10">
            Join 50,000+ travelers who found their ideal stay with NestIQ&apos;s
            AI-powered search.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-semibold hover:opacity-85 transition-opacity cursor-pointer"
              >
                Create free account <ArrowRight size={14} />
              </motion.span>
            </Link>
            <Link href="/search">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] text-sm font-medium hover:bg-white/8 transition-all cursor-pointer"
              >
                Browse hotels →
              </motion.span>
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[rgba(214,235,253,0.19)] pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-semibold mb-3">
              Nest<span style={{ color: "#ff801f" }}>IQ</span>
            </div>
            <p className="text-[13px] text-[#a1a4a5] leading-relaxed max-w-xs mb-4">
              AI-powered hotel discovery. Find your perfect stay with natural
              language search and intelligent recommendations.
            </p>
            <div className="flex gap-2">
              {["Next.js 16", "Groq AI", "Razorpay"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-2 py-1 rounded border border-[rgba(214,235,253,0.19)] text-[#a1a4a5]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {[
            {
              head: "Explore",
              links: [
                ["Search Hotels", "/search"],
                ["AI Concierge", "/concierge"],
                ["My Bookings", "/bookings"],
              ],
            },
            {
              head: "Company",
              links: [
                ["About NestIQ", "/"],
                ["Privacy Policy", "/"],
                ["Support", "/"],
              ],
            },
          ].map(({ head, links }) => (
            <div key={head}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-white mb-4">
                {head}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-[#a1a4a5] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-[rgba(214,235,253,0.19)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-[#464a4d]">
            © 2025 NestIQ. All rights reserved.
          </p>
          <span className="text-[10px] text-[#464a4d] font-mono">
            v1.0.0 · MongoDB · Express · Next.js · Redux
          </span>
        </div>
      </footer>
    </div>
  );
}
