/**
 * app/admin/audit/page.tsx
 * Admin Audit & Compliance Log Viewer — Server Component (RSC).
 * 
 * Demonstrates:
 * - Admin authorization guard
 * - Querying immutable Prisma AuditLog records
 * - Complete audit trail inspection with metadata details
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, ChevronLeft, ShieldCheck, Clock, User } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Audit & Compliance Log",
  description: "Chronological immutable record of all campus system events.",
};

export default async function AdminAuditPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin/audit");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  let auditLogs: Array<{
    id: string;
    action: string;
    resource: string;
    resourceId: string | null;
    userId: string | null;
    metadata: any;
    createdAt: Date;
    user?: { name: string | null; email: string } | null;
  }> = [];

  try {
    auditLogs = await prisma.auditLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (err) {
    console.error("[AdminAuditPage] Query error:", err);
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
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Audit & Compliance Log</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable, append-only chronological log of all platform mutations, logins, and status transitions.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          {auditLogs.length} Records Loaded
        </Badge>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[140px] text-xs font-bold">Timestamp</TableHead>
              <TableHead className="w-[110px] text-xs font-bold">Action</TableHead>
              <TableHead className="w-[130px] text-xs font-bold">Entity</TableHead>
              <TableHead className="w-[140px] text-xs font-bold">Target ID</TableHead>
              <TableHead className="w-[180px] text-xs font-bold">Actor</TableHead>
              <TableHead className="text-xs font-bold">Metadata Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                  No audit logs recorded yet. Perform actions to see audit events generated.
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/20 text-xs">
                  <TableCell className="text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        log.action === "CREATE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                          : log.action === "STATUS_UPDATE" || log.action === "UPDATE"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {log.resource}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                    {log.resourceId || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground truncate max-w-[170px]">
                        {log.user?.name || "System"}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[170px]">
                        {log.user?.email || "internal"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <pre className="text-[10px] font-mono text-muted-foreground bg-muted/40 p-1.5 rounded max-w-sm truncate">
                      {log.metadata || "—"}
                    </pre>
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
