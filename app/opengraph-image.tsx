import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_ALT_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} · ${SITE_ALT_TAGLINE}`;
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
          background: "linear-gradient(135deg, #2d3e3f 0%, #1a2a2b 50%, #3d4f50 100%)",
          fontFamily: '"Noto Sans SC", "Noto Sans", sans-serif',
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: 200,
            background: "rgba(129, 163, 142, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: 250,
            background: "rgba(129, 163, 142, 0.06)",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#81a38e",
              letterSpacing: "0.02em",
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#81a38e",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#c8d4cc",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 700,
            letterSpacing: "0.03em",
          }}
        >
          {SITE_ALT_TAGLINE}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            color: "#889a91",
            marginTop: 20,
            letterSpacing: "0.04em",
          }}
        >
          专业人格心理测评平台 · 免费 · 开源 · 隐私优先
        </div>
      </div>
    ),
    { ...size },
  );
}