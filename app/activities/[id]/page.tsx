/**
 * app/activities/[id]/page.tsx
 * Activity Detail Page — Server Component (RSC).
 * 
 * HYDRATION BOUNDARY DEMONSTRATION (Req A1-PA-12, A1-PA-13):
 * 1. RSC fetches data from PostgreSQL using Prisma.
 * 2. Prepares strictly serializable props (Date converted to ISO string, counts as numbers).
 * 3. Renders static markup server-side (title, description, dates).
 * 4. Passes serializable data across the boundary to the Client Component
 *    `ActivityRegistrationButton` for interactive state, transitions, and toasts.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  Clock,
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityRegistrationButton } from "@/components/activities/ActivityRegistrationButton";

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ActivityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { title: true, description: true },
    });
    if (!activity) return { title: "Activity Not Found" };
    return {
      title: `${activity.title} | CampusFlow`,
      description: activity.description.slice(0, 160),
    };
  } catch {
    return { title: "Campus Activity" };
  }
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;

  let activity = null;
  let session = null;
  let isRegistered = false;

  try {
    session = await getServerSession();
    const userId = (session?.user as { id?: string })?.id;

    activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
        ...(userId
          ? {
              registrations: {
                where: { userId },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    if (activity && userId && (activity as any).registrations?.length > 0) {
      isRegistered = true;
    }
  } catch (err) {
    console.error("[ActivityDetailPage] Query error:", err);
  }

  if (!activity) {
    notFound();
  }

  const registeredCount = activity._count?.registrations ?? 0;
  const isFull = registeredCount >= activity.capacity;
  const percentFull = Math.min(100, Math.round((registeredCount / activity.capacity) * 100));

  // SERIALIZABLE PROPS ACROSS HYDRATION BOUNDARY (Req A1-PA-13)
  const serializableActivity = {
    id: activity.id,
    title: activity.title,
    category: activity.category,
    date: activity.date.toISOString(), // Serialized to string
    location: activity.location,
    capacity: activity.capacity,
    registeredCount: registeredCount,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground -ml-2">
          <Link href="/activities" className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Activities Catalog</span>
          </Link>
        </Button>
      </div>

      {/* Main Detail Header */}
      <div className="p-8 sm:p-10 rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-indigo-950/20 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
          >
            {activity.category}
          </Badge>

          {isFull && (
            <Badge variant="destructive" className="text-xs font-semibold">
              Capacity Full
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
          {activity.title}
        </h1>

        {/* Quick meta chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-background/50">
            <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Date</div>
              <div className="text-xs font-bold text-foreground">
                {new Date(activity.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-background/50">
            <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Location</div>
              <div className="text-xs font-bold text-foreground truncate max-w-[170px]">{activity.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-background/50">
            <Users className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Capacity</div>
              <div className="text-xs font-bold text-foreground">
                {registeredCount} / {activity.capacity} Enrolled
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Registration Progress</span>
            <span className="font-semibold text-foreground">{percentFull}% seats filled</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isFull ? "bg-destructive" : percentFull > 80 ? "bg-amber-500" : "bg-indigo-600"
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>
        </div>

        {/* HYDRATION BOUNDARY: Passing serializable props to Client Component */}
        <div className="pt-2 border-t border-border/40">
          <ActivityRegistrationButton
            activity={serializableActivity}
            isRegisteredInitially={isRegistered}
            isAuthenticated={!!session?.user}
          />
        </div>
      </div>

      {/* Description & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-border/60 bg-card space-y-4">
          <h2 className="text-lg font-bold text-foreground">About This Activity</h2>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {activity.description}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Event Guidelines
          </h3>
          <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <li>• Please arrive 10 minutes before the scheduled start time.</li>
            <li>• Bring your student ID badge for entry verification.</li>
            <li>• Cancellations can be made up to 24 hours prior to the event.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
