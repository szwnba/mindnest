import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  PERSONALITY_TYPES,
  TYPE_GROUPS,
  type TypeGroup,
} from "@/lib/data/personality-types";

export const metadata: Metadata = {
  title: "16 种人格类型总览",
  description:
    "完整的 16 种 MBTI 人格类型介绍，按分析家 / 外交家 / 守卫者 / 探险家四大族群分类，每种类型含核心描述、天然优势与成长方向。",
  alternates: { canonical: "/types" },
};

const GROUP_ORDER: TypeGroup[] = ["analyst", "diplomat", "sentinel", "explorer"];

export default function TypesIndexPage() {
  return (
    <>
      <Header />
      <main id="main" className="types-overview">
        <header className="types-overview-header">
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">人格图谱</span>
          </div>
          <h1 className="section-title">16 种人格类型完整图谱</h1>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            每种类型都是一种看待世界的独特方式。点击任意一张卡片可以阅读完整介绍——
            包括它的优势、成长方向以及与其他类型的差异。
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/#quiz" className="btn btn-primary">
              想知道自己是哪一种？开始测评 →
            </Link>
          </div>
        </header>

        {GROUP_ORDER.map((group) => {
          const types = PERSONALITY_TYPES.filter((t) => t.group === group);
          return (
            <section
              key={group}
              style={{ margin: "3rem 0" }}
              aria-labelledby={`group-${group}`}
            >
              <h2
                id={`group-${group}`}
                className="section-title"
                style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}
              >
                {TYPE_GROUPS[group].label}
              </h2>
              <div className="types-grid">
                {types.map((t) => (
                  <Link
                    key={t.code}
                    href={`/types/${t.code}`}
                    className="type-card-link"
                    aria-label={`查看 ${t.code} ${t.nameZh} 详细介绍`}
                  >
                    <article
                      className="type-card"
                      style={
                        {
                          ["--type-accent" as string]: `var(${t.accentColor})`,
                          ["--type-bg" as string]: `var(${t.accentBg})`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="type-card-top">
                        <span className="type-code">{t.code}</span>
                        <span className="type-emoji" aria-hidden="true">
                          {t.icon}
                        </span>
                      </div>
                      <h3 className="type-name-zh">{t.nameZh}</h3>
                      <div className="type-name-en">{t.nameEn}</div>
                      <p className="type-desc-short">{t.shortDesc}</p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
