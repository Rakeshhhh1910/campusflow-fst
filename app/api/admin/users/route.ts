/**
 * app/api/admin/users/route.ts
 * Protected Admin Route Handler for User Management.
 * 
 * Demonstrates: Admin-only authorization check.
 * Checks server session and verifies user role is strictly ADMIN.
 * Returns 403 Forbidden for non-admin users, 401 for unauthenticated.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: "Forbidden: Admin role required", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role") as UserRole | null;
    const query = searchParams.get("q") || "";

    const users = await prisma.user.findMany({
      where: {
        ...(roleFilter ? { role: roleFilter } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            serviceRequests: true,
            activityRegistrations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: "Forbidden: Admin role required", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Valid userId and role are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/users]", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
