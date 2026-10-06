/**
 * lib/mongoose/events.ts
 * Helper functions to log events into MongoDB using Mongoose models.
 * Called from Server Actions and Route Handlers after successful Prisma mutations.
 * SERVER ONLY — never import in client components.
 */

import { connectMongoDB } from "./connection";
import { ApplicationEvent } from "@/models/ApplicationEvent";
import { SecurityEvent } from "@/models/SecurityEvent";
import { ActivityEvent } from "@/models/ActivityEvent";

// ── Application Events ───────────────────────────────────────────────────────

export async function logApplicationEvent(data: {
  eventType: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await connectMongoDB();
    await ApplicationEvent.create({
      ...data,
      timestamp: new Date(),
    });
  } catch (err) {
    // Never let event logging fail the main operation
    console.error("[MongoDB] Failed to log application event:", err);
  }
}

// ── Security Events ──────────────────────────────────────────────────────────

export async function logSecurityEvent(data: {
  eventType: "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "LOGOUT" | "UNAUTHORIZED_ACCESS" | "SESSION_EXPIRED" | "ROLE_VIOLATION";
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectMongoDB();
    await SecurityEvent.create({
      ...data,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("[MongoDB] Failed to log security event:", err);
  }
}

// ── Activity Events ──────────────────────────────────────────────────────────

export async function logActivityEvent(data: {
  eventType: "ACTIVITY_VIEWED" | "REGISTRATION_CREATED" | "REGISTRATION_CANCELLED" | "ACTIVITY_INTEREST_ADDED" | "ACTIVITY_INTEREST_REMOVED";
  activityId: string;
  activityTitle: string;
  userId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectMongoDB();
    await ActivityEvent.create({
      ...data,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("[MongoDB] Failed to log activity event:", err);
  }
}
