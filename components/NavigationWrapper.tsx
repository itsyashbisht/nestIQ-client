"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

/** Routes where the nav should be hidden — auth pages have their own layout */
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuth) return null;
  return <Navigation />;
}
