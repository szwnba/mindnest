import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心栖 · MindNest — 专业人格心理测评平台",
  description:
    "心栖 MindNest 是一个专业的人格心理测评平台，提供基于科学量表的人格分析、自我探索与成长建议。",
  keywords: ["心理测评", "人格分析", "MBTI", "Big Five", "MindNest", "心栖"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
