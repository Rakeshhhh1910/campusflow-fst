/**
 * app/activities/page.tsx
 * Campus Activities Catalog — Server Component (RSC).
 * 
 * Demonstrates:
 * - Server-side data fetching with Prisma ORM
 * - Category filtering via URL searchParams
 * - Hydration boundary: Server Component renders list and passes
 *   serializable props to interactive Client Component ActivityCard
 */

import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Filter, Search, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Campus Activities & Events",
  description: "Browse, register, and plan for university workshops, sports, and seminars.",
};

const CATEGORIES = [
  "ALL",
  "TECHNICAL",
  "SPORTS",
  "CULTURAL",
  "WORKSHOP",
  "SEMINAR",
  "ACADEMIC",
];

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const activeCategory = category?.toUpperCase() || "ALL";

  let activities: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    location: string;
    capacity: number;
    _count?: { registrations: number };
  }> = [];

  try {
    activities = await prisma.activity.findMany({
      where: {
        ...(activeCategory !== "ALL" ? { category: activeCategory as any } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { date: "asc" },
    });
  } catch (err) {
    // Database fallback if offline
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Calendar className="w-4 h-4" />
            <span>Campus Schedule</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Activities & Workshops
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover upcoming student events, reserve your seat, and add items to your semester plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/dashboard">View My Plan</Link>
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={cat === "ALL" ? "/activities" : `/activities?category=${cat}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Activities Grid */}
      {activities.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border/60 bg-muted/20 space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold">No activities found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are currently no events matching your criteria. Try adjusting the category filter or check back soon.
            </p>
          </div>
          {activeCategory !== "ALL" && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/activities">Reset Category Filter</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={{
                id: activity.id,
                title: activity.title,
                description: activity.description,
                category: activity.category,
                date: activity.date.toISOString(),
                location: activity.location,
                capacity: activity.capacity,
                registeredCount: activity._count?.registrations ?? 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
