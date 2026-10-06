/**
 * app/requests/page.tsx
 * My Service Requests — Server Component (RSC).
 * 
 * Demonstrates:
 * - Server-side data query filtered by authenticated user ID
 * - Passing serializable array to Client Component RequestList
 * - Defense in depth: user ID derived from session only
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/requests/RequestList";

export const metadata: Metadata = {
  title: "My Service Requests",
  description: "View and track the status of campus facility and service requests.",
};

export default async function RequestsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/requests");
  }

  const userId = (session.user as { id: string }).id;

  let requests: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESOLVED";
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  try {
    requests = await prisma.serviceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[RequestsPage] Query failed:", err);
  }

  // Strictly serialize across the hydration boundary
  const serializableRequests = requests.map((req) => ({
    id: req.id,
    title: req.title,
    category: req.category,
    description: req.description,
    priority: req.priority,
    status: req.status,
    createdAt: req.createdAt.toISOString(),
    updatedAt: req.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <FileText className="w-4 h-4" />
            <span>Service Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            My Service Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track real-time progress and administrator feedback on your reported campus inquiries.
          </p>
        </div>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20">
          <Link href="/requests/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </Button>
      </div>

      {/* Request List Hydration */}
      <RequestList initialRequests={serializableRequests} />
    </div>
  );
}
