/**
 * emails/CriticalActivityAlert.tsx
 * React Email template — sent for critical campus activity alerts.
 * Example: Activity cancelled, capacity full, urgent notice.
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

interface CriticalActivityAlertEmailProps {
  studentName: string;
  activityTitle: string;
  alertType: "CAPACITY_FULL" | "ACTIVITY_CANCELLED" | "SCHEDULE_CHANGED" | "IMPORTANT_NOTICE";
  message: string;
  activityId: string;
  appUrl: string;
}

const alertConfig = {
  CAPACITY_FULL: { emoji: "🚫", title: "Activity Capacity Full", color: "#ef4444" },
  ACTIVITY_CANCELLED: { emoji: "❌", title: "Activity Cancelled", color: "#dc2626" },
  SCHEDULE_CHANGED: { emoji: "📅", title: "Schedule Changed", color: "#f59e0b" },
  IMPORTANT_NOTICE: { emoji: "📢", title: "Important Notice", color: "#3b82f6" },
};

export const CriticalActivityAlertEmail = ({
  studentName = "Student",
  activityTitle = "Annual Tech Fest",
  alertType = "IMPORTANT_NOTICE",
  message = "There is an important update regarding this activity.",
  activityId = "clxxx",
  appUrl = "http://localhost:3000",
}: CriticalActivityAlertEmailProps) => {
  const config = alertConfig[alertType];

  return (
    <Html>
      <Head />
      <Preview>
        {config.emoji} {config.title}: {activityTitle} — CampusFlow
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-10 px-4 max-w-xl">
            <Section className="bg-indigo-600 rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-white text-2xl font-bold m-0">🎓 CampusFlow</Heading>
              <Text className="text-indigo-200 text-sm m-0 mt-1">Student Service & Activity Platform</Text>
            </Section>

            <Section className="bg-white px-8 py-8 rounded-b-lg shadow-sm">
              {/* Alert Banner */}
              <Section
                className="rounded-lg p-4 my-4 text-center"
                style={{ backgroundColor: `${config.color}15`, border: `2px solid ${config.color}` }}
              >
                <Text className="text-3xl m-0">{config.emoji}</Text>
                <Heading as="h2" className="font-bold m-0 mt-1" style={{ color: config.color }}>
                  {config.title}
                </Heading>
              </Section>

              <Text className="text-gray-700">Hi <strong>{studentName}</strong>,</Text>
              <Text className="text-gray-700">
                There is an important update regarding an activity you are registered for or interested in.
              </Text>

              <Section className="bg-gray-50 rounded-lg p-5 my-4 border border-gray-200">
                <Text className="text-gray-800 font-semibold m-0 mb-2">🎭 Activity Details</Text>
                <Text className="text-gray-700 m-0"><strong>Activity:</strong> {activityTitle}</Text>
                <Text className="text-gray-700 m-0 mt-2">{message}</Text>
              </Section>

              <Button
                href={`${appUrl}/activities/${activityId}`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-center block mx-auto"
              >
                View Activity Details →
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

export default CriticalActivityAlertEmail;
