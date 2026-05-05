"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getMe } from "@/thunks/user.thunk";

// Routes where session check should be skipped
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

interface Props {
  children: React.ReactNode;
}

export default function SessionProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (isAuthRoute) return;
    dispatch(getMe());    // sets isInitialized in extraReducers regardless of success/fail
  }, [dispatch, isAuthRoute]);

  // On auth routes — render immediately, no session check needed
  if (isAuthRoute) return <>{children}</>;

  // On protected routes — wait for session check
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "rgba(59,158,255,0.3)",
              borderTopColor: "#3b9eff",
            }}
          />
          <p className="text-[12px] text-[#464a4d]">Restoring session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
