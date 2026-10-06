/**
 * app/api/requests/route.ts
 * Protected Route Handler for Service Requests.
 *
 * Demonstrates: Protected GET + Protected POST endpoints.
 * Every endpoint independently validates authentication + authorization.
 * Do NOT trust client-provided user IDs.
 *
 * GET  /api/requests  → Returns current user's requests (authenticated)
 * POST /api/requests  → Creates a new request (authenticated MEMBER+)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { serviceRequestSchema } from "@/lib/validations/service-request";
import { UserRole } from "@prisma/client";

// ── GET /api/requests — Protected: requires authentication ───────────────────
export async function GET(request: NextRequest) {
  // Independent session validation — do not rely on middleware alone
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // Get userId from SESSION — never from query params or headers
  const userId = (session.user as { id: string }).id;
  const userRole = (session.user as { role: string }).role as UserRole;

  try {
    // ADMIN can see all requests; MEMBERs only see their own
    const requests = await prisma.serviceRequest.findMany({
      where: userRole === UserRole.ADMIN ? {} : { userId },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (err) {
    console.error("[GET /api/requests]", err);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// ── POST /api/requests — Protected: requires authentication ──────────────────
export async function POST(request: NextRequest) {
  // Independent session validation
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const userRole = (session.user as { role: string }).role as UserRole;

  // GUEST users cannot create requests
  if (userRole === UserRole.GUEST) {
    return NextResponse.json(
      { error: "Insufficient permissions", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate with Zod — same schema as client and Server Action
  const parsed = serviceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // userId from session — never from body
  const userId = (session.user as { id: string }).id;

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      title: parsed.data.title.trim(),
      category: parsed.data.category,
      description: parsed.data.description.trim(),
      priority: parsed.data.priority,
      userId,
    },
  });

  return NextResponse.json(
    { success: true, data: serviceRequest },
    { status: 201 }
  );
}
