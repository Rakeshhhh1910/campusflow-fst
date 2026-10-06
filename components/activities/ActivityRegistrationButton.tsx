"use client";

/**
 * components/activities/ActivityRegistrationButton.tsx
 * Client Component hydration boundary inside the Server-rendered Activity Detail Page.
 * 
 * Demonstrates:
 * - Server Action dispatch with React useTransition
 * - Granular Zustand selector integration for "Add to Plan"
 * - Instant feedback and Sonner toasts
 * - Role-based client messaging
 */

import * as React from "react";
import { useTransition } from "react";
import { Check, Loader2, CalendarPlus, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerForActivity } from "@/app/actions/activities";
import { useIsActivitySelected, useActivityStore, SelectedActivity } from "@/store/activity-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ActivityRegistrationButtonProps {
  activity: {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    capacity: number;
    registeredCount: number;
  };
  isRegisteredInitially: boolean;
  isAuthenticated: boolean;
}

export function ActivityRegistrationButton({
  activity,
  isRegisteredInitially,
  isAuthenticated,
}: ActivityRegistrationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = React.useState(isRegisteredInitially);
  const router = useRouter();

  const isSelected = useIsActivitySelected(activity.id);
  const addActivity = useActivityStore((state) => state.addActivity);
  const removeActivity = useActivityStore((state) => state.removeActivity);

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to register for campus activities");
      router.push("/auth/signin");
      return;
    }

    startTransition(async () => {
      const res = await registerForActivity(activity.id);
      if (res.success) {
        setIsRegistered(true);
        toast.success("Successfully registered for this activity!");
      } else {
        toast.error(res.error || "Failed to register");
      }
    });
  };

  const handleCartToggle = () => {
    if (isSelected) {
      removeActivity(activity.id);
      toast.info(`Removed "${activity.title}" from your plan`);
    } else {
      const item: SelectedActivity = {
        id: activity.id,
        title: activity.title,
        category: activity.category,
        date: activity.date,
        location: activity.location,
        capacity: activity.capacity,
      };
      addActivity(item);
      toast.success(`Added "${activity.title}" to your plan!`);
    }
  };

  const isFull = activity.registeredCount >= activity.capacity && !isRegistered;

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button
        size="lg"
        disabled={isPending || isRegistered || isFull}
        onClick={handleRegister}
        className={`flex-1 font-semibold transition-all ${
          isRegistered
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25"
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Registering...
          </>
        ) : isRegistered ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Confirmed Registration
          </>
        ) : isFull ? (
          "Activity Full"
        ) : (
          <>
            <CalendarPlus className="w-4 h-4 mr-2" />
            Register Now
          </>
        )}
      </Button>

      <Button
        variant={isSelected ? "secondary" : "outline"}
        size="lg"
        onClick={handleCartToggle}
        className="border-indigo-200 dark:border-indigo-900"
      >
        {isSelected ? (
          <>
            <Check className="w-4 h-4 mr-2 text-indigo-600" />
            In My Plan
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Save to Plan
          </>
        )}
      </Button>
    </div>
  );
}
