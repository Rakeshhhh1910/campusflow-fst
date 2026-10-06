"use client";

/**
 * app/error.tsx
 * Global Error Boundary (Client Component).
 * Catches unhandled runtime exceptions in route segments.
 */

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[CampusFlow Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-destructive/20 bg-card shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while processing your request. Our error telemetry has logged this incident.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground/70 bg-muted px-2 py-1 rounded inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
