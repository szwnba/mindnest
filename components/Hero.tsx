"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-deco hero-deco-1" aria-hidden="true" />
      <div className="hero-deco hero-deco-2" aria-hidden="true" />
      <div className="hero-deco hero-deco-3" aria-hidden="true" />

      <div className="hero-aurora" aria-hidden="true" />

      <div className="hero-grid">
        <div className="hero-text">
          <div className="hero-greeting">
            <span className="hero-greeting-line" aria-hidden="true" />
            {t("greeting")}
          </div>
          <h1 id="hero-title" className="hero-title">
            {t("title").split("\\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <div className="hero-type-wheel" aria-hidden="true">
            {[
              { code: "INTJ", name: "建筑师", color: "var(--sky)" },
              { code: "ENFP", name: "竞选者", color: "var(--sage)" },
              { code: "ISTJ", name: "物流师", color: "var(--warm-gold)" },
              { code: "ESTP", name: "企业家", color: "var(--terracotta)" },
              { code: "INFJ", name: "提倩", color: "var(--sage)" },
              { code: "ENTJ", name: "指挥官", color: "var(--sky)" },
              { code: "INTJ", name: "建筑师", color: "var(--sky)" },
              { code: "ENFP", name: "竞选者", color: "var(--sage)" },
              { code: "ISTJ", name: "物流师", color: "var(--warm-gold)" },
              { code: "ESTP", name: "企业家", color: "var(--terracotta)" },
              { code: "INFJ", name: "提倩", color: "var(--sage)" },
              { code: "ENTJ", name: "指挥官", color: "var(--sky)" },
            ].map((tChip, i) => (
              <span key={`${tChip.code}-${i}`} className="hero-type-chip" style={{ animationDelay: `${(i % 6) * 0.15}s` }}>
                <span className="hero-type-chip-code">{tChip.code}</span>
                <span className="hero-type-chip-name">{tChip.name}</span>
              </span>
            ))}
          </div>
          <p className="hero-desc">{t("desc")}</p>
          <p className="hero-quote">
            <em>{t("quote")}</em>
          </p>
          <div className="hero-pull" aria-hidden="true">
            <span className="hero-pull-line" />
            <span className="hero-pull-text">{t("pullText")}</span>
          </div>
          <div className="hero-actions">
            <Link href="/#quiz" className="btn btn-primary btn-lg">
              {t("ctaPrimary")}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#frameworks" className="btn btn-ghost btn-lg">
              {t("ctaSecondary")}
            </Link>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <Link
              href="/hexaco"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {t("hexacoLink")}
            </Link>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars" aria-hidden="true">
              <div className="hero-trust-avatar">🌿</div>
              <div className="hero-trust-avatar">🧠</div>
              <div className="hero-trust-avatar">📖</div>
              <div className="hero-trust-avatar">💡</div>
              <div className="hero-trust-avatar">🎯</div>
            </div>
            <div className="hero-trust-text">
              <strong>{t("trustTitle")}</strong>
              <br />
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                {t("trustSubtitle")}
              </span>
            </div>
          </div>
        </div>

        <aside className="hero-visual" aria-label="示例结果预览">
          <div className="hero-card-stack">
            <div className="hero-floating-card hfc-main" aria-hidden="true">
              <div className="hfc-header">
                <div className="hfc-icon" style={{ background: "var(--sage-bg)" }}>
                  🦋
                </div>
                <div>
                  <div className="hfc-type-code">{t("cardExample")}</div>
                  <div className="hfc-type-name">{t("cardTypeName")}</div>
                </div>
              </div>
              <div className="hfc-traits">
                {(t.raw("cardTraits") as string[]).map((trait) => (
                  <span key={trait} className="hfc-trait">{trait}</span>
                ))}
              </div>
              <div className="hfc-bar-group">
                {(t.raw("cardDimensions") as string[]).map((dim) => (
                  <div className="hfc-bar-item" key={dim}>
                    <span className="hfc-bar-label">{dim}</span>
                    <div className="hfc-bar-track">
                      <div className="hfc-bar-fill sage" style={{ width: "78%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-floating-card hfc-mini-1" aria-hidden="true">
              <div className="hfc-mini-stat">
                <div
                  className="hfc-mini-stat-value"
                  style={{ color: "var(--sage)" }}
                >
                  4
                </div>
                <div className="hfc-mini-stat-label">{t("miniStat1Label")}</div>
              </div>
            </div>
            <div className="hero-floating-card hfc-mini-2" aria-hidden="true">
              <div className="hfc-mini-stat">
                <div
                  className="hfc-mini-stat-value"
                  style={{ color: "var(--terracotta)" }}
                >
                  16
                </div>
                <div className="hfc-mini-stat-label">{t("miniStat2Label")}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
