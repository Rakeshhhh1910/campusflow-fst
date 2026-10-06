/**
 * app/actions/activities.ts
 * Server Actions for Activity management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireMember, getServerSession } from "@/lib/auth/session";
import { activityRegistrationSchema } from "@/lib/validations/service-request";
import { logActivityEvent } from "@/lib/mongoose/events";
import { AuditAction } from "@prisma/client";

type ActionResult<T = void> =
  | { success: true; data: T; message: string }
  | { success: false; error: string };

// ── REGISTER FOR ACTIVITY ────────────────────────────────────────────────────

export async function registerForActivity(
  activityId: string,
  notes?: string
): Promise<ActionResult<{ registrationId: string }>> {
  // Auth check
  let user;
  try {
    user = await requireMember();
  } catch {
    return { success: false, error: "You must be logged in to register for activities." };
  }

  // Validate input
  const parsed = activityRegistrationSchema.safeParse({ activityId, notes });
  if (!parsed.success) {
    return { success: false, error: "Invalid activity data." };
  }

  const userId = (user as { id: string }).id;

  // Check activity exists and has capacity
  const activity = await prisma.activity.findUnique({
    where: { id: activityId, isActive: true },
    include: { _count: { select: { registrations: true } } },
  });

  if (!activity) {
    return { success: false, error: "Activity not found or no longer active." };
  }

  if (activity._count.registrations >= activity.capacity) {
    return { success: false, error: "This activity is at full capacity." };
  }

  // Check if already registered
  const existing = await prisma.activityRegistration.findUnique({
    where: { userId_activityId: { userId, activityId } },
  });

  if (existing) {
    return { success: false, error: "You are already registered for this activity." };
  }

  // Create registration
  const registration = await prisma.activityRegistration.create({
    data: { userId, activityId, notes: notes?.trim() },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: AuditAction.REGISTRATION_CREATED,
      userId,
      resource: "ActivityRegistration",
      resourceId: registration.id,
      metadata: { activityId, activityTitle: activity.title },
    },
  });

  // MongoDB event
  await logActivityEvent({
    eventType: "REGISTRATION_CREATED",
    activityId,
    activityTitle: activity.title,
    userId,
    metadata: { registrationId: registration.id },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/activities/${activityId}`);

  return {
    success: true,
    data: { registrationId: registration.id },
    message: `Successfully registered for ${activity.title}!`,
  };
}

// ── GET ACTIVITIES (public + filtered) ──────────────────────────────────────

export async function getActivities(category?: string) {
  const activities = await prisma.activity.findMany({
    where: {
      isActive: true,
      ...(category && category !== "ALL" ? { category: category as never } : {}),
    },
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { date: "asc" },
  });

  return activities;
}

// ── GET USER'S REGISTRATIONS ─────────────────────────────────────────────────

export async function getUserRegistrations() {
  const session = await getServerSession();
  if (!session?.user) return [];

  const userId = (session.user as { id: string }).id;

  return prisma.activityRegistration.findMany({
    where: { userId },
    include: { activity: true },
    orderBy: { registeredAt: "desc" },
  });
}
