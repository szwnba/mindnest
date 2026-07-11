import { ImageResponse } from "next/og";

export const alt = "心栖 MindNest · 专业人格心理测评平台";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          color: "#e0e0e0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#c9b458" }}>
            心栖
          </span>
          <span style={{ fontSize: 40, fontWeight: 400, color: "#8899aa" }}>
            MindNest
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8899aa",
            letterSpacing: "2px",
          }}
        >
          专业人格心理测评平台
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "#667788",
          }}
        >
          认识你自己，是一切成长的起点
        </div>
      </div>
    ),
    { ...size },
  );
}