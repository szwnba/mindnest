import { ImageResponse } from "next/og";
import { getTypeByCode } from "@/lib/data/personality-types";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.toUpperCase() || "";
  const type = getTypeByCode(code);

  const E = parseInt(searchParams.get("E") || "50", 10);
  const S = parseInt(searchParams.get("S") || "50", 10);
  const T = parseInt(searchParams.get("T") || "50", 10);
  const J = parseInt(searchParams.get("J") || "50", 10);

  const dims = [
    { label: "E", val: E, color: "#c9b458" },
    { label: "S", val: S, color: "#7eb8da" },
    { label: "T", val: T, color: "#a88cd5" },
    { label: "J", val: J, color: "#e88d7a" },
  ];

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
            gap: 8,
            marginBottom: type ? 8 : 32,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 700, color: "#c9b458" }}>
            {type ? type.code : "—"}
          </span>
          {type && (
            <span style={{ fontSize: 32, fontWeight: 400, color: "#8899aa" }}>
              {type.nameZh}
            </span>
          )}
        </div>

        {type && (
          <p
            style={{
              fontSize: 22,
              color: "#8899aa",
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 600,
            }}
          >
            心栖 MindNest · 人格类型
          </p>
        )}

        {/* Dimension bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 420,
          }}
        >
          {dims.map((d) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: d.color,
                  width: 24,
                }}
              >
                {d.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 20,
                  background: "#2a2a4e",
                  borderRadius: 10,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${d.val}%`,
                    height: "100%",
                    background: d.color,
                    borderRadius: 10,
                  }}
                />
              </div>
              <span style={{ fontSize: 18, color: "#8899aa", width: 32 }}>
                {d.val}%
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