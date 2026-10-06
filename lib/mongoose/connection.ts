/**
 * lib/mongoose/connection.ts
 * Mongoose connection singleton for MongoDB.
 * Used for document-oriented event data (ApplicationEvent, SecurityEvent, ActivityEvent).
 * SERVER ONLY — never import in client components.
 *
 * Why MongoDB for events?
 * - Flexible schema: event metadata varies per event type
 * - High-throughput append-only writes
 * - Easy to add fields without migrations
 * Relational business data stays in PostgreSQL/Prisma.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/campusflow_events";

const globalForMongoose = globalThis as unknown as {
  mongooseConn: typeof mongoose | null;
  mongoosePromise: Promise<typeof mongoose> | null;
  mongodInstance?: any;
};

let cached = globalForMongoose.mongooseConn;
let promise = globalForMongoose.mongoosePromise;

export async function connectMongoDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  if (!promise) {
    promise = (async () => {
      try {
        return await mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 2000,
        });
      } catch (primaryErr) {
        // If local mongod is not running in development/demo, spin up MongoMemoryServer
        if (process.env.NODE_ENV !== "production") {
          try {
            const { MongoMemoryServer } = await import("mongodb-memory-server");
            if (!globalForMongoose.mongodInstance) {
              globalForMongoose.mongodInstance = await MongoMemoryServer.create({
                instance: { port: 27017, dbName: "campusflow_events" },
              });
            }
            const uri = globalForMongoose.mongodInstance.getUri();
            return await mongoose.connect(uri, {
              bufferCommands: false,
            });
          } catch (memErr) {
            console.warn("[MongoDB] Memory server could not start:", memErr);
            throw primaryErr;
          }
        }
        throw primaryErr;
      }
    })();
  }

  try {
    cached = await promise;
    globalForMongoose.mongooseConn = cached;
  } catch (e) {
    promise = null;
    throw e;
  }

  return cached;
}
