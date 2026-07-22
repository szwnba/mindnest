import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MarkdownLite from "@/components/MarkdownLite";
import {
  ARTICLES,
  getResourceBySlug,
  type Resource,
} from "@/lib/data/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = getResourceBySlug(slug);
  if (!a) return { title: "未找到该资料" };
  return {
    title: `${a.title} · ${SITE_NAME} 资料库`,
    description: a.excerpt,
    alternates: { canonical: `/resources/${a.slug}` },
    openGraph: {
      title: `${a.title} · ${SITE_NAME}`,
      description: a.excerpt,
      url: `/resources/${a.slug}`,
      type: "article",
      siteName: SITE_NAME,
      publishedTime: a.publishedAt,
      tags: [a.categoryLabel, "人格心理学", SITE_NAME],
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function getRelated(current: Resource): Resource[] {
  return ARTICLES.filter(
    (a) => a.slug !== current.slug && a.category === current.category,
  ).slice(0, 3);
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const a = getResourceBySlug(slug);
  if (!a) notFound();

  const related = getRelated(a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/resources/${a.slug}`,
    articleSection: a.categoryLabel,
    timeRequired: `PT${a.readingTime}M`,
  };

  return (
    <>
      <Header />
      <main id="main" className="resource-detail">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link href="/resources" className="resource-detail-back">
          ← 资料库
        </Link>

        <header className="resource-detail-header">
          <div className="resource-detail-meta">
            <span className="resource-detail-cat">{a.categoryLabel}</span>
            <span className="resource-detail-dot" aria-hidden="true">·</span>
            <time
              className="resource-detail-date"
              dateTime={a.publishedAt}
            >
              {formatDate(a.publishedAt)}
            </time>
            <span className="resource-detail-dot" aria-hidden="true">·</span>
            <span className="resource-detail-time">阅读 {a.readingTime} 分钟</span>
          </div>
          <h1 className="resource-detail-title">{a.title}</h1>
          <p className="resource-detail-excerpt">{a.excerpt}</p>
        </header>

        <article className="resource-detail-prose">
          <MarkdownLite source={a.body} />
        </article>

        {a.references && a.references.length > 0 && (
          <section
            className="resource-detail-refs"
            aria-labelledby="refs-h"
          >
            <h2 id="refs-h" className="resource-detail-section-title">
              参考文献
            </h2>
            <ol className="resource-detail-refs-list">
              {a.references.map((r, i) => (
                <li key={i}>
                  <span className="resource-ref-title">{r.title}</span>
                  {r.author && (
                    <span className="resource-ref-author"> · {r.author}</span>
                  )}
                  {r.url && (
                    <>
                      {" "}
                      <a
                        className="resource-ref-link"
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        原始链接 ↗
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {related.length > 0 && (
          <section
            className="resource-detail-related"
            aria-labelledby="related-h"
          >
            <h2 id="related-h" className="resource-detail-section-title">
              同一分类下，你可能也想看
            </h2>
            <ul className="resource-detail-related-list">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/resources/${r.slug}`}>
                    <span className="resource-related-cat">
                      {r.categoryLabel}
                    </span>
                    <span className="resource-related-title">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="resource-detail-cta" aria-labelledby="cta-h">
          <h2 id="cta-h">读完了？来测一下你自己</h2>
          <p>
            读理论是一回事，看到自己的分布是另一回事。MindNest 提供 MBTI 28 题
            与 Big Five 短版，免费、不需注册、附完整百分位分布。
          </p>
          <Link href="/#quiz" className="btn btn-primary btn-lg">
            开始测一下 →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
