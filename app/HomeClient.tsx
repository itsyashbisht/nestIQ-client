"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Star,
  MessageSquare,
  Map,
  ChevronRight,
  CalendarDays,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import type { IHotel } from "@/types/hotel";

// ─── Data ──────────────────────────────────────────────────────────────────

const MOCK_HOTELS: IHotel[] = [
  {
    _id: "1",
    name: "Rajputana Palace & Spa",
    slug: "rajputana-palace",
    description:
      "Royal Rajasthani heritage with modern luxury. Marble courtyards, rooftop dining under stars.",
    city: "Jaipur",
    state: "Rajasthan",
    address: "City Palace Road",
    category: "luxury",
    vibes: ["romantic"],
    amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
    images: [],
    pricePerNight: 8500,
    rating: 4.9,
    reviewCount: 312,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: [],
    createdAt: "",
    updatedAt: "",
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
    vibes: ["romantic", "wellness"],
    amenities: ["Pool", "Beach", "Restaurant"],
    images: [],
    pricePerNight: 5200,
    rating: 4.8,
    reviewCount: 198,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: [],
    createdAt: "",
    updatedAt: "",
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
    vibes: ["nature", "wellness"],
    amenities: ["Spa", "Restaurant", "Trekking"],
    images: [],
    pricePerNight: 3800,
    rating: 4.7,
    reviewCount: 245,
    isActive: true,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    nearbyAttractions: [],
    createdAt: "",
    updatedAt: "",
  },
];

const STATS = [
  { num: "500+", label: "Hotels" },
  { num: "50K+", label: "Guests" },
  { num: "120+", label: "Cities" },
  { num: "4.9★", label: "Rating" },
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
    icon: <Search size={15} />,
    color: "#3b9eff",
    bg: "rgba(59,158,255,0.14)",
    title: "Natural Language Search",
    desc: '"Romantic beach stay under ₹6000" — AI extracts city, vibe, and budget instantly.',
  },
  {
    icon: <MessageSquare size={15} />,
    color: "#11ff99",
    bg: "rgba(17,255,153,0.11)",
    title: "Hotel Chat Assistant",
    desc: "Ask anything about a property — amenities, pet policy, nearby restaurants.",
  },
  {
    icon: <Map size={15} />,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.14)",
    title: "Trip Budget Planner",
    desc: "AI plans a full cost breakdown — stay, food, travel, activities.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Search",
    desc: "Describe your stay in plain English. AI understands vibe, budget, location.",
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
    text: "The AI search is genuinely magical. Found the perfect place in seconds.",
    name: "Priya S.",
    loc: "Mumbai · Luxury stay",
    initials: "PS",
    color: "#ff801f",
  },
  {
    text: "Hotel chat answered every question — pool hours, pets, local restaurants.",
    name: "Arjun K.",
    loc: "Bangalore · Boutique stay",
    initials: "AK",
    color: "#3b9eff",
  },
  {
    text: "Budget planner nailed a 5-day Rajasthan trip within ₹40K for two.",
    name: "Neha R.",
    loc: "Delhi · Heritage trip",
    initials: "NR",
    color: "#11ff99",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTag({
  label,
  color = "orange",
}: {
  label: string;
  color?: "orange" | "blue";
}) {
  const styles =
    color === "blue"
      ? {
          color: "#3b9eff",
          border: "1px solid rgba(59,158,255,0.3)",
          background: "rgba(59,158,255,0.07)",
        }
      : {
          color: "#ff801f",
          border: "1px solid rgba(255,128,31,0.3)",
          background: "rgba(255,128,31,0.07)",
        };
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-[0.8px] px-3 py-1 rounded-full mb-4 sm:mb-5"
      style={styles}
    >
      {label}
    </span>
  );
}

// ─── Mobile Search Sheet ─────────────────────────────────────────────────────

function MobileSearchSheet({
  open,
  onClose,
  query,
  setQuery,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  checkIn: string;
  setCheckIn: (v: string) => void;
  checkOut: string;
  setCheckOut: (v: string) => void;
  guests: number;
  setGuests: (v: number) => void;
  onSearch: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(214,235,253,0.19)",
              borderBottom: "none",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[rgba(214,235,253,0.2)]" />
            </div>

            <div className="px-5 pb-8 pt-3 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl text-white">
                  Find Your Stay
                </h3>
                <button
                  onClick={onClose}
                  className="text-[#a1a4a5] hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Where */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                  Where to?
                </label>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)]">
                  <Search size={14} className="text-[#464a4d] flex-shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="romantic boutique hotel in Goa..."
                    className="flex-1 bg-transparent text-[14px] text-[#f0f0f0] placeholder-[#464a4d] outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                    <CalendarDays size={10} className="inline mr-1" />
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[#f0f0f0] outline-none"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-1.5">
                    <CalendarDays size={10} className="inline mr-1" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[#f0f0f0] outline-none"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                  <Users size={10} className="inline mr-1" />
                  Guests
                </label>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)] w-fit">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-base"
                  >
                    −
                  </motion.button>
                  <span className="text-[16px] font-medium text-white w-5 text-center">
                    {guests}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-base"
                  >
                    +
                  </motion.button>
                  <span className="text-[13px] text-[#a1a4a5]">
                    guest{guests > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Search button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onSearch();
                  onClose();
                }}
                className="w-full py-4 rounded-2xl bg-[#ff801f] text-black text-[15px] font-bold flex items-center justify-center gap-2"
              >
                <Search size={16} /> Search Hotels
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

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
  const [mobileSearch, setMobileSearch] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const hotels = featuredHotels.length > 0 ? featuredHotels : MOCK_HOTELS;
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    p.set("guests", String(guests));
    router.push(`/search?${p.toString()}`);
  };

  return (
    <div className="pt-[60px]">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 pb-16 sm:pb-20 overflow-hidden"
      >
        {/* Glows */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100vw)] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,128,31,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] pointer-events-none hidden sm:block"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,158,255,0.04) 0%, transparent 70%)",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex flex-col items-center text-center z-10 w-full max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] bg-[rgba(255,128,31,0.05)] mb-6 sm:mb-10"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#ff801f] flex-shrink-0"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] sm:text-[11px] font-medium text-[#a1a4a5] tracking-wide">
              Powered by Groq AI · Llama 3.1
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display font-light leading-none text-white mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(48px, 11vw, 108px)",
              letterSpacing: "clamp(-1px, -0.02em, -1.5px)",
              lineHeight: 1.0,
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

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="text-base sm:text-lg text-[#a1a4a5] max-w-[90%] sm:max-w-xl leading-relaxed mb-8 sm:mb-10 font-light px-2"
          >
            Natural language hotel search. Tell us what you want and AI finds
            the perfect match.
          </motion.p>

          {/* Mobile CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="flex items-center gap-3 mb-8 sm:mb-12"
          >
            <motion.button
              onClick={() => router.push("/search")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              Explore Hotels <ArrowRight size={13} />
            </motion.button>
            <motion.button
              onClick={() => router.push("/concierge")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] text-sm font-medium hover:bg-white/8 transition-all"
            >
              <Sparkles size={13} className="text-[#3b9eff]" /> AI Concierge
            </motion.button>
          </motion.div>

          {/* ── Desktop search bar (hidden on mobile) ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-3xl hidden md:block"
          >
            <div
              className="flex items-center gap-2 p-2 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.03)]"
              style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
            >
              <div className="flex-1 px-3 py-1">
                <div className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
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
              <div className="px-3 py-1 min-w-[118px]">
                <div className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Check in
                </div>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-[13px] text-[#f0f0f0] outline-none w-full"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="w-px h-10 bg-[rgba(214,235,253,0.19)]" />
              <div className="px-3 py-1 min-w-[118px]">
                <div className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Check out
                </div>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-[13px] text-[#f0f0f0] outline-none w-full"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="w-px h-10 bg-[rgba(214,235,253,0.19)]" />
              <div className="px-3 py-1 min-w-[80px]">
                <div className="text-[9px] font-semibold uppercase tracking-[0.8px] text-[#a1a4a5] mb-0.5">
                  Guests
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="text-[#a1a4a5] hover:text-white leading-none"
                  >
                    −
                  </button>
                  <span className="text-[13px] text-[#f0f0f0]">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="text-[#a1a4a5] hover:text-white leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
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

          {/* ── Mobile search trigger ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="md:hidden w-full max-w-sm px-2"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMobileSearch(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.04)] text-left"
              style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
            >
              <Search size={16} className="text-[#464a4d] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#464a4d] truncate">
                  Where to? Search hotels…
                </div>
              </div>
              <div className="flex-shrink-0 bg-[#ff801f] rounded-xl px-3 py-1.5 text-black text-[12px] font-bold">
                Search
              </div>
            </motion.button>
            <p className="text-center text-[10px] text-[#464a4d] mt-2.5">
              <span className="text-[#3b9eff]">✦ AI</span> — describe in plain
              English
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile search sheet */}
      <MobileSearchSheet
        open={mobileSearch}
        onClose={() => setMobileSearch(false)}
        query={query}
        setQuery={setQuery}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        onSearch={handleSearch}
      />

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <div className="border-t border-b border-[rgba(214,235,253,0.19)] py-5 sm:py-7">
        <div className="flex items-center justify-around sm:justify-center sm:gap-12 px-4 sm:px-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div className="font-display text-2xl sm:text-3xl font-semibold text-white leading-none">
                {s.num}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#a1a4a5] mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FEATURED HOTELS ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-10 sm:mb-14">
            <SectionTag label="Featured Properties" />
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight tracking-tight mb-3">
              Stays that{" "}
              <em className="not-italic text-[#a1a4a5]">leave a mark</em>
            </h2>
            <p className="text-[#a1a4a5] text-sm sm:text-base max-w-md">
              Hand-picked properties across India — from heritage havelis to
              modern urban retreats.
            </p>
          </div>
        </SectionReveal>

        {/* Hotel grid — responsive: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Featured card only shows on sm+ as col-span-2 */}
          {hotels[0] && (
            <div className="sm:col-span-2 lg:col-span-2">
              <HotelCard hotel={hotels[0]} variant="featured" index={0} />
            </div>
          )}
          {hotels[1] && (
            <HotelCard hotel={hotels[1]} variant="default" index={1} />
          )}
          {/* Third card — full width on mobile, shows in grid on larger */}
          {hotels[2] && (
            <div className="sm:col-span-2 lg:col-span-1">
              <HotelCard hotel={hotels[2]} variant="default" index={2} />
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/search">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-sm text-[#a1a4a5] border border-[rgba(214,235,253,0.19)] px-5 sm:px-6 py-2.5 rounded-full hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all cursor-pointer"
            >
              View all hotels <ChevronRight size={14} />
            </motion.span>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-12">
            <SectionTag label="Browse by Type" />
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white tracking-tight">
              Every kind of{" "}
              <em className="not-italic text-[#a1a4a5]">escape</em>
            </h2>
          </div>
        </SectionReveal>
        {/* 3 cols on mobile, 5 on lg */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3, borderColor: "rgba(255,128,31,0.5)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(`/search?category=${c.cat}`)}
              className="cursor-pointer text-center p-3 sm:p-5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,128,31,0.04)] transition-all"
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{c.icon}</div>
              <div className="text-[12px] sm:text-[13px] font-medium text-white mb-0.5">
                {c.name}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#a1a4a5] hidden sm:block">
                {c.count} hotels
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI SECTION ─────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24 px-4 sm:px-6"
        style={{
          background: "rgba(59,158,255,0.02)",
          borderTop: "1px solid rgba(59,158,255,0.1)",
          borderBottom: "1px solid rgba(59,158,255,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left text */}
          <SectionReveal>
            <SectionTag label="AI-Powered Search" color="blue" />
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white tracking-tight leading-tight mb-4">
              Search like you{" "}
              <em className="not-italic text-[#a1a4a5]">think</em>
            </h2>
            <p className="text-[#a1a4a5] text-sm sm:text-base mb-6 sm:mb-8">
              No more dropdown filters. Just describe what you want in plain
              English.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              {AI_FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)]"
                >
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white mb-0.5">
                      {f.title}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[#a1a4a5] leading-relaxed">
                      {f.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* Right — chat demo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[rgba(59,158,255,0.2)] overflow-hidden"
            style={{ background: "rgba(59,158,255,0.04)" }}
          >
            <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[rgba(59,158,255,0.15)]">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#3b9eff] flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[12px] sm:text-[13px] font-medium text-[#f0f0f0]">
                NestIQ AI Concierge
              </span>
              <span className="ml-auto text-[9px] sm:text-[10px] text-[#464a4d] font-mono hidden sm:block">
                Llama 3.1 · Groq
              </span>
            </div>
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              {[
                {
                  role: "user",
                  text: "Find me a romantic boutique hotel in Goa under ₹6000 with a pool",
                },
                {
                  role: "ai",
                  text: "✦ Found 8 perfect matches in North Goa.\n\nTop pick: The Coral Nest — beachfront boutique with infinity pool. ₹5,200/night.\n\nWant me to check availability?",
                },
                { role: "user", text: "Yes, Dec 20–23 for 2 guests" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.14 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[88%] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-line"
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
                className="flex gap-1.5 px-3 py-2.5 rounded-xl w-fit"
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

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-10 sm:mb-14">
            <SectionTag label="Simple Process" />
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white tracking-tight">
              Book in <em className="not-italic text-[#a1a4a5]">4 steps</em>
            </h2>
          </div>
        </SectionReveal>

        {/* Steps: 2-col on mobile, 4-col on lg */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl border border-[rgba(214,235,253,0.19)] overflow-hidden">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ background: "rgba(255,255,255,0.03)" }}
              className={`p-5 sm:p-7 bg-[rgba(255,255,255,0.01)] transition-colors
                ${i % 2 === 0 ? "border-r border-[rgba(214,235,253,0.19)]" : ""}
                ${i < 2 ? "border-b border-[rgba(214,235,253,0.19)] lg:border-b-0" : ""}
                lg:border-r lg:last:border-r-0`}
            >
              <div className="font-mono text-[9px] sm:text-[10px] text-[#ff801f] opacity-70 mb-4 sm:mb-5">
                {s.num}
              </div>
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{s.icon}</div>
              <div className="font-display text-[17px] sm:text-xl text-white mb-1.5 sm:mb-2">
                {s.title}
              </div>
              <div className="text-[11px] sm:text-[12px] text-[#a1a4a5] leading-relaxed">
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-6xl mx-auto mb-10 sm:mb-14">
            <SectionTag label="Guest Reviews" />
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white tracking-tight">
              Loved by <em className="not-italic text-[#a1a4a5]">travelers</em>
            </h2>
          </div>
        </SectionReveal>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="max-w-6xl mx-auto">
          <div
            className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x snap-mandatory md:snap-none"
            style={{ scrollbarWidth: "none" }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 sm:p-7 rounded-2xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.02)] snap-center flex-shrink-0 w-[82vw] sm:w-[60vw] md:w-auto"
              >
                <div className="text-[#ffc53d] text-sm mb-3 sm:mb-4">★★★★★</div>
                <p className="text-[12px] sm:text-[13px] text-[#a1a4a5] leading-relaxed italic mb-4 sm:mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-black text-[11px] font-bold flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-medium text-white">
                      {t.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#a1a4a5]">
                      {t.loc}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(255,128,31,0.07) 0%, transparent 70%)",
          }}
        />
        <SectionReveal>
          <SectionTag label="Start Today" />
          <h2
            className="font-display font-light text-white leading-none tracking-tight mb-4 sm:mb-5"
            style={{ fontSize: "clamp(40px, 8vw, 84px)" }}
          >
            Your perfect stay
            <br />
            <em className="not-italic text-[#ffa057]">awaits</em>
          </h2>
          <p className="text-[#a1a4a5] text-sm sm:text-base mb-8 sm:mb-10 max-w-sm sm:max-w-none mx-auto">
            Join 50,000+ travelers who found their ideal stay with NestIQ&apos;s
            AI-powered search.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-black text-sm font-semibold hover:opacity-85 transition-opacity cursor-pointer w-full sm:w-auto justify-center"
              >
                Create free account <ArrowRight size={14} />
              </motion.span>
            </Link>
            <Link href="/search">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] text-sm font-medium hover:bg-white/8 transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                Browse hotels →
              </motion.span>
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(214,235,253,0.19)] pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2">
            <div className="font-display text-2xl font-semibold mb-3">
              Nest<span style={{ color: "#ff801f" }}>IQ</span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#a1a4a5] leading-relaxed max-w-xs mb-4">
              AI-powered hotel discovery. Find your perfect stay with natural
              language search.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Groq AI", "Razorpay"].map((t) => (
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
              <h4 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.5px] text-white mb-3 sm:mb-4">
                {head}
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[12px] sm:text-[13px] text-[#a1a4a5] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto pt-6 sm:pt-8 border-t border-[rgba(214,235,253,0.19)] flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
          <p className="text-[10px] sm:text-[11px] text-[#464a4d]">
            © 2025 NestIQ. All rights reserved.
          </p>
          <span className="text-[9px] sm:text-[10px] text-[#464a4d] font-mono">
            v1.0.0 · MongoDB · Express · Next.js · Redux
          </span>
        </div>
      </footer>
    </div>
  );
}
