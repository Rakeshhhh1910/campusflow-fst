/**
 * components/navigation/Footer.tsx
 * Accessible semantic footer component.
 */

import Link from "next/link";
import { Compass, GitBranch, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-foreground"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span>CampusFlow</span>
            </Link>
            <p className="text-xs leading-relaxed">
              Unified Campus Service & Activity Management Platform built with Next.js App Router,
              Prisma, MongoDB Mongoose, and Better Auth.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-[11px]">
              Platform
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/activities" className="hover:text-foreground transition-colors">
                  Campus Activities
                </Link>
              </li>
              <li>
                <Link href="/requests/new" className="hover:text-foreground transition-colors">
                  Submit Service Request
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/performance" className="hover:text-foreground transition-colors">
                  Core Web Vitals & Lighthouse
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Assignment */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-[11px]">
              Course Work
            </h4>
            <ul className="space-y-1.5">
              <li>
                <span className="text-foreground/80 font-medium">Fullstack Next.js (DJS23AMD302)</span>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  System Architecture
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-3 h-3" /> WCAG 2.1 AA Compliant
                </span>
              </li>
            </ul>
          </div>

          {/* Stack Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-[11px]">
              Tech Highlights
            </h4>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Dual-database pattern: PostgreSQL with Prisma ORM for relational models; MongoDB with
              Mongoose for event-sourced audit streams; Resend for transactional email.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CampusFlow. Academic Capstone Project.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js App Router (RSC)</span>
            <span>•</span>
            <span>Prisma + PostgreSQL</span>
            <span>•</span>
            <span>Mongoose + MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
