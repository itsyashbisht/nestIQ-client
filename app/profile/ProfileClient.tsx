"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Sliders, Building2, LogOut, Check, Loader2, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { logoutUser } from "@/thunks/auth.thunk";

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Sliders },
  { id: "owner", label: "Owner Portal", icon: Building2 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={type === "password" && show ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none focus:border-[rgba(214,235,253,0.45)] transition-colors pr-9"
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#464a4d] hover:text-[#a1a4a5]"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

export default function ProfileClient() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState("account");
  const [saved, setSaved] = useState(false);

  // Account form
  const [fullname, setFullname] = useState(user?.fullname ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [city, setCity] = useState(user?.city ?? "");

  // Security form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Preferences
  const [stayType, setStayType] = useState("boutique");
  const [favorites, setFavorites] = useState("Goa, Rajasthan, Kerala");

  useEffect(() => {
    if (pathname !== "/profile") {
      return;
    }

    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [isInitialized, pathname, router, user]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  const initials = user?.fullname
    ? user.fullname.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const tabContent: Record<string, React.ReactNode> = {
    account: (
      <div className="flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-white mb-1">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name"><Input value={fullname} onChange={setFullname} placeholder="Rahul Sharma" /></Field>
          <Field label="Username"><Input value={username} onChange={setUsername} placeholder="rahuls92" /></Field>
        </div>
        <Field label="Email"><Input value={email} onChange={setEmail} type="email" placeholder="rahul@example.com" /></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone"><Input value={phone} onChange={setPhone} placeholder="+91 98765 43210" /></Field>
          <Field label="City"><Input value={city} onChange={setCity} placeholder="Mumbai" /></Field>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity"
          >
            {saved ? <><Check size={13} /> Saved!</> : "Save Changes"}
          </motion.button>
          <span className="text-[11px] text-[#a1a4a5]">
            Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2025"}
          </span>
        </div>
      </div>
    ),
    security: (
      <div className="flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-white mb-1">Change Password</h3>
        <Field label="Current Password"><Input value={currentPwd} onChange={setCurrentPwd} type="password" placeholder="••••••••" /></Field>
        <Field label="New Password"><Input value={newPwd} onChange={setNewPwd} type="password" placeholder="••••••••" /></Field>
        <Field label="Confirm New Password"><Input value={confirmPwd} onChange={setConfirmPwd} type="password" placeholder="••••••••" /></Field>
        {newPwd && confirmPwd && newPwd !== confirmPwd && (
          <p className="text-[11px] text-[#ff2047]">Passwords do not match</p>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={!currentPwd || !newPwd || newPwd !== confirmPwd}
          className="self-start px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity disabled:opacity-40"
        >
          Update Password
        </motion.button>
        <div className="pt-4 border-t border-[rgba(214,235,253,0.19)]">
          <h3 className="text-[13px] font-semibold text-white mb-3">Danger Zone</h3>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-[#ff2047] border border-[rgba(255,32,71,0.25)] px-4 py-2 rounded-full hover:bg-[rgba(255,32,71,0.1)] transition-colors"
          >
            <LogOut size={13} /> Sign out of all devices
          </button>
        </div>
      </div>
    ),
    preferences: (
      <div className="flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-white mb-1">Travel Preferences</h3>
        <Field label="Preferred Stay Type">
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value)}
            className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(214,235,253,0.19)] rounded-lg text-[13px] text-[#f0f0f0] outline-none"
          >
            {["budget", "comfort", "boutique", "luxury"].map((o) => (
              <option key={o} value={o} style={{ background: "#0d0d0d" }} className="capitalize">{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Favourite Destinations">
          <Input value={favorites} onChange={setFavorites} placeholder="Goa, Rajasthan, Kerala" />
        </Field>
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.5px] text-[#a1a4a5] mb-3">Travel Vibes</div>
          <div className="flex flex-wrap gap-2">
            {["romantic", "adventure", "family", "wellness", "heritage", "beachfront", "nature", "business"].map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(214,235,253,0.19)] text-[#a1a4a5] hover:border-[#ff801f] hover:text-[#ff801f] transition-all capitalize"
              >
                {v}
              </motion.button>
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="self-start mt-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity"
        >
          Save Preferences
        </motion.button>
      </div>
    ),
    owner: (
      <div className="flex flex-col gap-5">
        <h3 className="text-[13px] font-semibold text-white">Owner Portal</h3>
        {user?.role === "OWNER" || user?.role === "ADMIN" ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(17,255,153,0.06)] border border-[rgba(17,255,153,0.2)] mb-5">
              <Check size={14} className="text-[#11ff99]" />
              <span className="text-[13px] text-[#11ff99]">You have Owner access</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/owner/dashboard")}
              className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity"
            >
              Go to Dashboard →
            </motion.button>
          </div>
        ) : (
          <div>
            <p className="text-[13px] text-[#a1a4a5] leading-relaxed mb-5">
              List your property on NestIQ and reach thousands of travellers. Upgrade your account to Owner role to access the hotel management dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                { icon: "📊", title: "Analytics Dashboard", desc: "Revenue, occupancy, and booking trends" },
                { icon: "🏨", title: "Hotel Management", desc: "Add rooms, update amenities, manage images" },
                { icon: "💰", title: "Payment Tracking", desc: "View all bookings and payouts" },
              ].map((f) => (
                <div key={f.title} className="p-4 rounded-xl border border-[rgba(214,235,253,0.19)] bg-[rgba(255,255,255,0.01)]">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-[13px] font-medium text-white mb-1">{f.title}</div>
                  <div className="text-[11px] text-[#a1a4a5]">{f.desc}</div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-85 transition-opacity"
            >
              Request Owner Access
            </motion.button>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div className="pt-[60px] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-semibold text-black flex-shrink-0"
            style={{ background: "#ff801f", border: "2px solid rgba(255,128,31,0.3)" }}
          >
            {initials}
          </motion.div>
          <div>
            <h1 className="font-display text-3xl font-light text-white">{user?.fullname ?? "Your Profile"}</h1>
            <p className="text-[13px] text-[#a1a4a5]">{user?.email}</p>
            <span
              className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] px-2.5 py-1 rounded-full"
              style={{
                color: user?.role === "ADMIN" ? "#ffc53d" : user?.role === "OWNER" ? "#11ff99" : "#3b9eff",
                background: user?.role === "ADMIN" ? "rgba(255,197,61,0.1)" : user?.role === "OWNER" ? "rgba(17,255,153,0.1)" : "rgba(59,158,255,0.1)",
                border: `1px solid ${user?.role === "ADMIN" ? "rgba(255,197,61,0.25)" : user?.role === "OWNER" ? "rgba(17,255,153,0.25)" : "rgba(59,158,255,0.25)"}`,
              }}
            >
              {user?.role ?? "Guest"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-1.5 text-[12px] text-[#a1a4a5] hover:text-[#ff2047] transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-0 rounded-xl border border-[rgba(214,235,253,0.19)] mb-6 overflow-hidden"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium transition-all border-r border-[rgba(214,235,253,0.19)] last:border-r-0 ${
                  activeTab === tab.id
                    ? "bg-white/6 text-[#f0f0f0]"
                    : "text-[#a1a4a5] hover:text-[#f0f0f0] hover:bg-white/4"
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[rgba(214,235,253,0.19)] p-6 bg-[rgba(255,255,255,0.01)]"
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
