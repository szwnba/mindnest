"use client";

import { useMemo } from "react";

interface RadarChartProps {
  /** 维度数据，最少 3 项 */
  data: { label: string; value: number; letter?: string; emoji?: string }[];
  /** 尺寸（正方形），默认 240 */
  size?: number;
  /** 颜色 token（CSS 变量名，如 "--sage"），默认 "--sage" */
  color?: string;
  /** 中心显示文字（如人格代码） */
  centerLabel?: string;
  /** 额外 CSS 类名 */
  className?: string;
  /** 主标题（用于 aria-label 前缀） */
  ariaTitle?: string;
}

/**
 * 纯 SVG 雷达图组件
 * - 根据 data.length 自动绘制正 N 边形
 * - 背景 3 圈同心多边形（虚线）
 * - 数据区域半透明填充 + 实色描边
 * - 每个维度顶点：小圆点 + 外侧 label
 * - 中心可选显示大字（如 "INTJ"）
 * - 入场动画 scale(0) → scale(1)，0.6s ease-out
 * - prefers-reduced-motion 兼容
 */
export default function RadarChart({
  data,
  size = 240,
  color = "--sage",
  centerLabel,
  className = "",
  ariaTitle,
}: RadarChartProps) {
  const N = data.length;
  const cx = size / 2;
  const cy = size / 2;
  // 最大半径：留出 label 空间
  const maxR = size * 0.36;
  // label 距离顶点的额外半径
  const labelR = size * 0.12;

  // 计算每个维度的顶点坐标
  const vertices = useMemo(() => {
    return data.map((_, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      return {
        x: cx + maxR * Math.cos(angle),
        y: cy + maxR * Math.sin(angle),
        angle,
      };
    });
  }, [data, cx, cy, maxR, N]);

  // 数据多边形顶点
  const dataPoints = useMemo(() => {
    return data.map((d, i) => {
      const r = (d.value / 100) * maxR;
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      };
    });
  }, [data, cx, cy, maxR, N]);

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // 背景同心多边形（3 圈：33%、66%、100%）
  const gridLevels = [0.33, 0.66, 1.0];

  // label 位置（emoji 单独换行显示在标签上方）
  const labels = useMemo(() => {
    return data.map((d, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      const r = maxR + labelR;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        label: d.label,
        letter: d.letter,
        emoji: d.emoji,
        value: d.value,
      };
    });
  }, [data, cx, cy, maxR, labelR, N]);

  const gridColor = `var(${color}, #6b8a6b)`;
  const fillColor = `var(${color}, #6b8a6b)`;

  // aria-label 描述
  const ariaLabel = `${ariaTitle ?? `${N} 维度雷达图`}：${data
    .map((d) => `${d.label} ${Math.round(d.value)}%`)
    .join("，")}`;

  return (
    <div
      className={`radar-chart-wrapper ${className}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        style={{
          animation: "radar-enter 0.6s ease-out both",
          maxWidth: "100%",
          height: "auto",
        }}
      >
        {/* 背景同心多边形 */}
        {gridLevels.map((level, idx) => {
          const points = vertices
            .map((v) => {
              const r = maxR * level;
              const angle = (2 * Math.PI * vertices.indexOf(v)) / N - Math.PI / 2;
              return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
            })
            .join(" ");
          return (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke={gridColor}
              strokeWidth={idx === 2 ? 1 : 0.8}
              strokeDasharray={idx < 2 ? "3,3" : "none"}
              opacity={idx === 2 ? 0.3 : 0.2}
            />
          );
        })}

        {/* 从中心到各顶点的连线（轴线） */}
        {vertices.map((v, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={v.x}
            y2={v.y}
            stroke={gridColor}
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}

        {/* 数据区域多边形 */}
        <polygon
          points={dataPolygon}
          fill={fillColor}
          fillOpacity={0.25}
          stroke={fillColor}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* 数据点 + 外侧 label */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            {/* 数据顶点圆点 */}
            <circle cx={p.x} cy={p.y} r={3.5} fill={fillColor} />
            {/* 维度 label（emoji + 文字） */}
            {labels[i].emoji && (
              <text
                x={labels[i].x}
                y={labels[i].y - 8}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontFamily="sans-serif"
              >
                {labels[i].emoji}
              </text>
            )}
            <text
              x={labels[i].x}
              y={labels[i].y + (labels[i].emoji ? 6 : 0)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontFamily="sans-serif"
              fill="currentColor"
              opacity={0.85}
            >
              {labels[i].label}
            </text>
          </g>
        ))}

        {/* 中心文字 */}
        {centerLabel && (
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={N <= 4 ? 28 : 22}
            fontWeight={700}
            fontFamily="serif"
            fill={fillColor}
            letterSpacing="2"
          >
            {centerLabel}
          </text>
        )}
      </svg>

      {/* 注入动画 keyframes（仅一次） */}
      <style>{`
        @keyframes radar-enter {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .radar-chart-wrapper svg {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
