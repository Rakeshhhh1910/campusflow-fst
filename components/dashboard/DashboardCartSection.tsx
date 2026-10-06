"use client";

/**
 * components/dashboard/DashboardCartSection.tsx
 * Client Component inside the Student Dashboard showing Zustand cart items.
 */

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelectedActivities, useActivityActions } from "@/store/activity-store";
import { toast } from "sonner";

export function DashboardCartSection() {
  const [mounted, setMounted] = React.useState(false);
  const activities = useSelectedActivities();
  const { removeActivity, clearActivities } = useActivityActions();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-border/60 bg-card/60 p-6 space-y-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-20 bg-muted rounded-xl animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/70 shadow-sm overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Saved in Your Plan
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {activities.length} {activities.length === 1 ? "activity" : "activities"} saved in local state
          </p>
        </div>

        {activities.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearActivities();
              toast.info("Cleared plan");
            }}
            className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
          >
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-xs text-muted-foreground">Your planner is currently empty.</p>
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link href="/activities">Browse Activities</Link>
            </Button>
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/40 bg-background/50 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <Link
                  href={`/activities/${act.id}`}
                  className="text-xs font-bold text-foreground hover:text-indigo-600 truncate block"
                >
                  {act.title}
                </Link>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    {new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    {act.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" asChild className="h-7 px-2 text-xs">
                  <Link href={`/activities/${act.id}`}>View</Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    removeActivity(act.id);
                    toast.info(`Removed ${act.title}`);
                  }}
                  aria-label={`Remove ${act.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
