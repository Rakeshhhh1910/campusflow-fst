/**
 * models/ActivityEvent.ts
 * Mongoose model for activity-related events.
 * Stored in MongoDB — tracks registrations, cancellations, view events.
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IActivityEvent extends Document {
  eventType: "ACTIVITY_VIEWED" | "REGISTRATION_CREATED" | "REGISTRATION_CANCELLED" | "ACTIVITY_INTEREST_ADDED" | "ACTIVITY_INTEREST_REMOVED";
  activityId: string;    // References Activity.id from PostgreSQL
  activityTitle: string; // Denormalized for fast query without JOIN
  userId: string;        // References User.id from PostgreSQL
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const ActivityEventSchema = new Schema<IActivityEvent>(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["ACTIVITY_VIEWED", "REGISTRATION_CREATED", "REGISTRATION_CANCELLED", "ACTIVITY_INTEREST_ADDED", "ACTIVITY_INTEREST_REMOVED"],
      index: true,
    },
    activityId: { type: String, required: true, index: true },
    activityTitle: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    collection: "activity_events",
    timestamps: false,
  }
);

ActivityEventSchema.index({ activityId: 1, timestamp: -1 });
ActivityEventSchema.index({ userId: 1, timestamp: -1 });

export const ActivityEvent =
  mongoose.models.ActivityEvent ||
  mongoose.model<IActivityEvent>("ActivityEvent", ActivityEventSchema);
