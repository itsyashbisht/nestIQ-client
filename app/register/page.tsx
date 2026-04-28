import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = { title: "Create Account — NestIQ" };

export default function RegisterPage() {
  return <RegisterClient />;
}
