"use client";

/**
 * components/activities/ActivityCartSheet.tsx
 * Slide-over drawer for the persistent Activity Selection (Cart).
 * 
 * Demonstrates:
 * - Zustand client state consumption with granular selectors
 * - Radix UI Sheet primitive (accessible modal drawer)
 * - Dynamic list rendering with removal and clear actions
 * - Server Action dispatch from client cart
 */

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Calendar, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  useSelectedActivities,
  useSelectedActivitiesCount,
  useActivityActions,
} from "@/store/activity-store";
import { toast } from "sonner";

export function ActivityCartSheet() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const activities = useSelectedActivities();
  const count = useSelectedActivitiesCount();
  const { removeActivity, clearActivities } = useActivityActions();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="relative flex items-center gap-2 border-indigo-200 dark:border-indigo-900 hover:border-indigo-400 bg-background/80 backdrop-blur-sm"
            aria-label={`View selected activities cart, ${mounted ? count : 0} items`}
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline font-medium text-xs">My Plan</span>
            {mounted && count > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1 text-[11px] font-bold text-white bg-indigo-600 rounded-full animate-in zoom-in-50">
                {count}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Selected Activities
              </SheetTitle>
              {activities.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearActivities();
                    toast.info("Cleared all activities from your plan");
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                >
                  Clear all
                </Button>
              )}
            </div>
            <SheetDescription className="text-xs">
              Saved client-side in Zustand with localStorage persistence.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold">No activities selected</h4>
                <p className="text-xs text-muted-foreground">
                  Browse campus workshops, seminars, and events to add them to your planner.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  onClick={() => setOpen(false)}
                  className="mt-2"
                >
                  <Link href="/activities">Explore Activities</Link>
                </Button>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group relative p-3 rounded-lg border border-border/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors bg-card/60 shadow-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                          {activity.category}
                        </Badge>
                      </div>
                      <Link
                        href={`/activities/${activity.id}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                      >
                        {activity.title}
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-80 group-hover:opacity-100"
                      onClick={() => {
                        removeActivity(activity.id);
                        toast.info(`Removed ${activity.title}`);
                      }}
                      aria-label={`Remove ${activity.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      {activity.location}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {activities.length > 0 && (
          <SheetFooter className="pt-4 border-t flex-col gap-2 sm:flex-col">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
              <span>Selected items:</span>
              <span className="font-semibold text-foreground">{activities.length} activities</span>
            </div>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                <span>View in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
