/**
 * app/dashboard/loading.tsx
 * Skeleton loading state for the Student Dashboard (Req LS-01).
 * Eliminates Cumulative Layout Shift (CLS).
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in-50">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-border/40 pb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-border/40 bg-card space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
