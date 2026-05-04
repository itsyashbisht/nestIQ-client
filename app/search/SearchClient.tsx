"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { getAllHotels } from "@/thunks/hotel.thunk";
import { aiSearch } from "@/thunks/ai.thunk";
import HotelCard from "@/components/HotelCard";

const CATEGORIES = ["budget", "comfort", "luxury", "boutique"] as const;
const VIBES = [
  "romantic",
  "family",
  "adventure",
  "business",
  "solo",
  "wellness",
] as const;
const SORT_OPTIONS = [
  "Best Match",
  "Price: Low -> High",
  "Price: High -> Low",
  "Rating: Highest",
];

function SkeletonCard({ i }: { i: number }) {
  return (
    <div className="rounded-2xl border border-[rgba(214,235,253,0.19)] overflow-hidden">
      <motion.div
        className="aspect-[4/3] bg-[#0d0d0d]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
      />
      <div className="p-4 flex flex-col gap-2">
        <motion.div
          className="h-4 bg-[#0d0d0d] rounded w-3/4"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
        <motion.div
          className="h-3 bg-[#0d0d0d] rounded w-1/2"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      </div>
    </div>
  );
}

export default function SearchClient() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { hotels, searchStatus, status, aiInsight } = useAppSelector(
    (s) => s.hotel,
  );

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selCats, setSelCats] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : [],
  );
  const [selVibes, setSelVibes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minGuests, setMinGuests] = useState(1);
  const [sort, setSort] = useState("Best Match");

  const isLoading = searchStatus === "loading" || status === "loading";

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) {
      setQuery(q);
      dispatch(aiSearch(q));
    } else if (cat) {
      setSelCats([cat]);
      dispatch(getAllHotels({ category: cat, limit: 12 }));
    } else {
      dispatch(getAllHotels({ limit: 12 }));
    }
  }, []); // eslint-disable-line

  const handleSearch = () => {
    if (query.trim()) dispatch(aiSearch(query));
    else
      dispatch(
        getAllHotels({ ...(selCats[0] ? { category: selCats[0] } : {}) }),
      );
  };

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = hotels
    .filter((h) => selCats.length === 0 || selCats.includes(h.category))
    .filter(
      (h) => selVibes.length === 0 || h.vibes.some((v) => selVibes.includes(v)),
    )
    .filter((h) => h.startingFrom <= maxPrice);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low -> High") return a.startingFrom - b.startingFrom;
    if (sort === "Price: High -> Low") return b.startingFrom - a.startingFrom;
    if (sort === "Rating: Highest") return b.rating - a.rating;
    return 0;
  });

  const activeFilterCount =
    selCats.length +
    selVibes.length +
    (maxPrice < 20000 ? 1 : 0) +
    (minGuests > 1 ? 1 : 0);

  return (
    <div className="pt-[60px] min-h-screen">
      {/* ── Sticky search bar ──────────────────────────────────────── */}
      <div className="sticky top-[60px] z-30 bg-black/92 backdrop-blur-xl border-b border-[rgba(214,235,253,0.15)] px-3 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto">
          {/* Search row */}
          <div className="flex gap-2 sm:gap-3">
            {/* Input */}
            <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.03)] focus-within:border-[rgba(214,235,253,0.45)] transition-colors">
              <Search size={13} className="text-[#a1a4a5] flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder='e.g. "romantic stay in Goa under ₹6000"'
                className="flex-1 min-w-0 bg-transparent text-[13px] sm:text-[14px] text-[#f0f0f0] placeholder-[#3b3f45] outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[#464a4d] hover:text-[#a1a4a5] flex-shrink-0"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filters toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.03)] text-[12px] sm:text-[13px] font-medium text-[#f0f0f0] hover:bg-white/8 transition-colors flex-shrink-0"
            >
              <SlidersHorizontal size={12} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#ff801f] text-black text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            {/* Search btn */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-white text-black text-[12px] sm:text-[13px] font-semibold hover:opacity-85 transition-opacity flex-shrink-0"
            >
              <Search size={14} className="sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {/* Category */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                      Category
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggle(selCats, c, setSelCats)}
                          className={`text-[11px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border capitalize transition-all ${
                            selCats.includes(c)
                              ? "border-[#ff801f] bg-[rgba(255,128,31,0.12)] text-[#ff801f]"
                              : "border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[rgba(214,235,253,0.4)]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibes */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                      Vibe
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {VIBES.map((v) => (
                        <button
                          key={v}
                          onClick={() => toggle(selVibes, v, setSelVibes)}
                          className={`text-[11px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border capitalize transition-all ${
                            selVibes.includes(v)
                              ? "border-[#3b9eff] bg-[rgba(59,158,255,0.12)] text-[#3b9eff]"
                              : "border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[rgba(214,235,253,0.4)]"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                      Max Price:{" "}
                      <span className="text-white">
                        ₹{maxPrice.toLocaleString("en-IN")}
                      </span>
                      /night
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={20000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-0.5 appearance-none bg-[rgba(214,235,253,0.19)] rounded-full cursor-pointer accent-[#ff801f]"
                    />
                    <div className="flex justify-between text-[10px] text-[#464a4d] mt-1">
                      <span>₹500</span>
                      <span>₹20,000</span>
                    </div>
                  </div>

                  {/* Min guests */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#a1a4a5] mb-2">
                      Min Guests
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <button
                        onClick={() => setMinGuests(Math.max(1, minGuests - 1))}
                        className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-sm"
                      >
                        −
                      </button>
                      <span className="text-[14px] text-white w-4 text-center">
                        {minGuests}
                      </span>
                      <button
                        onClick={() =>
                          setMinGuests(Math.min(10, minGuests + 1))
                        }
                        className="w-7 h-7 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:text-white flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <span className="text-[11px] text-[#a1a4a5]">
                        guest{minGuests > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSelCats([]);
                      setSelVibes([]);
                      setMaxPrice(20000);
                      setMinGuests(1);
                    }}
                    className="mt-3 text-[11px] text-[#ff2047] hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── AI insight banner ────────────────────────────────────────── */}
      <AnimatePresence>
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-3 sm:px-6 pt-4 sm:pt-5 max-w-6xl mx-auto"
          >
            <div className="flex items-start gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[rgba(59,158,255,0.2)] bg-[rgba(59,158,255,0.05)]">
              <Sparkles
                size={14}
                className="text-[#3b9eff] mt-0.5 flex-shrink-0"
              />
              <p className="text-[12px] sm:text-[13px] text-[#a1a4a5] leading-relaxed">
                <span className="text-[#3b9eff] font-medium">
                  AI understood:{" "}
                </span>
                {aiInsight}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 py-5 sm:py-8 max-w-6xl mx-auto">
        {/* Count + sort row */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="text-[12px] sm:text-[13px] text-[#a1a4a5]">
            {isLoading ? (
              <motion.span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⟳
                </motion.span>
                Searching…
              </motion.span>
            ) : (
              <span>
                <span className="text-white font-medium">{sorted.length}</span>{" "}
                hotels found
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[11px] sm:text-[12px] text-[#f0f0f0] px-2.5 sm:px-3 py-1.5 sm:py-2 pr-6 sm:pr-7 outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o} style={{ background: "#0d0d0d" }}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[#a1a4a5] pointer-events-none"
            />
          </div>
        </div>

        {/* Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} i={i} />
            ))}
          </div>
        )}

        {/* Hotel grid */}
        {!isLoading && sorted.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {sorted.map((hotel, i) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                variant="default"
                index={i}
                lowestRoomPrice={hotel?.startingFrom}
              />
            ))}
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-24"
          >
            <div className="text-4xl sm:text-5xl mb-4">🔍</div>
            <div className="text-[#a1a4a5] text-sm sm:text-base mb-2">
              No hotels match your filters
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#464a4d] mb-5">
              Try adjusting price, category, or search query
            </div>
            <button
              onClick={() => {
                setSelCats([]);
                setSelVibes([]);
                setMaxPrice(20000);
                setQuery("");
                dispatch(getAllHotels({ limit: 12 }));
              }}
              className="text-[12px] sm:text-[13px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#f0f0f0] hover:bg-white/8 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
