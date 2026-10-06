/**
 * app/api/webhooks/resend/route.ts
 * Resend Webhook Handler.
 * 
 * Demonstrates:
 * 1. Webhook authenticity verification (crypto timingSafeEqual or signing secret)
 * 2. Handling email.delivered, email.bounced, email.complained events
 * 3. Updating NotificationEvent status in PostgreSQL via Prisma
 * 4. Graceful error handling and audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { logApplicationEvent } from "@/lib/mongoose/events";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("resend-signature") || request.headers.get("svix-signature");
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Webhook authenticity verification (Req A2-EM-12)
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac("sha256", webhookSecret);
      const digest = hmac.update(rawBody).digest("hex");
      
      const sigBuffer = Buffer.from(signature);
      const digestBuffer = Buffer.from(digest);

      if (sigBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(sigBuffer, digestBuffer)) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    let payload: { type?: string; data?: { email_id?: string; to?: string[]; created_at?: string } };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = payload.type;
    const emailId = payload.data?.email_id;
    const recipient = payload.data?.to?.[0];

    // Handle delivery, bounce, complaint events (Req A2-EM-10, A2-EM-11)
    if (emailId) {
      let notificationStatus = "PENDING";
      if (eventType === "email.delivered") {
        notificationStatus = "DELIVERED";
      } else if (eventType === "email.bounced") {
        notificationStatus = "BOUNCED";
      } else if (eventType === "email.complained") {
        notificationStatus = "COMPLAINED";
      }

      // Update in PostgreSQL NotificationEvent table
      await prisma.notificationEvent.updateMany({
        where: { resendMessageId: emailId },
        data: {
          status: notificationStatus as any,
        },
      }).catch((e) => {
        console.warn("[Webhook] Could not update NotificationEvent in DB:", e.message);
      });
    }

    // Log event in MongoDB document store
    await logApplicationEvent({
      eventType: "EMAIL_WEBHOOK_RECEIVED",
      userId: "system",
      action: eventType || "UNKNOWN",
      resource: "email",
      resourceId: emailId,
      metadata: {
        recipient,
        type: eventType,
      },
    }).catch(() => {});

    return NextResponse.json({ received: true, type: eventType });
  } catch (error: any) {
    console.error("[Resend Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
