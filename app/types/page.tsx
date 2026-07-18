import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, useTranslations } from "next-intl";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  PERSONALITY_TYPES,
  TYPE_GROUPS,
  type TypeGroup,
} from "@/lib/data/personality-types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("personalityTypes");
  const current = t("title") === "探索 16 种人格类型" ? "zh" : "en";
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/types" },
    openGraph: {
      locale: current === "zh" ? "zh_CN" : "en_US",
    },
  };
}

const GROUP_ORDER: TypeGroup[] = ["analyst", "diplomat", "sentinel", "explorer"];

export default function TypesIndexPage() {
  const t = useTranslations("personalityTypes");
  return (
    <>
      <Header />
      <main id="main" className="types-overview">
        <header className="types-overview-header">
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h1 className="section-title">{t("title")}</h1>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {t("subtitle")}
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/#quiz" className="btn btn-primary">
              {t("cta")}
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
                    aria-label={t("ariaLabel", { code: t.code, name: t.nameZh })}
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
