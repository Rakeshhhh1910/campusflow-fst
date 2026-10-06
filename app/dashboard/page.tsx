/**
 * app/dashboard/page.tsx
 * Student Dashboard — Server Component (RSC).
 * 
 * Demonstrates:
 * - Direct server-side data fetching via Prisma
 * - Multi-query parallelization with Promise.all
 * - Clear separation between Server State (registered activities, requests)
 *   and Client State (Zustand planner/cart)
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCartSection } from "@/components/dashboard/DashboardCartSection";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Personal student portal for activity registrations and service requests.",
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const userId = (session.user as { id: string }).id;
  const userName = (session.user as { name?: string }).name || "Student";
  const userRole = (session.user as { role?: string }).role || "MEMBER";

  // Parallel server queries
  const [registrations, recentRequests, totalRequestsCount] = await Promise.all([
    prisma.activityRegistration.findMany({
      where: { userId },
      include: {
        activity: true,
      },
      orderBy: { registeredAt: "desc" },
      take: 5,
    }),
    prisma.serviceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.serviceRequest.count({
      where: { userId },
    }),
  ]);

  const pendingRequestsCount = recentRequests.filter(
    (r) => r.status === "PENDING" || r.status === "IN_REVIEW"
  ).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Student Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your active service tickets, confirmed activity registrations, and saved plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
            <Link href="/requests/new" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/60 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Activities</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{registrations.length}</div>
          <p className="text-xs text-muted-foreground">Confirmed university seat reservations</p>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{pendingRequestsCount}</div>
          <p className="text-xs text-muted-foreground">In progress or waiting for review</p>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tickets</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{totalRequestsCount}</div>
          <p className="text-xs text-muted-foreground">Lifetime service submissions</p>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Registered Activities & Recent Tickets */}
        <div className="lg:col-span-2 space-y-8">
          {/* Confirmed Registrations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>My Registered Activities</span>
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                <Link href="/activities">Browse More</Link>
              </Button>
            </div>

            {registrations.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-border/60 bg-muted/10 space-y-3">
                <p className="text-xs text-muted-foreground">You have not registered for any activities yet.</p>
                <Button size="sm" variant="outline" asChild className="text-xs">
                  <Link href="/activities">Explore Upcoming Events</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {registrations.map(({ activity }) => (
                  <Card
                    key={activity.id}
                    className="p-4 border-border/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <Link
                        href={`/activities/${activity.id}`}
                        className="text-sm font-bold text-foreground hover:text-indigo-600 block line-clamp-1"
                      >
                        {activity.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{activity.location}</p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="text-xs shrink-0">
                      <Link href={`/activities/${activity.id}`}>Details</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Service Requests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span>Recent Service Requests</span>
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                <Link href="/requests">View All</Link>
              </Button>
            </div>

            {recentRequests.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-border/60 bg-muted/10 space-y-3">
                <p className="text-xs text-muted-foreground">No recent service requests.</p>
                <Button size="sm" variant="outline" asChild className="text-xs">
                  <Link href="/requests/new">Submit a Request</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <Card
                    key={req.id}
                    className="p-4 border-border/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {req.category}
                        </Badge>
                        <Badge
                          variant={req.status === "RESOLVED" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">{req.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                    </div>

                    <div className="text-[11px] text-muted-foreground shrink-0">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Zustand Activity Cart Plan */}
        <div className="space-y-6">
          <DashboardCartSection />
        </div>
      </div>
    </div>
  );
}
