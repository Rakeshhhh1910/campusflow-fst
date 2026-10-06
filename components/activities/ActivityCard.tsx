"use client";

/**
 * components/activities/ActivityCard.tsx
 * Interactive client component receiving serializable data from Server Component.
 *
 * HYDRATION BOUNDARY & SELECTOR OPTIMIZATION (Req A1-PB-09, A1-PB-10):
 * - Uses `useIsActivitySelected(activity.id)` granular selector
 * - Only THIS specific card re-renders when its selection state changes
 * - Other 19+ activity cards in the list DO NOT re-render!
 */

import * as React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Check, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useIsActivitySelected, useActivityStore, SelectedActivity } from "@/store/activity-store";
import { toast } from "sonner";

export interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string; // ISO string passed from RSC (serializable)
    location: string;
    capacity: number;
    registeredCount?: number;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  // GRANULAR SELECTOR: subscribes strictly to whether THIS item is in cart
  const isSelected = useIsActivitySelected(activity.id);
  const addActivity = useActivityStore((state) => state.addActivity);
  const removeActivity = useActivityStore((state) => state.removeActivity);

  const registered = activity.registeredCount ?? 0;
  const isFull = registered >= activity.capacity;
  const percentFull = Math.min(100, Math.round((registered / activity.capacity) * 100));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeActivity(activity.id);
      toast.info(`Removed "${activity.title}" from your plan`);
    } else {
      const serializableItem: SelectedActivity = {
        id: activity.id,
        title: activity.title,
        category: activity.category,
        date: activity.date,
        location: activity.location,
        capacity: activity.capacity,
      };
      addActivity(serializableItem);
      toast.success(`Added "${activity.title}" to your plan!`);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "TECHNICAL":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "SPORTS":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
      case "CULTURAL":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900";
      case "WORKSHOP":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900";
      default:
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900";
    }
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border border-border/60 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 bg-card/70 backdrop-blur-xs">
      <CardHeader className="p-5 pb-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold tracking-wider uppercase ${getCategoryColor(
              activity.category
            )}`}
          >
            {activity.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>
              {registered}/{activity.capacity}
            </span>
          </div>
        </div>

        <Link
          href={`/activities/${activity.id}`}
          className="block group/title"
          aria-label={`View details for ${activity.title}`}
        >
          <h3 className="text-lg font-bold text-foreground group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors line-clamp-1 flex items-center justify-between">
            <span>{activity.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-indigo-500" />
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {activity.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 pb-3 space-y-3">
        {/* Capacity Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Capacity</span>
            <span className={isFull ? "text-destructive font-semibold" : ""}>
              {isFull ? "Full" : `${percentFull}%`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? "bg-destructive"
                  : percentFull > 80
                  ? "bg-amber-500"
                  : "bg-indigo-600 dark:bg-indigo-400"
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            {new Date(activity.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="line-clamp-1 max-w-[140px]">{activity.location}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-2 flex items-center gap-2 border-t border-border/40 bg-muted/20">
        <Button
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          onClick={handleToggle}
          className={`w-full text-xs font-medium transition-all ${
            isSelected
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-200"
              : "hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300"
          }`}
          aria-label={isSelected ? "Remove from my plan" : "Add to my plan"}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
              In Your Plan
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              Add to Plan
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link href={`/activities/${activity.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
