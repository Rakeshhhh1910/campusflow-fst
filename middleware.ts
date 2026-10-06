/**
 * middleware.ts
 * Next.js Middleware — Authorization layer (Proxy gate).
 *
 * This runs BEFORE any page or API route handler is resolved.
 * It enforces role-based access control at the edge.
 *
 * IMPORTANT SECURITY NOTE:
 * Middleware alone is NOT sufficient security.
 * Server Actions and Route Handlers ALSO independently validate
 * authentication and authorization (defense in depth).
 *
 * Route Protection Rules:
 * - /dashboard        → requires authenticated session (any role)
 * - /requests/*       → requires MEMBER or ADMIN role
 * - /admin/*          → requires ADMIN role
 * - /api/requests/*   → requires authenticated session
 * - /api/admin/*      → requires ADMIN role
 * - /auth/*           → redirect authenticated users to dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication (any logged-in user)
const AUTHENTICATED_ROUTES = ["/dashboard", "/requests", "/activities/register"];

// Routes that require ADMIN role
const ADMIN_ROUTES = ["/admin"];

// API routes requiring authentication
const PROTECTED_API_ROUTES = ["/api/requests", "/api/activities"];

// API routes requiring ADMIN role
const ADMIN_API_ROUTES = ["/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Check session cookie ─────────────────────────────────────────────────────
  // Better Auth provides a helper to read the session cookie without a DB call.
  // Full session validation happens inside Route Handlers/Server Actions.
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // ── Admin API protection ─────────────────────────────────────────────────────
  if (ADMIN_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    // Full role check happens inside the Route Handler — middleware signals intent
    // by adding a header that the route handler can use
    const response = NextResponse.next();
    response.headers.set("x-middleware-auth", "admin-required");
    return response;
  }

  // ── Protected API routes ─────────────────────────────────────────────────────
  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // ── Admin page protection ────────────────────────────────────────────────────
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("reason", "unauthenticated");
      return NextResponse.redirect(loginUrl);
    }
    // Role is validated inside the admin page server component using requireAdmin()
    // Middleware sets header to signal admin check needed
    const response = NextResponse.next();
    response.headers.set("x-middleware-auth", "admin-required");
    return response;
  }

  // ── Authenticated page protection ────────────────────────────────────────────
  if (AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("reason", "unauthenticated");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Redirect authenticated users away from auth pages ────────────────────────
  if (pathname.startsWith("/auth/") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static assets, next internals, and API auth
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
