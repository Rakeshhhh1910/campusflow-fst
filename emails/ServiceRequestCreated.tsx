/**
 * emails/ServiceRequestCreated.tsx
 * React Email template — sent when a student creates a new service request.
 * Uses @react-email/components for JSX-based email rendering.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ServiceRequestCreatedEmailProps {
  studentName: string;
  requestTitle: string;
  requestCategory: string;
  requestPriority: string;
  requestId: string;
  appUrl: string;
}

export const ServiceRequestCreatedEmail = ({
  studentName = "Student",
  requestTitle = "Campus WiFi Issue",
  requestCategory = "IT_SUPPORT",
  requestPriority = "HIGH",
  requestId = "clxxx",
  appUrl = "http://localhost:3000",
}: ServiceRequestCreatedEmailProps) => {
  const priorityColor: Record<string, string> = {
    LOW: "#22c55e",
    MEDIUM: "#f59e0b",
    HIGH: "#ef4444",
    URGENT: "#dc2626",
  };

  return (
    <Html>
      <Head />
      <Preview>Your service request "{requestTitle}" has been received — CampusFlow</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-10 px-4 max-w-xl">
            {/* Header */}
            <Section className="bg-indigo-600 rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-white text-2xl font-bold m-0">
                🎓 CampusFlow
              </Heading>
              <Text className="text-indigo-200 text-sm m-0 mt-1">
                Student Service & Activity Platform
              </Text>
            </Section>

            {/* Body */}
            <Section className="bg-white px-8 py-8 rounded-b-lg shadow-sm">
              <Heading as="h2" className="text-gray-800 text-xl font-semibold">
                Request Received ✅
              </Heading>
              <Text className="text-gray-700">
                Hi <strong>{studentName}</strong>,
              </Text>
              <Text className="text-gray-700">
                Your campus service request has been successfully submitted. Our team will review it shortly.
              </Text>

              {/* Request Details Card */}
              <Section className="bg-gray-50 rounded-lg p-5 my-4 border border-gray-200">
                <Text className="text-gray-800 font-semibold m-0 mb-2">📋 Request Details</Text>
                <Text className="text-gray-700 m-0">
                  <strong>Title:</strong> {requestTitle}
                </Text>
                <Text className="text-gray-700 m-0">
                  <strong>Category:</strong> {requestCategory.replace("_", " ")}
                </Text>
                <Text className="text-gray-700 m-0">
                  <strong>Priority:</strong>{" "}
                  <span style={{ color: priorityColor[requestPriority] || "#333" }}>
                    {requestPriority}
                  </span>
                </Text>
                <Text className="text-gray-500 text-sm m-0 mt-2">
                  Request ID: {requestId}
                </Text>
              </Section>

              <Text className="text-gray-700">
                You will receive another email when your request status is updated. You can also track it in your dashboard.
              </Text>

              <Button
                href={`${appUrl}/requests`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-center block mx-auto"
              >
                Track My Request →
              </Button>

              <Hr className="border-gray-200 my-6" />
              <Text className="text-gray-500 text-xs text-center">
                © 2026 CampusFlow. DJS23AMD302 — Fullstack Development with NextJs.
                <br />
                This is a transactional email sent because you submitted a service request.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ServiceRequestCreatedEmail;
