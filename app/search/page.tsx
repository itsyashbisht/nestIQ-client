import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Hotels — NestIQ",
  description: "AI-powered hotel search. Describe what you want in plain English.",
};

export default function SearchPage() {
  return <SearchClient />;
}
