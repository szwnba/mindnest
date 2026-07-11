import { ImageResponse } from "next/og";

export const size = { width: 120, height: 120 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a2e",
          borderRadius: "50%",
        }}
      >
        <span style={{ fontSize: 64, color: "#c9b458" }}>心</span>
      </div>
    ),
    { ...size },
  );
}