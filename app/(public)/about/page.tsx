/**
 * app/(public)/about/page.tsx
 * About CampusFlow & Technical Architecture Overview (Server Component).
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  Database,
  Shield,
  Layers,
  Zap,
  Mail,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About System Architecture",
  description: "Academic documentation and technical specification for CampusFlow.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12 max-w-5xl">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto border-b border-border/40 pb-8">
        <Badge variant="secondary" className="text-xs uppercase tracking-wider font-semibold">
          Capstone Project
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          About CampusFlow
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A high-performance student service desk and event coordinator built for modern educational institutions using full-stack Next.js.
        </p>
      </div>

      {/* Course Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border/60 bg-card space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Course Specification</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <li>• <strong className="text-foreground">Course:</strong> Fullstack Development with NextJs (DJS23AMD302)</li>
            <li>• <strong className="text-foreground">Lab:</strong> Fullstack Development with NextJs Lab (DJS23AMD302L)</li>
            <li>• <strong className="text-foreground">Framework:</strong> Next.js 16 App Router (RSC)</li>
            <li>• <strong className="text-foreground">Styling:</strong> Tailwind CSS + Radix UI + shadcn/ui</li>
          </ul>
        </Card>

        <Card className="p-6 border-border/60 bg-card space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>Key Engineering Pillars</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <li>• <strong className="text-foreground">Type Safety:</strong> End-to-end TypeScript and shared Zod schemas</li>
            <li>• <strong className="text-foreground">Defense in Depth:</strong> Edge middleware plus isolated Server Action auth</li>
            <li>• <strong className="text-foreground">State Isolation:</strong> Server state in PostgreSQL; client cart in Zustand</li>
            <li>• <strong className="text-foreground">Observability:</strong> Real-time event streams persisted to MongoDB</li>
          </ul>
        </Card>
      </div>

      {/* Dual Database Deep Dive */}
      <div className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-indigo-950/20 shadow-lg space-y-6">
        <div className="space-y-1">
          <Badge className="bg-indigo-600 text-white text-xs">Architectural Design Decision</Badge>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Why Two Databases? (PostgreSQL + MongoDB)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl border border-border/40 bg-background/50 space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              PostgreSQL via Prisma ORM
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Used for ACID relational models where consistency and relational integrity are paramount:
              Users, Roles, ServiceRequests, Activities, Registrations, and AuditLogs. Foreign keys enforce referential guarantees.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/40 bg-background/50 space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              MongoDB via Mongoose
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Used for heterogeneous event documents (ApplicationEvent, SecurityEvent, ActivityEvent).
              Variable metadata shapes and high-volume append streams do not require complex table joins or schema migrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
