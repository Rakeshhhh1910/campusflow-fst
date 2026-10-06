/**
 * app/not-found.tsx
 * Accessible 404 Page (Server Component).
 */

import Link from "next/link";
import { Compass, Home, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Compass className="w-12 h-12 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
            404
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page or campus resource you requested doesn&apos;t exist, or has been moved to a different coordinate.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/activities">
              <Calendar className="w-4 h-4 mr-2" />
              Browse Activities
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
