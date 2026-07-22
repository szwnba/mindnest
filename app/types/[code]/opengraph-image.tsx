import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

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
            fontSize: 80,
            fontWeight: 700,
            color: "#c9b458",
            marginBottom: 8,
          }}
        >
          {code}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8899aa",
            letterSpacing: "2px",
          }}
        >
          {SITE_NAME} · 人格类型详解
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 16,
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