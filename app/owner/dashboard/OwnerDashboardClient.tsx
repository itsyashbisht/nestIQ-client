"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Hotel, CalendarDays,
  Star, DollarSign, Plus, Edit3, Eye, ToggleLeft,
  BarChart3, Users,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { formatPrice, formatDate } from "@/lib/utils";

const STATS = [
  { label: "Total Revenue", value: "₹4.2L", raw: 420000, change: +18, icon: DollarSign, color: "#11ff99" },
  { label: "Bookings", value: "142", raw: 142, change: +12, icon: CalendarDays, color: "#3b9eff" },
  { label: "Occupancy Rate", value: "78%", raw: 78, change: -3, icon: BarChart3, color: "#ffc53d" },
  { label: "Avg Rating", value: "4.8★", raw: 4.8, change: +0.1, icon: Star, color: "#ff801f" },
];

const MOCK_HOTELS = [
  { _id: "h1", name: "The Coral Nest", city: "North Goa", rooms: 12, occupancy: 85, revenue: 280000, rating: 4.8, status: "active", category: "boutique", emoji: "🌊" },
  { _id: "h2", name: "Misty Valley Resort", city: "Munnar", rooms: 18, occupancy: 62, revenue: 140000, rating: 4.6, status: "active", category: "comfort", emoji: "🌿" },
];

const MOCK_BOOKINGS = [
  { id: "b1", guest: "Rahul Sharma", hotel: "The Coral Nest", dates: "Dec 20–23", amount: 17472, status: "confirmed", rooms: "Ocean View" },
  { id: "b2", guest: "Anita Patel", hotel: "The Coral Nest", dates: "Dec 18–20", amount: 10400, status: "confirmed", rooms: "Ocean View" },
  { id: "b3", guest: "Vikram Nair", hotel: "Misty Valley Resort", dates: "Dec 12–15", amount: 11400, status: "pending", rooms: "Garden Suite" },
  { id: "b4", guest: "Priya Menon", hotel: "The Coral Nest", dates: "Nov 28–Dec 1", amount: 26400, status: "completed", rooms: "Coral Suite" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  confirmed: { color: "#11ff99", bg: "rgba(17,255,153,0.1)", border: "rgba(17,255,153,0.25)" },
  pending:   { color: "#ffc53d", bg: "rgba(255,197,61,0.1)", border: "rgba(255,197,61,0.25)" },
  completed: { color: "#3b9eff", bg: "rgba(59,158,255,0.1)", border: "rgba(59,158,255,0.25)" },
  cancelled: { color: "#ff2047", bg: "rgba(255,32,71,0.1)",  border: "rgba(255,32,71,0.25)"  },
};

function StatCard({ stat, i }: { stat: typeof STATS[0]; i: number }) {
  const Icon = stat.icon;
  const isPos = stat.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }}
      className="rounded-xl border border-[rgba(214,235,253,0.19)] p-5 bg-[rgba(255,255,255,0.02)]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5]">{stat.label}</div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
          <Icon size={14} />
        </div>
      </div>
      <div className="font-display text-3xl text-white leading-none mb-2">{stat.value}</div>
      <div className={`flex items-center gap-1 text-[12px] ${isPos ? "text-[#11ff99]" : "text-[#ff2047]"}`}>
        {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {isPos ? "+" : ""}{stat.change}{typeof stat.change === "number" && Math.abs(stat.change) < 10 ? "%" : "% this month"}
      </div>
    </motion.div>
  );
}

export default function OwnerDashboardClient() {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((s) => s.auth);
  const [activeSection, setActiveSection] = useState<"overview" | "hotels" | "bookings">("overview");

  useEffect(() => {
    if (isInitialized && !user) { router.push("/login"); return; }
    if (isInitialized && user && user.role === "USER") { router.push("/profile"); }
  }, [user, isInitialized]);

  return (
    <div className="pt-[60px] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-5xl font-light text-white mb-1">Dashboard</h1>
            <p className="text-[#a1a4a5] text-sm">Manage your properties and track revenue</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-[13px] text-[#f0f0f0] border border-[rgba(214,235,253,0.19)] px-4 py-2 rounded-full hover:bg-white/8 transition-colors"
            >
              <BarChart3 size={13} /> Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-[13px] font-semibold text-black bg-white px-4 py-2 rounded-full hover:opacity-85 transition-opacity"
            >
              <Plus size={13} /> Add Hotel
            </motion.button>
          </div>
        </motion.div>

        {/* Section tabs */}
        <div className="flex gap-0 rounded-xl border border-[rgba(214,235,253,0.19)] mb-8 overflow-hidden w-fit">
          {(["overview", "hotels", "bookings"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-5 py-2.5 text-[12px] font-medium capitalize border-r border-[rgba(214,235,253,0.19)] last:border-r-0 transition-all ${
                activeSection === s ? "bg-white/6 text-[#f0f0f0]" : "text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/4"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} i={i} />)}
        </div>

        {/* My Properties */}
        {(activeSection === "overview" || activeSection === "hotels") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-white">My Properties</h2>
              <span className="text-[12px] text-[#a1a4a5]">{MOCK_HOTELS.length} properties</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_HOTELS.map((hotel, i) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="rounded-xl border border-[rgba(214,235,253,0.19)] p-5 bg-[rgba(255,255,255,0.02)] flex gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#0d0d0d] flex items-center justify-center text-3xl flex-shrink-0">
                    {hotel.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="text-[14px] font-medium text-white">{hotel.name}</div>
                        <div className="text-[12px] text-[#a1a4a5]">{hotel.city} · {hotel.rooms} rooms</div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] px-2 py-1 rounded-full text-[#11ff99] bg-[rgba(17,255,153,0.1)] border border-[rgba(17,255,153,0.2)]">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[12px] text-[#a1a4a5]">
                      <span>Occupancy: <span className="text-white">{hotel.occupancy}%</span></span>
                      <span className="flex items-center gap-1"><Star size={10} className="text-[#ffc53d]" /> {hotel.rating}</span>
                      <span>{formatPrice(hotel.revenue)}/mo</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all"
                      >
                        <Edit3 size={10} /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all"
                      >
                        <Hotel size={10} /> Rooms
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => router.push(`/hotels/${hotel._id}`)}
                        className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white hover:border-[rgba(214,235,253,0.4)] transition-all"
                      >
                        <Eye size={10} /> Preview
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add hotel card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ borderColor: "rgba(255,128,31,0.4)", background: "rgba(255,128,31,0.03)" }}
                className="rounded-xl border border-dashed border-[rgba(214,235,253,0.19)] p-5 flex items-center justify-center cursor-pointer transition-all min-h-[120px]"
              >
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,128,31,0.1)] border border-[rgba(255,128,31,0.2)] flex items-center justify-center mx-auto mb-2">
                    <Plus size={16} className="text-[#ff801f]" />
                  </div>
                  <div className="text-[13px] text-[#a1a4a5]">Add New Property</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Recent Bookings */}
        {(activeSection === "overview" || activeSection === "bookings") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-white">Recent Bookings</h2>
              <span className="text-[12px] text-[#a1a4a5]">{MOCK_BOOKINGS.length} recent</span>
            </div>
            <div className="rounded-2xl border border-[rgba(214,235,253,0.19)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)]">
                {["Guest", "Hotel", "Dates", "Amount", "Status"].map((h) => (
                  <div key={h} className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a1a4a5]">{h}</div>
                ))}
              </div>
              {/* Rows */}
              {MOCK_BOOKINGS.map((b, i) => {
                const s = STATUS_STYLE[b.status] ?? STATUS_STYLE.pending;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 border-b border-[rgba(214,235,253,0.06)] last:border-b-0 items-center hover:bg-white/2 transition-colors"
                  >
                    <div className="text-[13px] font-medium text-white truncate">{b.guest}</div>
                    <div className="text-[13px] text-[#a1a4a5] truncate">{b.hotel}</div>
                    <div className="text-[12px] text-[#a1a4a5]">{b.dates}</div>
                    <div className="font-display text-base text-white">{formatPrice(b.amount)}</div>
                    <div
                      className="text-[10px] font-semibold uppercase tracking-[0.5px] px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                    >
                      {b.status}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
