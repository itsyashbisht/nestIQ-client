import type { Metadata } from "next";
import { BookingClient } from "./BookingClient";

export const metadata: Metadata = { title: "Book Your Stay — NestIQ" };

export default function BookPage() {
  return <BookingClient />;
}
