/**
 * models/ApplicationEvent.ts
 * Mongoose model for application-level events.
 * Stored in MongoDB — document-oriented, flexible schema.
 *
 * WHY MONGODB for this?
 * - Event metadata is heterogeneous (each event type has different fields)
 * - MongoDB's flexible schema handles this naturally without ALTER TABLE migrations
 * - Events are append-only — no complex relational queries needed
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IApplicationEvent extends Document {
  eventType: string;         // "REQUEST_CREATED", "USER_LOGIN", etc.
  userId: string;            // References User.id from PostgreSQL
  action: string;            // Human-readable action description
  resource: string;          // "ServiceRequest", "Activity", etc.
  resourceId?: string;       // ID of affected resource
  metadata: Record<string, unknown>; // Flexible event-specific data
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const ApplicationEventSchema = new Schema<IApplicationEvent>(
  {
    eventType: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    collection: "application_events",
    timestamps: false, // we manage timestamp manually
  }
);

// Compound index for efficient user event queries
ApplicationEventSchema.index({ userId: 1, timestamp: -1 });
ApplicationEventSchema.index({ eventType: 1, timestamp: -1 });

export const ApplicationEvent =
  mongoose.models.ApplicationEvent ||
  mongoose.model<IApplicationEvent>("ApplicationEvent", ApplicationEventSchema);
