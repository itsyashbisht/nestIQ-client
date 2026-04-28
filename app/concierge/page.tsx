import type { Metadata } from "next";
import ConciergeClient from "./ConciergeClient";

export const metadata: Metadata = {
  title: "AI Concierge — NestIQ",
  description: "Your AI-powered travel planning assistant. Search hotels, plan budgets, build itineraries.",
};

export default function ConciergePage() {
  return <ConciergeClient />;
}
