/**
 * app/requests/new/page.tsx
 * Create Service Request Page (Server Component wrapper).
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Submit Service Request",
  description: "Report campus maintenance, IT support, or facility requests.",
};

export default async function NewRequestPage() {
  const session = await getServerSession();

  // Redirect to sign in if unauthenticated
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/requests/new");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link href="/requests" className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to My Requests</span>
          </Link>
        </Button>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Submit Service Request
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Log an infrastructure, technical, or facility issue. Submissions are tracked with automated audit logs and status updates.
        </p>
      </div>

      {/* Type-Safe Client Form */}
      <ServiceRequestForm />
    </div>
  );
}
