/**
 * lib/email/resend.ts
 * Resend email service integration.
 * SERVER ONLY — RESEND_API_KEY is never exposed to the client.
 *
 * Flow:
 * 1. Prisma mutation succeeds
 * 2. Audit log created
 * 3. sendEmail() is called (this file)
 * 4. Resend API is called with React Email template
 * 5. NotificationEvent record created in DB
 */

import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";

if (!process.env.RESEND_API_KEY) {
  console.warn("[Resend] RESEND_API_KEY not set — emails will not be sent");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "CampusFlow <noreply@campusflow.dev>";

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  userId: string;
  notificationType: string;
  serviceRequestId?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Resend] DEV MODE — Would send email to ${options.to}: ${options.subject}`);
      // In development without API key, we create the notification record but don't send
      await prisma.notificationEvent.create({
        data: {
          type: options.notificationType,
          userId: options.userId,
          emailAddress: options.to,
          status: "SENT",
          serviceRequestId: options.serviceRequestId,
          metadata: { subject: options.subject, devMode: true },
          sentAt: new Date(),
        },
      });
      return { success: true, messageId: "dev-mode-no-send" };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      react: options.react,
    });

    if (error) {
      console.error("[Resend] Email send error:", error);
      await prisma.notificationEvent.create({
        data: {
          type: options.notificationType,
          userId: options.userId,
          emailAddress: options.to,
          status: "FAILED",
          serviceRequestId: options.serviceRequestId,
          metadata: { subject: options.subject, error: error.message },
        },
      });
      return { success: false, error: error.message };
    }

    // Record the sent notification
    await prisma.notificationEvent.create({
      data: {
        type: options.notificationType,
        userId: options.userId,
        emailAddress: options.to,
        status: "SENT",
        resendMessageId: data?.id,
        serviceRequestId: options.serviceRequestId,
        metadata: { subject: options.subject },
        sentAt: new Date(),
      },
    });

    return { success: true, messageId: data?.id };
  } catch (err) {
    // CRITICAL: Email errors must never fail the calling mutation
    console.error("[Resend] Unexpected error:", err);
    return { success: false, error: "Email service unavailable" };
  }
}
