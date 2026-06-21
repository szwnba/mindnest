import { ImageResponse } from "next/og";
import { getTypeByCode, type TypeGroup } from "@/lib/data/personality-types";

export const runtime = "nodejs";
export const alt = "MindNest 人格类型分享图";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 类型详情页 OG（Next.js 约定式：app/types/[code]/opengraph-image.tsx）
 *
 * Next.js 会自动为 /types/INTJ 等路由注入：
 *   <meta property="og:image" content="<generated>" />
 *
 * 设计：根据 group 取主题色 + 大字类型代码 + 中文名 + shortDesc + 品牌底纹
 */

// 每个 group 的主题色（与首页 OG 风格统一的莫兰迪色系）
const GROUP_THEME: Record<
  TypeGroup,
  { from: string; to: string; accent: string; label: string }
> = {
  analyst: { from: "#3D5A6B", to: "#5C7A8D", accent: "#A8C5D6", label: "分析家 NT" },
  diplomat: { from: "#3F5A45", to: "#5A7E60", accent: "#B5CDB8", label: "外交家 NF" },
  sentinel: { from: "#534570", to: "#7466A0", accent: "#C5BBE0", label: "守卫者 SJ" },
  explorer: { from: "#8A4F3F", to: "#C4775B", accent: "#E8C0A8", label: "探险家 SP" },
};

interface ImageProps {
  params: Promise<{ code: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { code } = await params;
  const type = getTypeByCode(code);

  // 找不到时降级
  const theme = type ? GROUP_THEME[type.group] : GROUP_THEME.analyst;
  const displayCode = type?.code ?? code.toUpperCase();
  const displayNameZh = type?.nameZh ?? "未知类型";
  const displayNameEn = type?.nameEn ?? "";
  const displayDesc = type?.shortDesc ?? "";
  const displayIcon = type?.icon ?? "✦";
  const groupLabel = type ? theme.label : "MindNest";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
          color: "#ffffff",
          padding: "64px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* 装饰光斑 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -100,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accent}22 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* 顶部品牌行 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, display: "flex" }}>
              MindNest
            </span>
            <span style={{ opacity: 0.5, display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>心栖</span>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              border: `1px solid ${theme.accent}55`,
              fontSize: 18,
              letterSpacing: 2,
              display: "flex",
            }}
          >
            {groupLabel}
          </div>
        </div>

        {/* 主内容 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 60, lineHeight: 1, display: "flex", marginBottom: 8 }}>
            {displayIcon}
          </div>

          {/* 大字代码 */}
          <div
            style={{
              fontSize: 200,
              fontWeight: 700,
              letterSpacing: 16,
              lineHeight: 1,
              color: "#ffffff",
              textShadow: `0 4px 24px ${theme.from}88`,
              display: "flex",
            }}
          >
            {displayCode}
          </div>

          {/* 中文名 */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: 12,
              marginTop: 8,
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <span style={{ display: "flex" }}>{displayNameZh}</span>
            {displayNameEn && (
              <span
                style={{
                  fontSize: 28,
                  color: theme.accent,
                  fontStyle: "italic",
                  letterSpacing: 4,
                  display: "flex",
                }}
              >
                {displayNameEn}
              </span>
            )}
          </div>

          {/* 描述 */}
          {displayDesc && (
            <div
              style={{
                fontSize: 26,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.5,
                marginTop: 28,
                maxWidth: 980,
                letterSpacing: 1,
                display: "flex",
              }}
            >
              {displayDesc}
            </div>
          )}
        </div>

        {/* 底部 CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 1,
            paddingTop: 24,
            borderTop: `1px solid ${theme.accent}33`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex" }}>28 题 Likert · 整合 6 大权威心理学框架</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "flex" }}>mindnest-six.vercel.app</span>
            <span style={{ color: theme.accent, display: "flex" }}>→</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
