"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BotMessageSquare,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { logoutUser } from "@/thunks/auth.thunk";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/search", label: "Explore", icon: Search },
  { href: "/concierge", label: "AI Concierge", icon: BotMessageSquare },
  { href: "/bookings", label: "My Bookings", icon: CalendarDays },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "border-b border-frost",
          scrolled
            ? "bg-black/90 backdrop-blur-xl"
            : "bg-black/60 backdrop-blur-md",
        )}
      >
        <div className="max-w-350 mx-auto px-6 h-15 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <motion.span
              className="font-display text-2xl font-semibold tracking-tight"
              style={{ color: "#f0f0f0" }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Nest
              <span style={{ color: "#ff801f" }}>IQ</span>
            </motion.span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 text-[13px] font-medium tracking-[0.3px] transition-colors duration-200",
                    active
                      ? "text-[#f0f0f0]"
                      : "text-[#a1a4a5] hover:text-[#f0f0f0]",
                  )}
                >
                  <Icon size={13} strokeWidth={2} />
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#ff801f]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[13px] font-medium text-[#f0f0f0] hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#ff801f] flex items-center justify-center text-black text-[11px] font-bold">
                    {user.fullname?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  {user.fullname?.split(" ")[0]}
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[#0d0d0d] overflow-hidden z-50"
                      style={{ boxShadow: "rgba(176,199,217,0.145) 0 0 0 1px" }}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
                      >
                        <User size={14} />
                        Profile
                      </Link>
                      {user.role === "Owner" || user.role === "Admin" ? (
                        <Link
                          href="/owner/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors border-t border-[rgba(214,235,253,0.1)]"
                        >
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      ) : null}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-red hover:bg-white/5 transition-colors border-t border-[rgba(214,235,253,0.1)]"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <motion.span
                    className="text-[13px] font-medium text-[#f0f0f0] px-4 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] hover:bg-white/10 transition-colors cursor-pointer inline-block"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign in
                  </motion.span>
                </Link>
                <Link href="/register">
                  <motion.span
                    className="text-[13px] font-semibold text-black bg-white px-4 py-1.5 rounded-full hover:opacity-85 transition-opacity cursor-pointer inline-block"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get started
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#a1a4a5] hover:text-[#f0f0f0] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-[rgba(214,235,253,0.19)] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/5 transition-all"
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-[rgba(214,235,253,0.19)] mt-2 pt-3 flex gap-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 text-[13px] text-[#ff2047] border border-[rgba(255,32,71,0.3)] rounded-full py-2 hover:bg-[rgba(255,32,71,0.1)] transition-colors"
                  >
                    Sign out
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <span className="block text-center text-[13px] text-[#f0f0f0] border border-[rgba(214,235,253,0.19)] rounded-full py-2 hover:bg-white/10 transition-colors">
                        Sign in
                      </span>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <span className="block text-center text-[13px] font-semibold text-black bg-white rounded-full py-2 hover:opacity-85 transition-opacity">
                        Get started
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside overlay for profile dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
