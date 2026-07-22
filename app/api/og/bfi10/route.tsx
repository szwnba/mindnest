import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DIM_LABELS: Record<string, { zh: string; color: string }> = {
  O: { zh: "开放性", color: "#7eb8da" },
  C: { zh: "尽责性", color: "#c9b458" },
  E: { zh: "外向性", color: "#e88d7a" },
  A: { zh: "宜人性", color: "#a88cd5" },
  N: { zh: "神经质", color: "#d4879a" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dims = (["O", "C", "E", "A", "N"] as const).map((key) => {
    const val = parseInt(searchParams.get(key) || "50", 10);
    const meta = DIM_LABELS[key];
    return { key, zh: meta.zh, val, color: meta.color };
  });

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
          padding: 48,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 700, color: "#c9b458" }}>
            大五人格
          </span>
          <span style={{ fontSize: 28, fontWeight: 400, color: "#8899aa" }}>
            BFI-10
          </span>
        </div>

        <p
          style={{
            fontSize: 22,
            color: "#8899aa",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {SITE_NAME} · 人格测评
        </p>

        {/* Dimension bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 500,
          }}
        >
          {dims.map((d) => (
            <div
              key={d.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: d.color,
                  width: 32,
                }}
              >
                {d.key}
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#667788",
                  width: 56,
                }}
              >
                {d.zh}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  background: "#2a2a4e",
                  borderRadius: 11,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${d.val}%`,
                    height: "100%",
                    background: d.color,
                    borderRadius: 11,
                  }}
                />
              </div>
              <span style={{ fontSize: 18, color: "#8899aa", width: 32 }}>
                {d.val}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: 32,
            fontSize: 16,
            color: "#667788",
          }}
        >
          认识你自己，是一切成长的起点
        </p>
      </div>
    ),
    { ...size },
  );
}