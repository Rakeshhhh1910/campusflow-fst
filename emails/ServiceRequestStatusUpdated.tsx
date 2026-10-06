/**
 * emails/ServiceRequestStatusUpdated.tsx
 * React Email template — sent when admin updates a service request status.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ServiceRequestStatusUpdatedEmailProps {
  studentName: string;
  requestTitle: string;
  previousStatus: string;
  newStatus: string;
  adminNotes?: string;
  requestId: string;
  appUrl: string;
}

const statusConfig: Record<string, { label: string; color: string; emoji: string }> = {
  PENDING: { label: "Pending", color: "#f59e0b", emoji: "⏳" },
  IN_REVIEW: { label: "In Review", color: "#3b82f6", emoji: "🔍" },
  APPROVED: { label: "Approved", color: "#22c55e", emoji: "✅" },
  REJECTED: { label: "Rejected", color: "#ef4444", emoji: "❌" },
  RESOLVED: { label: "Resolved", color: "#8b5cf6", emoji: "🎉" },
};

export const ServiceRequestStatusUpdatedEmail = ({
  studentName = "Student",
  requestTitle = "Campus WiFi Issue",
  previousStatus = "PENDING",
  newStatus = "APPROVED",
  adminNotes,
  requestId = "clxxx",
  appUrl = "http://localhost:3000",
}: ServiceRequestStatusUpdatedEmailProps) => {
  const status = statusConfig[newStatus] || { label: newStatus, color: "#333", emoji: "📋" };

  return (
    <Html>
      <Head />
      <Preview>
        {status.emoji} Your request "{requestTitle}" is now {status.label} — CampusFlow
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-10 px-4 max-w-xl">
            <Section className="bg-indigo-600 rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-white text-2xl font-bold m-0">🎓 CampusFlow</Heading>
              <Text className="text-indigo-200 text-sm m-0 mt-1">Student Service & Activity Platform</Text>
            </Section>

            <Section className="bg-white px-8 py-8 rounded-b-lg shadow-sm">
              <Heading as="h2" className="text-gray-800 text-xl font-semibold">
                Request Status Updated {status.emoji}
              </Heading>
              <Text className="text-gray-700">Hi <strong>{studentName}</strong>,</Text>
              <Text className="text-gray-700">
                The status of your service request has been updated by our team.
              </Text>

              <Section className="bg-gray-50 rounded-lg p-5 my-4 border border-gray-200">
                <Text className="text-gray-800 font-semibold m-0 mb-3">📋 Status Update</Text>
                <Text className="text-gray-700 m-0"><strong>Request:</strong> {requestTitle}</Text>
                <Text className="text-gray-700 m-0">
                  <strong>Previous Status:</strong>{" "}
                  <span style={{ color: statusConfig[previousStatus]?.color || "#666" }}>
                    {statusConfig[previousStatus]?.label || previousStatus}
                  </span>
                </Text>
                <Text className="text-gray-700 m-0">
                  <strong>New Status:</strong>{" "}
                  <span style={{ color: status.color, fontWeight: "bold" }}>
                    {status.emoji} {status.label}
                  </span>
                </Text>
                {adminNotes && (
                  <Section className="bg-blue-50 rounded p-3 mt-3 border-l-4 border-blue-400">
                    <Text className="text-blue-800 m-0 text-sm font-semibold">Admin Notes:</Text>
                    <Text className="text-blue-700 m-0 text-sm">{adminNotes}</Text>
                  </Section>
                )}
                <Text className="text-gray-500 text-xs m-0 mt-2">Request ID: {requestId}</Text>
              </Section>

              <Button
                href={`${appUrl}/requests`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-center block mx-auto"
              >
                View My Requests →
              </Button>

              <Hr className="border-gray-200 my-6" />
              <Text className="text-gray-500 text-xs text-center">
                © 2026 CampusFlow. DJS23AMD302 — Fullstack Development with NextJs.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ServiceRequestStatusUpdatedEmail;
