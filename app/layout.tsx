import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import SessionProvider from "@/components/SessionProvider";
import React from "react";
import NavigationWrapper from "@/components/NavigationWrapper";
import { ToastContainer } from "react-toastify";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NestIQ — AI-Powered Hotel Discovery",
  description:
    "Find your perfect stay with natural language AI search. Boutique hotels, luxury resorts, and budget stays across India.",
  keywords: ["hotel booking", "AI search", "India hotels", "travel"],
  openGraph: {
    title: "NestIQ — Find Where You Belong",
    description: "AI-powered hotel discovery platform for India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        style={
          {
            "--font-display": "var(--font-cormorant), Georgia, serif",
            "--font-sans": "var(--font-dm-sans), ui-sans-serif, system-ui",
            "--font-mono": "var(--font-jetbrains), ui-monospace, monospace",
          } as React.CSSProperties
        }
      >
        <ReduxProvider>
          <SessionProvider>
            <ToastContainer />
            {/* NavigationWrapper reads pathname and hides nav on auth routes */}
            <NavigationWrapper />
            <main>{children}</main>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
