/**
 * lib/auth/auth-client.ts
 * Better Auth client-side configuration.
 * CLIENT COMPONENT SAFE — only exposes client methods, no secrets.
 * Used in 'use client' components for auth state and actions.
 */

"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;
