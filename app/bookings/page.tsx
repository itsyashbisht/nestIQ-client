import type { Metadata } from "next";
import BookingsClient from "./BookingsClient";

export const metadata: Metadata = {
  title: "My Bookings — NestIQ",
  description: "View and manage your hotel bookings.",
};

export default function BookingsPage() {
  return <BookingsClient />;
}
