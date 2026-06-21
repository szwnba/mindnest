import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  ARTICLES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Resource,
} from "@/lib/data/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `资料库 · ${SITE_NAME}`,
  description:
    "从荣格到 HEXACO，20 篇人格心理学深度长文。涵盖理论、科学证据、应用、历史、批判与跨文化六类，皆引用原始文献。",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: `资料库 · 20 篇人格心理学深度长文 | ${SITE_NAME}`,
    description:
      "从荣格到 HEXACO，从 MBTI 到 Big Five，从儒家五常到 16personalities 的商业化争议——一份认真的中文人格心理学资料库。",
    url: "/resources",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "资料库 · 20 篇人格心理学深度长文",
    description: "用学界标准做人格测评，用诗化中文写给你看。",
  },
};

function groupByCategory(): Record<string, Resource[]> {
  return ARTICLES.reduce<Record<string, Resource[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}

export default function ResourcesIndexPage() {
  const grouped = groupByCategory();
  const totalCount = ARTICLES.length;

  // JSON-LD 集合页结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `资料库 · ${SITE_NAME}`,
    description:
      "20 篇人格心理学深度长文，覆盖理论、科学证据、应用实践、历史谱系、批判反思与跨文化六大主题。",
    url: `${SITE_URL}/resources`,
    hasPart: ARTICLES.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `${SITE_URL}/resources/${a.slug}`,
      datePublished: a.publishedAt,
    })),
  };

  return (
    <>
      <Header />
      <main id="main" className="resources-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="resources-hero">
          <div className="resources-eyebrow">
            <span className="tag">资料库 · Library</span>
          </div>
          <h1 className="resources-title">
            从荣格到 HEXACO
            <br />
            <small>{totalCount} 篇人格心理学深度长文</small>
          </h1>
          <p className="resources-subtitle">
            用学界标准做人格测评，用诗化中文写给你看。
            每篇正文 1500-3000 字，引用原始文献，不做空泛的「INFJ 适合 ❤️」式总结。
          </p>
          <div className="resources-meta-line">
            <span>共 {totalCount} 篇</span>
            <span aria-hidden="true">·</span>
            <span>覆盖 {CATEGORY_ORDER.length} 个主题</span>
            <span aria-hidden="true">·</span>
            <span>全部免费阅读</span>
          </div>
        </header>

        <nav className="resources-toc" aria-label="分类目录">
          {CATEGORY_ORDER.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className="resources-toc-chip"
              data-category={cat}
            >
              <span className="resources-toc-label">{CATEGORY_LABELS[cat]}</span>
              <span className="resources-toc-count">
                {grouped[cat]?.length ?? 0}
              </span>
            </a>
          ))}
        </nav>

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat] ?? [];
          if (items.length === 0) return null;
          return (
            <section
              key={cat}
              id={`cat-${cat}`}
              className="resources-section"
              aria-labelledby={`cat-h-${cat}`}
            >
              <div className="resources-section-header">
                <h2 id={`cat-h-${cat}`} className="resources-section-title">
                  {CATEGORY_LABELS[cat]}
                  <small> · {items.length} 篇</small>
                </h2>
              </div>
              <div className="resources-grid">
                {items.map((a) => (
                  <article key={a.slug} className="resource-card">
                    <div className="resource-card-meta">
                      <span className="resource-card-cat">{a.categoryLabel}</span>
                      <span className="resource-card-dot" aria-hidden="true">·</span>
                      <span className="resource-card-time">{a.readingTime} 分钟</span>
                    </div>
                    <h3 className="resource-card-title">
                      <Link href={`/resources/${a.slug}`}>{a.title}</Link>
                    </h3>
                    <p className="resource-card-excerpt">{a.excerpt}</p>
                    <div className="resource-card-foot">
                      <time
                        className="resource-card-date"
                        dateTime={a.publishedAt}
                      >
                        {formatDate(a.publishedAt)}
                      </time>
                      <Link
                        href={`/resources/${a.slug}`}
                        className="resource-card-link"
                      >
                        读一读 →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="resources-cta" aria-labelledby="resources-cta-h">
          <h2 id="resources-cta-h">读完了？来测一下你自己</h2>
          <p>
            读理论是一回事，看到自己的分布是另一回事。
            MindNest 的 MBTI 28 题与 Big Five 短版都免费、不需注册。
          </p>
          <Link href="/#quiz" className="btn btn-primary btn-lg">
            开始 28 题测评 →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
