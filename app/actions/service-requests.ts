/**
 * app/actions/service-requests.ts
 * Server Actions for Service Request mutations.
 *
 * SECURITY MODEL (Defense in Depth):
 * 1. Middleware blocks unauthenticated requests at the edge
 * 2. Server Action INDEPENDENTLY validates session (don't trust middleware alone)
 * 3. Server Action validates role
 * 4. Server Action validates + sanitizes input with Zod (same schema as client)
 * 5. Server Action performs Prisma mutation
 * 6. Server Action creates audit log
 * 7. Server Action logs event to MongoDB
 * 8. Server Action triggers email AFTER successful mutation
 *
 * WHY SERVER ACTIONS (not API routes for this)?
 * - Zero boilerplate: no fetch(), no JSON parsing, no URL construction
 * - Type-safe end-to-end: TypeScript infers return types
 * - Automatic CSRF protection
 * - Collocated with the form that uses them
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireMember, requireAdmin, getServerSession } from "@/lib/auth/session";
import {
  serviceRequestSchema,
  updateRequestStatusSchema,
  type ServiceRequestFormData,
  type UpdateRequestStatusData,
} from "@/lib/validations/service-request";
import { logApplicationEvent } from "@/lib/mongoose/events";
import { sendEmail } from "@/lib/email/resend";
import { ServiceRequestCreatedEmail } from "@/emails/ServiceRequestCreated";
import { ServiceRequestStatusUpdatedEmail } from "@/emails/ServiceRequestStatusUpdated";
import * as React from "react";
import { AuditAction } from "@prisma/client";

// ── Action Return Types ──────────────────────────────────────────────────────
type ActionResult<T = void> =
  | { success: true; data: T; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ── CREATE SERVICE REQUEST ───────────────────────────────────────────────────

export async function createServiceRequest(
  formData: ServiceRequestFormData
): Promise<ActionResult<{ id: string }>> {
  // STEP 1: Verify authenticated session — NEVER trust client
  let user;
  try {
    user = await requireMember();
  } catch {
    return { success: false, error: "You must be logged in to submit a request." };
  }

  // STEP 2: Server-side Zod validation using the SAME shared schema
  // This catches any payload tampering that bypassed client validation
  const parsed = serviceRequestSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      fieldErrors[field] = [...(fieldErrors[field] || []), issue.message];
    });
    return { success: false, error: "Validation failed", fieldErrors };
  }

  // STEP 3: Sanitize/normalize data
  const sanitized = {
    title: parsed.data.title.trim(),
    category: parsed.data.category,
    description: parsed.data.description.trim(),
    priority: parsed.data.priority,
  };

  // STEP 4: Obtain userId from authenticated session — NEVER from request body
  const userId = (user as { id: string }).id;

  // STEP 5: Database mutation
  let serviceRequest;
  try {
    serviceRequest = await prisma.serviceRequest.create({
      data: {
        ...sanitized,
        userId,
      },
    });
  } catch (err) {
    console.error("[createServiceRequest] DB error:", err);
    return { success: false, error: "Failed to create service request. Please try again." };
  }

  // STEP 6: Create audit log record
  try {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.REQUEST_CREATED,
        userId,
        resource: "ServiceRequest",
        resourceId: serviceRequest.id,
        serviceRequestId: serviceRequest.id,
        metadata: {
          title: sanitized.title,
          category: sanitized.category,
          priority: sanitized.priority,
        },
      },
    });
  } catch (err) {
    // Audit log failure should not fail the main operation
    console.error("[createServiceRequest] Audit log error:", err);
  }

  // STEP 7: Log to MongoDB (document-oriented event)
  await logApplicationEvent({
    eventType: "REQUEST_CREATED",
    userId,
    action: "Created service request",
    resource: "ServiceRequest",
    resourceId: serviceRequest.id,
    metadata: { title: sanitized.title, category: sanitized.category },
  });

  // STEP 8: Send transactional email AFTER successful mutation
  // Get user details for email
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (userRecord) {
    // Email is fire-and-forget — errors don't fail the action
    sendEmail({
      to: userRecord.email,
      subject: `Request Received: ${sanitized.title}`,
      react: React.createElement(ServiceRequestCreatedEmail, {
        studentName: userRecord.name,
        requestTitle: sanitized.title,
        requestCategory: sanitized.category,
        requestPriority: sanitized.priority,
        requestId: serviceRequest.id,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      }),
      userId,
      notificationType: "SERVICE_REQUEST_CREATED",
      serviceRequestId: serviceRequest.id,
    }).catch((err) => console.error("[createServiceRequest] Email error:", err));
  }

  // STEP 9: Revalidate the requests page cache
  revalidatePath("/requests");
  revalidatePath("/dashboard");
  revalidatePath("/admin/requests");

  return {
    success: true,
    data: { id: serviceRequest.id },
    message: "Service request submitted successfully!",
  };
}

// ── UPDATE REQUEST STATUS (Admin only) ──────────────────────────────────────

export async function updateRequestStatus(
  data: UpdateRequestStatusData
): Promise<ActionResult<{ id: string }>> {
  // STEP 1: Admin authorization — checked independently in the action
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { success: false, error: "Admin access required." };
  }

  // STEP 2: Validate with Zod schema
  const parsed = updateRequestStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid request data." };
  }

  const { requestId, status, adminNotes } = parsed.data;
  const adminId = (admin as { id: string }).id;

  // STEP 3: Fetch existing request to get previous status
  const existingRequest = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!existingRequest) {
    return { success: false, error: "Service request not found." };
  }

  const previousStatus = existingRequest.status;

  // STEP 4: Database mutation
  const updatedRequest = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status,
      adminNotes: adminNotes?.trim() || null,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });

  // STEP 5: Audit log
  await prisma.auditLog.create({
    data: {
      action: AuditAction.REQUEST_STATUS_CHANGED,
      userId: adminId,
      resource: "ServiceRequest",
      resourceId: requestId,
      serviceRequestId: requestId,
      metadata: {
        previousStatus,
        newStatus: status,
        adminNotes,
      },
    },
  });

  // STEP 6: MongoDB event
  await logApplicationEvent({
    eventType: "REQUEST_STATUS_CHANGED",
    userId: adminId,
    action: `Status changed from ${previousStatus} to ${status}`,
    resource: "ServiceRequest",
    resourceId: requestId,
    metadata: { previousStatus, newStatus: status },
  });

  // STEP 7: Send email notification to the student
  if (existingRequest.user) {
    sendEmail({
      to: existingRequest.user.email,
      subject: `Request Update: ${updatedRequest.title}`,
      react: React.createElement(ServiceRequestStatusUpdatedEmail, {
        studentName: existingRequest.user.name,
        requestTitle: updatedRequest.title,
        previousStatus,
        newStatus: status,
        adminNotes: adminNotes || undefined,
        requestId,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      }),
      userId: existingRequest.userId,
      notificationType: "SERVICE_REQUEST_STATUS_UPDATED",
      serviceRequestId: requestId,
    }).catch((err) => console.error("[updateRequestStatus] Email error:", err));
  }

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/dashboard");

  return {
    success: true,
    data: { id: requestId },
    message: `Request status updated to ${status}.`,
  };
}

// ── GET USER'S SERVICE REQUESTS (for dashboard/my-requests page) ─────────────

export async function getUserServiceRequests() {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false as const, error: "Authentication required", data: [] };
  }

  const userId = (session.user as { id: string }).id;

  const requests = await prisma.serviceRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return { success: true as const, data: requests };
}
