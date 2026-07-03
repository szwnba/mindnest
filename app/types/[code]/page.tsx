import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  PERSONALITY_TYPES,
  getTypeByCode,
} from "@/lib/data/personality-types";
import { SITE_NAME } from "@/lib/site";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return PERSONALITY_TYPES.map((t) => ({ code: t.code }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  const type = getTypeByCode(code);
  if (!type) return { title: "未找到该人格类型" };
  // 此页 /types/[code]/opengraph-image.tsx 通过 Next.js metadata file convention 自动注入 og:image，
  // 这里在 openGraph 内显式声明，是为兼容某些不识别 file-convention 的抓取器。
  const ogImage = `/types/${type.code}/opengraph-image`;
  return {
    title: `${type.code} · ${type.nameZh}（${type.nameEn}）`,
    description: type.shortDesc,
    alternates: { canonical: `/types/${type.code}` },
    openGraph: {
      title: `${type.code} · ${type.nameZh} | ${SITE_NAME}`,
      description: type.shortDesc,
      url: `/types/${type.code}`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${type.code} ${type.nameZh} 人格类型`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${type.code} · ${type.nameZh}`,
      description: type.shortDesc,
      images: [ogImage],
    },
  };
}

export const dynamicParams = false;

export default async function TypeDetailPage({ params }: PageProps) {
  const { code } = await params;
  const type = getTypeByCode(code);
  if (!type) notFound();

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "name": `${type.code} · ${type.nameZh}（${type.nameEn}）`,
            "description": `心栖 MindNest - ${type.code} ${type.nameZh} 人格类型详解：${type.description.slice(0, 100)}`,
            "mainEntity": {
              "@type": "Person",
              "name": `${type.code} ${type.nameZh}`,
              "description": type.description.slice(0, 200),
              "additionalProperty": [
                { "@type": "PropertyValue", "name": "类型代码", "value": type.code },
                { "@type": "PropertyValue", "name": "英文名", "value": type.nameEn },
                { "@type": "PropertyValue", "name": "一句话简介", "value": type.shortDesc || "" }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": SITE_NAME,
              "url": "https://mindnest-six.vercel.app"
            }
          })
        }}
      />
      <main id="main" className="container type-detail">
        <Link href="/types" className="type-detail-back">
          ← 返回 16 类型
        </Link>

        <header className="type-detail-header">
          <div
            className="type-detail-emoji"
            style={{ background: `var(${type.accentBg})` }}
            aria-hidden="true"
          >
            {type.icon}
          </div>
          <div>
            <div className="type-detail-code">{type.code}</div>
            <h1 className="type-detail-name">
              {type.nameZh}
              <small>{type.nameEn}</small>
            </h1>
          </div>
        </header>

        <div className="type-detail-prose">
          {type.description.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="type-detail-grid">
          <section className="type-detail-card" aria-labelledby="strengths-h">
            <h2 id="strengths-h">天然优势</h2>
            <ul>
              {type.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section className="type-detail-card" aria-labelledby="growth-h">
            <h2 id="growth-h">成长方向</h2>
            <ul>
              {type.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>
        </div>

        {type.relationships && (
          <section className="type-detail-section" aria-labelledby="relationships-h">
            <h2 id="relationships-h" className="type-detail-section-title">关系模式</h2>
            {type.relationships.split(/\n\n+/).map((para, i) => (
              <p key={i} className="type-detail-section-para">{para}</p>
            ))}
          </section>
        )}
        {type.career && (
          <section className="type-detail-section" aria-labelledby="career-h">
            <h2 id="career-h" className="type-detail-section-title">职业倾向</h2>
            {type.career.split(/\n\n+/).map((para, i) => (
              <p key={i} className="type-detail-section-para">{para}</p>
            ))}
          </section>
        )}
        {type.blindSpots && (
          <section className="type-detail-section" aria-labelledby="blindspots-h">
            <h2 id="blindspots-h" className="type-detail-section-title">成长盲点</h2>
            {type.blindSpots.split(/\n\n+/).map((para, i) => (
              <p key={i} className="type-detail-section-para">{para}</p>
            ))}
          </section>
        )}
        {type.figures && type.figures.length > 0 && (
          <section className="type-detail-section" aria-labelledby="figures-h">
            <h2 id="figures-h" className="type-detail-section-title">代表人物</h2>
            <p className="type-detail-section-note">
              以下人物的特质与 {type.code} 类型高度吻合，仅作参考，非官方认证。
            </p>
            <ul className="type-detail-figures">
              {type.figures.map((f) => (
                <li key={f.name} className="type-detail-figure">
                  <span className="type-detail-figure-name">{f.name}</span>
                  <span className="type-detail-figure-role">
                    {f.fictional ? "（虚构）" : ""} {f.role}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div
          className="type-detail-cta"
          style={{
            background: `var(${type.accentBg})`,
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <h2
            className="section-title"
            style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}
          >
            想知道你是不是 {type.code}？
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
              lineHeight: 1.7,
            }}
          >
            完成 28 题 Likert 测评，得到属于你自己的 4 维度分布与人格画像。
          </p>
          <Link href="/#quiz" className="btn btn-primary btn-lg">
            开始测一下 →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
