import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

/* ─── Fonts via next/font (自动子集化 + self-host，修复 QA §5.2) ─── */
const fontDisplayLatin = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const fontDisplayCJK = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  preload: false, // 中文字体体积大，按需加载
});

const fontBody = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "MindNest Team" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // QA-V2 P1-NEW-3：补 og:image / twitter:image。
    // 实际图片由 app/opengraph-image.tsx 通过 next/og 动态生成（1200×630）。
    // 这里显式声明，避免某些抓取器忽略 file-convention 推断。
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "心栖 MindNest · 专业人格心理测评平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "MindNest",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "zh-CN",
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${fontDisplayLatin.variable} ${fontDisplayCJK.variable} ${fontBody.variable}`}
      style={
        {
          // 把 next/font 注入的 CSS 变量绑定到原型 token，保证字体名继续生效
          // (CSS 里的 var(--font-display) 等仍指向原型那串字符串；这里把 fallback 升级为 next/font)
          ["--font-body" as string]: `var(--font-noto-sans-sc), 'Noto Sans SC', -apple-system, sans-serif`,
          ["--font-display" as string]: `var(--font-cormorant), var(--font-noto-serif-sc), 'Cormorant Garamond', 'Noto Serif SC', Georgia, serif`,
        } as React.CSSProperties
      }
    >
      <body>
        {/* Skip-to-content：键盘 Tab 第一站 */}
        <a className="skip-to-content" href="#main">
          跳转到主内容
        </a>
        {children}
        {/* JSON-LD：Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
