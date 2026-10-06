/**
 * lib/auth/auth.ts
 * Better Auth configuration for CampusFlow.
 * Handles session management, credential authentication, and role-based access.
 * SERVER ONLY — contains secrets, never expose to client.
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // Refresh if > 1 day old
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  // Email + Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Simplified for academic demo
    minPasswordLength: 8,
  },

  // Trust headers from Next.js middleware
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],

  // User fields — role is stored in the users table via Prisma
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "MEMBER",
        input: false, // Role is set by admin only, not by user input
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
