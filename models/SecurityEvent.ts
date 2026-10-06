/**
 * models/SecurityEvent.ts
 * Mongoose model for security-related events.
 * Stored in MongoDB — includes login attempts, unauthorized access, etc.
 */

import mongoose, { Document, Schema } from "mongoose";

export interface ISecurityEvent extends Document {
  eventType: "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "LOGOUT" | "UNAUTHORIZED_ACCESS" | "SESSION_EXPIRED" | "ROLE_VIOLATION";
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const SecurityEventSchema = new Schema<ISecurityEvent>(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT", "UNAUTHORIZED_ACCESS", "SESSION_EXPIRED", "ROLE_VIOLATION"],
      index: true,
    },
    userId: { type: String, index: true },
    email: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    collection: "security_events",
    timestamps: false,
  }
);

SecurityEventSchema.index({ userId: 1, timestamp: -1 });
SecurityEventSchema.index({ eventType: 1, timestamp: -1 });

export const SecurityEvent =
  mongoose.models.SecurityEvent ||
  mongoose.model<ISecurityEvent>("SecurityEvent", SecurityEventSchema);
