import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

/**
 * 全站默认 OG 封面（QA-V2 P1-NEW-3）。
 * 部署到 Vercel 时由 next/og 在构建期/请求期生成 1200×630 PNG。
 *
 * 设计：温色背景 + 品牌中文名 + 副标题 + sage 装饰圆，
 * 不依赖外部字体（仅用系统默认 sans-serif，Satori 会用 Noto fallback 渲染中文）。
 */

export const runtime = "nodejs";
export const alt = "心栖 MindNest · 专业人格心理测评平台";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #FBF7F1 0%, #F5EDE2 60%, #EFE6D8 100%)",
          color: "#2C2417",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* sage 装饰圆 — 左上 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(90, 126, 96, 0.18)",
            display: "flex",
          }}
        />
        {/* terracotta 装饰圆 — 右下 */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(196, 119, 91, 0.14)",
            display: "flex",
          }}
        />
        {/* sage 小点 — 右上点缀 */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 120,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#5A7E60",
            display: "flex",
          }}
        />
        {/* sage 中点 */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 140,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#4F7555",
            display: "flex",
          }}
        />

        {/* 顶部 logo bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #5A7E60, #4F7555)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            心
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#5A4F42",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            MINDNEST
          </div>
        </div>

        {/* 主标题 */}
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#2C2417",
            display: "flex",
          }}
        >
          {SITE_NAME}
        </div>

        {/* 副标题 */}
        <div
          style={{
            marginTop: 28,
            fontSize: 38,
            color: "#5A4F42",
            fontWeight: 500,
            letterSpacing: 4,
            display: "flex",
          }}
        >
          专业人格心理测评平台
        </div>

        {/* 底部小字 */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#6F614F",
            letterSpacing: 2,
          }}
        >
          <span style={{ display: "flex" }}>认识自己 · 是一切成长的起点</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
