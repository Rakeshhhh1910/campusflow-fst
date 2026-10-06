/**
 * app/admin/requests/page.tsx
 * Admin Service Request Management — Server Component (RSC).
 * 
 * Demonstrates:
 * - Admin authorization check
 * - Full relational query including requester user data
 * - Integration with AdminRequestStatusSelect client component
 *   allowing real-time status transitions via Server Action
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, ChevronLeft, Filter, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminRequestStatusSelect } from "@/components/admin/AdminRequestStatusSelect";

export const metadata: Metadata = {
  title: "Admin Request Management",
  description: "Review, approve, and resolve campus service requests.",
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin/requests");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { status } = await searchParams;

  let requests: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESOLVED";
    createdAt: Date;
    user: { name: string | null; email: string };
  }> = [];

  try {
    requests = await prisma.serviceRequest.findMany({
      where: status && status !== "ALL" ? { status: status as any } : {},
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (err) {
    console.error("[AdminRequestsPage] Error:", err);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground -ml-2 mb-1">
            <Link href="/admin" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Admin Portal</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Service Request Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Review submitted student inquiries, assign priorities, and update lifecycle statuses.
          </p>
        </div>

        {/* Status Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PENDING", "IN_REVIEW", "APPROVED", "RESOLVED", "REJECTED"].map((st) => (
            <Link
              key={st}
              href={st === "ALL" ? "/admin/requests" : `/admin/requests?status=${st}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                (status === st) || (!status && st === "ALL")
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.replace("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[110px] text-xs font-bold">Ticket ID</TableHead>
              <TableHead className="text-xs font-bold">Title & Description</TableHead>
              <TableHead className="w-[120px] text-xs font-bold">Category</TableHead>
              <TableHead className="w-[100px] text-xs font-bold">Priority</TableHead>
              <TableHead className="text-xs font-bold">Requester</TableHead>
              <TableHead className="w-[160px] text-xs font-bold">Status Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                  No service requests found for this filter.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                    REQ-{req.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 max-w-md">
                      <div className="text-xs font-bold text-foreground line-clamp-1">{req.title}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{req.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {req.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={req.priority === "URGENT" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="font-medium text-foreground">{req.user.name || "Student"}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {req.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AdminRequestStatusSelect
                      requestId={req.id}
                      currentStatus={req.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
