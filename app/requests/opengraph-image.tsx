import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0f172a",
          padding: "70px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📋</span>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#38bdf8" }}>
            CampusFlow Service Desk
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: "960px",
              margin: 0,
            }}
          >
            Track and Submit Campus Service & Facility Inquiries
          </h1>
          <p style={{ fontSize: "22px", color: "#94a3b8", margin: 0, maxWidth: "800px" }}>
            End-to-end type-safe submissions with real-time audit logs and notification streams.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "18px",
            color: "#64748b",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <span>Maintenance • IT Support • Library • Canteen</span>
          <span style={{ color: "#38bdf8", fontWeight: 600 }}>CampusFlow Portal</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
