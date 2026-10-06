import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CampusFlow — Unified Campus Management";
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
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)",
            }}
          >
            <div style={{ fontSize: "32px" }}>⚡</div>
          </div>
          <span style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Campus<span style={{ color: "#818cf8" }}>Flow</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#818cf8",
              fontSize: "20px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Student Services & Activity Platform
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              margin: 0,
            }}
          >
            Next-Gen Campus Operations Powered by Full-Stack Next.js
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontSize: "18px",
            color: "#a1a1aa",
          }}
        >
          <span>✦ Next.js App Router (RSC)</span>
          <span>✦ Prisma & PostgreSQL</span>
          <span>✦ MongoDB Event Logging</span>
          <span>✦ Better Auth</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
