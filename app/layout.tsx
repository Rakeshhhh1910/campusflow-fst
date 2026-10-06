/**
 * app/layout.tsx
 * Root Layout — Server Component (RSC).
 *
 * CRITICAL REQUIREMENTS SATISFIED:
 * - A1-PA-08: suppressHydrationWarning on <html> to prevent theme-switching hydration shift
 * - A1-PA-10: Stays a Server Component (DO NOT add 'use client' here)
 * - A1-PB-10: Server layout wraps Client Providers cleanly
 * - A1-AX-01: Semantic HTML structure (<header>, <main>, <footer>)
 * - SEO: Complete metadata tags and Open Graph specifications
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CampusFlow — Unified Student Service & Activity Platform",
    template: "%s | CampusFlow",
  },
  description:
    "Empowering modern campus operations with seamless service requests, real-time activity planning, and dual-database architecture.",
  keywords: [
    "Campus Management",
    "Student Services",
    "University Activities",
    "Next.js App Router",
    "Prisma ORM",
    "Mongoose MongoDB",
  ],
  authors: [{ name: "CampusFlow Engineering" }],
  openGraph: {
    title: "CampusFlow — Unified Student Service & Activity Platform",
    description:
      "Modern full-stack campus management platform built with Next.js App Router, Prisma, MongoDB, and Better Auth.",
    url: "https://campusflow.local",
    siteName: "CampusFlow",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "CampusFlow Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-600">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
