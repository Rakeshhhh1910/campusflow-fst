/**
 * lib/auth/session.ts
 * Server-side session helpers.
 * SERVER ONLY — use in Server Components, Server Actions, and Route Handlers.
 */

import { headers } from "next/headers";
import { auth } from "./auth";
import { UserRole } from "@prisma/client";

/**
 * Get the current session from server context.
 * Returns null if not authenticated.
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Get the authenticated user or throw an error.
 * Use in Server Actions where authentication is required.
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return session.user;
}

/**
 * Require a specific role — throws if insufficient permissions.
 * Server Actions must call this independently (not rely only on middleware).
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  const userRole = (user as { role?: string }).role as UserRole;

  if (!allowedRoles.includes(userRole)) {
    throw new Error(`FORBIDDEN: Role ${userRole} is not allowed. Required: ${allowedRoles.join(", ")}`);
  }
  return user;
}

/**
 * Check if the current user is an admin.
 */
export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

/**
 * Check if the current user is a member or admin.
 */
export async function requireMember() {
  return requireRole([UserRole.MEMBER, UserRole.ADMIN]);
}
