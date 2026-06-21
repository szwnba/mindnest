import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getTypeByCode } from "@/lib/data/personality-types";
import { decodeBFI10FromUrl } from "@/lib/bfi10-scoring";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * 分享着陆页：
 *   /share/mbti/INTJ?E=70&S=45&T=65&J=80
 *   /share/bfi10/O72-C58-E33-A65-N42
 *
 * - 此页 metadata 动态生成 OG 图链接（指向 /api/og/mbti?... 或 /api/og/bfi10?...）
 * - 微信 / Twitter / Telegram 抓取此链接时，会自动展示 1200×630 美图卡片
 * - 用户点击进入时，看到结果摘要 + 引导按钮（「我也来测」「查看类型详情」）
 */

interface PageProps {
  params: Promise<{ type: string; code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function clampPctFromSp(s: string | string[] | undefined): number | null {
  if (typeof s !== "string") return null;
  const n = parseInt(s, 10);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { type, code } = await params;
  const sp = await searchParams;
  const kind = type.toLowerCase();

  if (kind === "mbti") {
    const upper = code.toUpperCase();
    const t = getTypeByCode(upper);
    if (!t) {
      return { title: "分享 · 未知类型", robots: { index: false } };
    }

    const e = clampPctFromSp(sp.E);
    const s = clampPctFromSp(sp.S);
    const tv = clampPctFromSp(sp.T);
    const j = clampPctFromSp(sp.J);

    const ogQuery = new URLSearchParams({ code: t.code });
    if (e !== null) ogQuery.set("E", String(e));
    if (s !== null) ogQuery.set("S", String(s));
    if (tv !== null) ogQuery.set("T", String(tv));
    if (j !== null) ogQuery.set("J", String(j));

    const ogUrl = `/api/og/mbti?${ogQuery.toString()}`;
    const title = `${t.code} · ${t.nameZh} — 我的人格类型`;
    const description = t.shortDesc;

    return {
      title,
      description,
      alternates: { canonical: `/share/mbti/${t.code}` },
      openGraph: {
        type: "article",
        locale: "zh_CN",
        url: `${SITE_URL}/share/mbti/${t.code}`,
        siteName: SITE_NAME,
        title: `${t.code} · ${t.nameZh} | ${SITE_NAME}`,
        description,
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: `${t.code} ${t.nameZh} 人格分享图`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${t.code} · ${t.nameZh}`,
        description,
        images: [ogUrl],
      },
    };
  }

  if (kind === "bfi10") {
    const decoded = decodeBFI10FromUrl(code);
    if (!decoded) {
      return { title: "分享 · 大五人格", robots: { index: false } };
    }
    const ogQuery = new URLSearchParams({
      O: String(decoded.O),
      C: String(decoded.C),
      E: String(decoded.E),
      A: String(decoded.A),
      N: String(decoded.N),
    });
    const ogUrl = `/api/og/bfi10?${ogQuery.toString()}`;
    const description = `我的大五画像：O${decoded.O} · C${decoded.C} · E${decoded.E} · A${decoded.A} · N${decoded.N}`;
    return {
      title: "大五人格画像 — 我的 BFI-10 结果",
      description,
      alternates: { canonical: `/share/bfi10/${code}` },
      openGraph: {
        type: "article",
        locale: "zh_CN",
        url: `${SITE_URL}/share/bfi10/${code}`,
        siteName: SITE_NAME,
        title: `大五人格画像 | ${SITE_NAME}`,
        description,
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: "大五人格分享图",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "大五人格画像",
        description,
        images: [ogUrl],
      },
    };
  }

  return { title: "分享", robots: { index: false } };
}

export default async function SharePage({ params, searchParams }: PageProps) {
  const { type, code } = await params;
  const sp = await searchParams;
  const kind = type.toLowerCase();

  if (kind === "mbti") {
    const t = getTypeByCode(code.toUpperCase());
    if (!t) notFound();

    // 跳转回首页时保留参数，触发 SharedResultBanner
    const query = new URLSearchParams({ result: `mbti:${t.code}` });
    for (const k of ["E", "S", "T", "J"] as const) {
      const v = clampPctFromSp(sp[k]);
      if (v !== null) query.set(k, String(v));
    }
    const goHome = `/?${query.toString()}`;

    return (
      <>
        <Header />
        <main id="main" className="share-landing">
          <section
            className="share-landing-card"
            style={{ background: `var(${t.accentBg})` }}
          >
            <div className="share-landing-icon" aria-hidden="true">
              {t.icon}
            </div>
            <div className="share-landing-code">{t.code}</div>
            <h1 className="share-landing-name">
              {t.nameZh}
              <small>{t.nameEn}</small>
            </h1>
            <p className="share-landing-desc">{t.shortDesc}</p>
            <div className="share-landing-actions">
              <Link href={goHome} className="btn btn-primary btn-lg">
                我也来测一下 →
              </Link>
              <Link href={`/types/${t.code}`} className="btn btn-ghost btn-lg">
                查看类型详情
              </Link>
            </div>
            <p className="share-landing-note">
              来自 MindNest · 28 题 Likert 人格测评
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (kind === "bfi10") {
    const decoded = decodeBFI10FromUrl(code);
    if (!decoded) notFound();

    const dims = [
      { key: "O", zh: "开放性", val: decoded.O },
      { key: "C", zh: "尽责性", val: decoded.C },
      { key: "E", zh: "外向性", val: decoded.E },
      { key: "A", zh: "宜人性", val: decoded.A },
      { key: "N", zh: "神经质", val: decoded.N },
    ];

    return (
      <>
        <Header />
        <main id="main" className="share-landing">
          <section
            className="share-landing-card"
            style={{ background: "var(--sage-bg)" }}
          >
            <div className="share-landing-icon" aria-hidden="true">
              ✦
            </div>
            <h1 className="share-landing-name">大五人格画像</h1>
            <p className="share-landing-desc">
              一份 BFI-10 测评结果，5 个维度全景。
            </p>
            <ul className="share-landing-dims">
              {dims.map((d) => (
                <li key={d.key}>
                  <span className="share-landing-dim-key">{d.key}</span>
                  <span className="share-landing-dim-zh">{d.zh}</span>
                  <span className="share-landing-dim-val">{d.val}</span>
                </li>
              ))}
            </ul>
            <div className="share-landing-actions">
              <Link
                href={`/?result=bfi10:${encodeURIComponent(code)}`}
                className="btn btn-primary btn-lg"
              >
                我也来测一下 →
              </Link>
              <Link href="/#quiz-bfi10" className="btn btn-ghost btn-lg">
                了解大五人格
              </Link>
            </div>
            <p className="share-landing-note">
              来自 MindNest · BFI-10 国际通用量表
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  notFound();
}
