/**
 * app/admin/users/page.tsx
 * Admin User & Role Management — Server Component (RSC).
 */

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, ChevronLeft, ShieldCheck, Mail, Calendar } from "lucide-react";
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
  title: "Admin User Management",
  description: "View and manage campus user roles and permissions.",
};

export default async function AdminUsersPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin/users");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  let users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    _count: {
      serviceRequests: number;
      activityRegistrations: number;
    };
  }> = [];

  try {
    users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            serviceRequests: true,
            activityRegistrations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[AdminUsersPage] Query error:", err);
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
            <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Campus Accounts</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Directory of all registered university profiles, associated role permissions, and ticket volumes.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          {users.length} Registered Users
        </Badge>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-bold">User</TableHead>
              <TableHead className="w-[120px] text-xs font-bold">Role</TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-center">Requests</TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-center">Activities</TableHead>
              <TableHead className="w-[150px] text-xs font-bold text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  No registered users in the database.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/20 text-xs">
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground">{u.name || "Unnamed Student"}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : "secondary"}
                      className={`text-[10px] font-bold ${
                        u.role === "ADMIN" ? "bg-indigo-600" : ""
                      }`}
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-foreground">
                    {u._count.serviceRequests}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-foreground">
                    {u._count.activityRegistrations}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
