/**
 * lib/validations/service-request.ts
 * SHARED Zod schema for Service Requests.
 *
 * CRITICAL: This exact schema is used BOTH:
 * 1. Client-side with react-hook-form + zodResolver (inline validation)
 * 2. Server-side inside the Server Action (backend validation/sanitization)
 *
 * This ensures type-safety and consistent validation across the full stack.
 * Changing validation rules here automatically updates both sides.
 */

import { z } from "zod";

// ── Service Request Creation Schema ──────────────────────────────────────────
export const serviceRequestSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less")
    .trim(),

  category: z.enum([
    "MAINTENANCE",
    "IT_SUPPORT",
    "LIBRARY",
    "SPORTS",
    "CANTEEN",
    "ACADEMIC",
    "ADMINISTRATIVE",
    "OTHER",
  ]),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be 1000 characters or less")
    .trim(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

// TypeScript type inferred from the schema
export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

// ── Service Request Status Update Schema (Admin) ──────────────────────────────
export const updateRequestStatusSchema = z.object({
  requestId: z.string().cuid("Invalid request ID"),
  status: z.enum(["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "RESOLVED"]),
  adminNotes: z
    .string()
    .max(500, "Admin notes must be 500 characters or less")
    .optional(),
});

export type UpdateRequestStatusData = z.infer<typeof updateRequestStatusSchema>;

// ── Activity Registration Schema ──────────────────────────────────────────────
export const activityRegistrationSchema = z.object({
  activityId: z.string().cuid("Invalid activity ID"),
  notes: z
    .string()
    .max(200, "Notes must be 200 characters or less")
    .optional(),
});

export type ActivityRegistrationData = z.infer<typeof activityRegistrationSchema>;
