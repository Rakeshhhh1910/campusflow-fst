/**
 * app/admin/page.tsx
 * Admin Portal Overview — Server Component (RSC).
 * 
 * Demonstrates:
 * - Admin authorization guard via requireAdmin()
 * - Aggregated administrative metrics across PostgreSQL and audit streams
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Calendar,
  Users,
  Activity,
  ArrowRight,
  Database,
  CheckCircle,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Control Center",
  description: "Administrative dashboard for service requests, user roles, and audit trails.",
};

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  let metrics = {
    usersCount: 0,
    requestsCount: 0,
    activitiesCount: 0,
    auditLogsCount: 0,
  };

  try {
    const [users, requests, activities, audits] = await Promise.all([
      prisma.user.count(),
      prisma.serviceRequest.count(),
      prisma.activity.count(),
      prisma.auditLog.count(),
    ]);

    metrics = {
      usersCount: users,
      requestsCount: requests,
      activitiesCount: activities,
      auditLogsCount: audits,
    };
  } catch (err) {
    console.error("[AdminPage] Metrics query error:", err);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Admin Control Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unified management for campus service requests, user permissions, and compliance audit logs.
          </p>
        </div>

        <Badge variant="outline" className="border-indigo-400 text-indigo-600 dark:text-indigo-400 px-3 py-1 font-mono text-xs">
          RBAC: ADMIN
        </Badge>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Service Requests</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.requestsCount}</div>
          <p className="text-xs text-muted-foreground">Tickets logged across all categories</p>
        </Card>

        <Card className="p-6 border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Activities</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.activitiesCount}</div>
          <p className="text-xs text-muted-foreground">Published workshops and events</p>
        </Card>

        <Card className="p-6 border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Accounts</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.usersCount}</div>
          <p className="text-xs text-muted-foreground">Registered faculty, staff, and students</p>
        </Card>

        <Card className="p-6 border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Audit Records</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.auditLogsCount}</div>
          <p className="text-xs text-muted-foreground">Immutable compliance log entries</p>
        </Card>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="p-6 border-border/60 bg-card hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Service Request Management</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review incoming student tickets, change resolution statuses (Pending, Approved, Resolved), and trigger transactional notifications.
            </p>
          </div>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
            <Link href="/admin/requests" className="flex items-center justify-center gap-1.5">
              <span>Manage Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 border-border/60 bg-card hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Audit & Compliance Trails</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspect immutable audit records capturing every create, update, registration, and status change with timestamps and metadata.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full text-xs font-medium">
            <Link href="/admin/audit" className="flex items-center justify-center gap-1.5">
              <span>View Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 border-border/60 bg-card hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">User & Role Management</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspect all registered accounts, view ticket counts per user, and manage role assignments (ADMIN, MEMBER, GUEST).
            </p>
          </div>
          <Button asChild variant="outline" className="w-full text-xs font-medium">
            <Link href="/admin/users" className="flex items-center justify-center gap-1.5">
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
