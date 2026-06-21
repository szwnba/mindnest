import { ImageResponse } from "next/og";

export const runtime = "nodejs";

/**
 * BFI-10 大五人格结果分享 OG
 *
 * URL 示例：
 *   /api/og/bfi10?O=72&C=58&E=33&A=65&N=42
 *
 * 视觉：燕麦米渐变 + 5 维度垂直条形图 + 「高/中/低」简短描述。
 * 注：ImageResponse 不支持完整 SVG（雷达图），故改用 5 列条形图模拟全景。
 */

function clampPct(raw: string | null): number {
  if (raw === null) return 50;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return 50;
  return Math.max(0, Math.min(100, n));
}

function levelOf(pct: number): { label: string; color: string } {
  if (pct >= 60) return { label: "高", color: "#5A7E60" };
  if (pct <= 40) return { label: "低", color: "#C4775B" };
  return { label: "中", color: "#B8935A" };
}

const DIM_META = [
  { key: "O", zh: "开放性", color: "#7BA4B8" },
  { key: "C", zh: "尽责性", color: "#5A7E60" },
  { key: "E", zh: "外向性", color: "#B8935A" },
  { key: "A", zh: "宜人性", color: "#9B8EC4" },
  { key: "N", zh: "神经质", color: "#C4775B" },
] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const p = url.searchParams;

  const values = {
    O: clampPct(p.get("O")),
    C: clampPct(p.get("C")),
    E: clampPct(p.get("E")),
    A: clampPct(p.get("A")),
    N: clampPct(p.get("N")),
  };

  // 找出最高 + 最低维度做副标
  let topKey: keyof typeof values = "O";
  let topVal = -1;
  let lowKey: keyof typeof values = "O";
  let lowVal = 101;
  (Object.keys(values) as (keyof typeof values)[]).forEach((k) => {
    if (values[k] > topVal) {
      topVal = values[k];
      topKey = k;
    }
    if (values[k] < lowVal) {
      lowVal = values[k];
      lowKey = k;
    }
  });
  const topMeta = DIM_META.find((d) => d.key === topKey)!;
  const lowMeta = DIM_META.find((d) => d.key === lowKey)!;
  const topLevel = levelOf(topVal);
  const lowLevel = levelOf(lowVal);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #F5EFE3 0%, #EFF5F0 100%)",
          color: "#2A3D2E",
          padding: "56px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 顶部品牌行 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(42,61,46,0.7)",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#2A3D2E",
                display: "flex",
              }}
            >
              MindNest
            </span>
            <span style={{ opacity: 0.4, display: "flex" }}>·</span>
            <span style={{ display: "flex" }}>我的大五人格</span>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(90,126,96,0.12)",
              fontSize: 16,
              letterSpacing: 2,
              color: "#5A7E60",
              display: "flex",
            }}
          >
            BFI-10 · 国际通用量表
          </div>
        </div>

        {/* 标题 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: 8,
            marginTop: 28,
            color: "#2A3D2E",
            display: "flex",
          }}
        >
          大五人格画像
        </div>

        {/* 副描述 */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(42,61,46,0.7)",
            marginTop: 12,
            display: "flex",
            gap: 18,
            alignItems: "center",
            letterSpacing: 1,
          }}
        >
          <span style={{ color: topLevel.color, fontWeight: 600, display: "flex" }}>
            {topLevel.label}
            {topMeta.zh}
          </span>
          <span style={{ opacity: 0.4, display: "flex" }}>·</span>
          <span style={{ color: lowLevel.color, fontWeight: 600, display: "flex" }}>
            {lowLevel.label}
            {lowMeta.zh}
          </span>
          <span style={{ opacity: 0.4, display: "flex" }}>·</span>
          <span style={{ display: "flex" }}>5 维度全景</span>
        </div>

        {/* 5 维度垂直条形图 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginTop: 32,
            padding: "0 24px",
          }}
        >
          {DIM_META.map((d) => {
            const val = values[d.key];
            const barHeight = Math.max(20, (val / 100) * 280);
            return (
              <div
                key={d.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  gap: 12,
                }}
              >
                {/* 数值 */}
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: d.color,
                    display: "flex",
                  }}
                >
                  {val}
                </div>

                {/* bar 区 */}
                <div
                  style={{
                    width: "100%",
                    height: 280,
                    display: "flex",
                    alignItems: "flex-end",
                    background: "rgba(42,61,46,0.05)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: barHeight,
                      background: `linear-gradient(180deg, ${d.color}cc 0%, ${d.color} 100%)`,
                      borderRadius: 8,
                      display: "flex",
                    }}
                  />
                </div>

                {/* 维度名 */}
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#2A3D2E",
                    letterSpacing: 2,
                    display: "flex",
                  }}
                >
                  {d.zh}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: d.color,
                    letterSpacing: 2,
                    display: "flex",
                  }}
                >
                  {d.key}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部 CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(42,61,46,0.6)",
            letterSpacing: 1,
            paddingTop: 20,
            borderTop: "1px solid rgba(42,61,46,0.15)",
            marginTop: 12,
          }}
        >
          <span style={{ display: "flex" }}>在 MindNest 测出你的大五画像 →</span>
          <span style={{ color: "#5A7E60", display: "flex" }}>mindnest-six.vercel.app</span>
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
