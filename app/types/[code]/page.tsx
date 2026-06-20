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
  return {
    title: `${type.code} · ${type.nameZh}（${type.nameEn}）`,
    description: type.shortDesc,
    alternates: { canonical: `/types/${type.code}` },
    openGraph: {
      title: `${type.code} · ${type.nameZh} | ${SITE_NAME}`,
      description: type.shortDesc,
      url: `/types/${type.code}`,
      type: "article",
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
      <main id="main" className="type-detail">
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

        <div
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
