import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let activity = null;

  try {
    activity = await prisma.activity.findUnique({
      where: { id },
      select: {
        title: true,
        category: true,
        location: true,
        date: true,
        capacity: true,
      },
    });
  } catch {
    // Graceful fallback if db is offline or error
  }

  const title = activity?.title || "Campus Activity Details";
  const category = activity?.category || "EVENT";
  const location = activity?.location || "Main Campus";
  const dateStr = activity?.date
    ? new Date(activity.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Upcoming";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0b0f19",
          backgroundImage: "linear-gradient(to bottom right, #0b0f19, #1e1b4b)",
          padding: "70px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(129, 140, 248, 0.4)",
              color: "#a5b4fc",
              fontSize: "16px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {category}
          </div>
          <span style={{ color: "#94a3b8", fontSize: "18px" }}>• CampusFlow Activities</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: "1000px",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px",
            fontSize: "20px",
            color: "#cbd5e1",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📅</span>
            <span>{dateStr}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📍</span>
            <span>{location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <span style={{ color: "#818cf8", fontWeight: 700 }}>CampusFlow</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
