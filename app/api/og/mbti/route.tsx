import { ImageResponse } from "next/og";
import { getTypeByCode, type TypeGroup } from "@/lib/data/personality-types";

export const runtime = "nodejs";

/**
 * MBTI 结果分享 OG（动态参数）
 *
 * URL 示例：
 *   /api/og/mbti?code=INTJ&E=70&S=45&T=65&J=80
 *
 * 其中 4 个维度参数值为 0..100：
 *   E = E 端百分比（剩余给 I）
 *   S = S 端百分比（剩余给 N）
 *   T = T 端百分比（剩余给 F）
 *   J = J 端百分比（剩余给 P）
 *
 * 输出 1200×630 PNG。
 */

const GROUP_THEME: Record<TypeGroup, { from: string; to: string; accent: string }> = {
  analyst: { from: "#3D5A6B", to: "#5C7A8D", accent: "#A8C5D6" },
  diplomat: { from: "#3F5A45", to: "#5A7E60", accent: "#B5CDB8" },
  sentinel: { from: "#534570", to: "#7466A0", accent: "#C5BBE0" },
  explorer: { from: "#8A4F3F", to: "#C4775B", accent: "#E8C0A8" },
};

function clampPct(raw: string | null): number | null {
  if (raw === null) return null;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const p = url.searchParams;

  const codeRaw = (p.get("code") || "INTJ").toUpperCase().slice(0, 4);
  const type = getTypeByCode(codeRaw);
  const code = type?.code ?? codeRaw;
  const nameZh = type?.nameZh ?? "";
  const icon = type?.icon ?? "✦";
  const theme = type ? GROUP_THEME[type.group] : GROUP_THEME.analyst;

  const e = clampPct(p.get("E")) ?? 50;
  const s = clampPct(p.get("S")) ?? 50;
  const t = clampPct(p.get("T")) ?? 50;
  const j = clampPct(p.get("J")) ?? 50;

  type Dim = { leftKey: string; rightKey: string; leftLabel: string; rightLabel: string; right: number };
  const dims: Dim[] = [
    { leftKey: "I", rightKey: "E", leftLabel: "内向", rightLabel: "外向", right: e },
    { leftKey: "N", rightKey: "S", leftLabel: "直觉", rightLabel: "实感", right: s },
    { leftKey: "F", rightKey: "T", leftLabel: "情感", rightLabel: "思考", right: t },
    { leftKey: "P", rightKey: "J", leftLabel: "感知", rightLabel: "判断", right: j },
  ];

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
          padding: "56px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 装饰光斑 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* 顶部 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, display: "flex" }}>
              MindNest
            </span>
            <span style={{ opacity: 0.5, display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>我的人格类型</span>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 16,
              letterSpacing: 2,
              display: "flex",
            }}
          >
            MBTI · 28 题
          </div>
        </div>

        {/* 主内容：左标题 右维度条 */}
        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: 28,
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* 左：代码 + 中文名 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              width: 480,
            }}
          >
            <div style={{ fontSize: 72, lineHeight: 1, display: "flex" }}>{icon}</div>
            <div
              style={{
                fontSize: 168,
                fontWeight: 700,
                letterSpacing: 12,
                lineHeight: 1,
                marginTop: 12,
                textShadow: `0 4px 24px ${theme.from}88`,
                display: "flex",
              }}
            >
              {code}
            </div>
            {nameZh && (
              <div
                style={{
                  fontSize: 46,
                  fontWeight: 600,
                  marginTop: 16,
                  letterSpacing: 10,
                  display: "flex",
                }}
              >
                {nameZh}
              </div>
            )}
          </div>

          {/* 右：4 维度横向条 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {dims.map((d, i) => {
              const leftPct = 100 - d.right;
              const rightPct = d.right;
              const leftStronger = leftPct >= rightPct;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 18,
                      letterSpacing: 2,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: leftStronger ? 700 : 400,
                        color: leftStronger ? "#fff" : "rgba(255,255,255,0.6)",
                        display: "flex",
                      }}
                    >
                      {d.leftLabel} {d.leftKey} {leftPct}%
                    </span>
                    <span
                      style={{
                        fontWeight: !leftStronger ? 700 : 400,
                        color: !leftStronger ? "#fff" : "rgba(255,255,255,0.6)",
                        display: "flex",
                      }}
                    >
                      {rightPct}% {d.rightKey} {d.rightLabel}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 14,
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: 7,
                      overflow: "hidden",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: `${leftPct}%`,
                        height: "100%",
                        background: leftStronger ? theme.accent : `${theme.accent}80`,
                        display: "flex",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部 CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 1,
            paddingTop: 18,
            borderTop: `1px solid ${theme.accent}33`,
            marginTop: 16,
          }}
        >
          <span style={{ display: "flex" }}>在 MindNest 测出你的人格 →</span>
          <span style={{ color: theme.accent, fontSize: 18, display: "flex" }}>
            mindnest-six.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Type": "image/png",
      },
    }
  );
}
