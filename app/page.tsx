import { Suspense } from "react";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "NestIQ — Find Where You Belong",
  description: "AI-powered hotel discovery. Natural language search across India's best stays.",
};

// SSR: fetch featured hotels on server
async function getFeaturedHotels() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/hotel/hotels?limit=5`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.hotels ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredHotels = await getFeaturedHotels();
  return (
    <Suspense fallback={null}>
      <HomeClient featuredHotels={featuredHotels} />
    </Suspense>
  );
}
