"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { COMPARISON } from "@/lib/data/site-comparison";

export default function CompareSection() {
  const t = useTranslations("compare");

  return (
    <section
      className="section compare-section"
      id="compare"
      aria-labelledby="compare-title"
    >
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-eyebrow">
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="compare-title">
            {t("title")}
          </h2>
          <p className="section-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <div className="compare-legend reveal" aria-label={t("ariaLabel.legend")}>
          <span className="compare-legend-item compare-legend-win">{t("legend.win")}</span>
          <span className="compare-legend-item compare-legend-tie">{t("legend.tie")}</span>
          <span className="compare-legend-item compare-legend-behind">{t("legend.behind")}</span>
        </div>

        <div className="compare-stats reveal" aria-label={t("ariaLabel.stats")}>
          {(t.raw("stats") as { value: string; label: string; desc: string }[]).map((s) => (
            <div className="compare-stat-card" key={s.label}>
              <div className="compare-stat-value">{s.value}</div>
              <div className="compare-stat-label">{s.label}</div>
              <div className="compare-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="compare-social-proof reveal">
          <div className="csp-avatars" aria-hidden="true">
            {["🧠","🌱","📚","✨","🎯","🦋"].map((e,i)=>(
              <span key={i} className="csp-avatar">{e}</span>
            ))}
          </div>
          <p className="csp-text">
            {t.rich("socialProof", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <div className="compare-table-wrap reveal" role="region" aria-labelledby="compare-title">
          <table className="compare-table">
            <caption className="sr-only">
              {t("tableCaption")}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="compare-col-dim">{t("colDim")}</th>
                <th scope="col" className="compare-col-us">{t("colUs")}</th>
                <th scope="col" className="compare-col-them">{t("colThem")}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.dimension} className={`compare-row compare-${row.highlight}`}>
                  <th scope="row" className="compare-dim">{row.dimension}</th>
                  <td className="compare-us">
                    <span className="compare-us-inner">
                      {row.highlight === "win" && (
                        <span className="compare-badge compare-badge-win" aria-label={t("badgeWin")}>✓</span>
                      )}
                      {row.highlight === "behind" && (
                        <span className="compare-badge compare-badge-behind" aria-label={t("badgeBehind")}>
                          {t("badgeBehind")}
                        </span>
                      )}
                      <span>{row.mindNest}</span>
                    </span>
                  </td>
                  <td className="compare-them">
                    <span className="compare-them-inner">
                      {row.highlight === "win" && (
                        <span className="compare-badge-lose" aria-label={t("badgeLose")}>✗</span>
                      )}
                      {row.highlight === "tie" && (
                        <span className="compare-badge-tie-them">{t("badgeTieThem")}</span>
                      )}
                      {row.highlight === "behind" && (
                        <span className="compare-badge-win-them" aria-label={t("badgeWinThem")}>✓</span>
                      )}
                      <span>{row.sixteenP}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="compare-cards reveal" aria-label={t("ariaLabel.dimensions")}>
          {COMPARISON.map((row, i) => (
            <li
              key={row.dimension}
              className={`compare-card compare-${row.highlight}`}
            >
              <div className="compare-card-head">
                <span className="compare-card-idx">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="compare-card-dim">{row.dimension}</h3>
                {row.highlight === "win" && (
                  <span className="compare-badge compare-badge-win" aria-label={t("badgeWin")}>✓</span>
                )}
                {row.highlight === "behind" && (
                  <span className="compare-badge compare-badge-behind">{t("badgeBehind")}</span>
                )}
                {row.highlight === "tie" && (
                  <span className="compare-badge compare-badge-tie">{t("badgeTieThem")}</span>
                )}
              </div>
              <div className="compare-card-row">
                <div className="compare-card-label">{t("compare.colUs")}</div>
                <div className="compare-card-text">{row.mindNest}</div>
              </div>
              <div className="compare-card-row compare-card-row-them">
                <div className="compare-card-label">
                  {t("compare.colThem")}
                  {row.highlight === "win" && (
                    <span className="compare-badge-lose" aria-label={t("badgeLose")}> ✗</span>
                  )}
                  {row.highlight === "tie" && (
                    <span className="compare-badge-tie-them"> {t("badgeTieThem")}</span>
                  )}
                  {row.highlight === "behind" && (
                    <span className="compare-badge-win-them" aria-label={t("badgeWinThem")}> ✓</span>
                  )}
                </div>
                <div className="compare-card-text">{row.sixteenP}</div>
              </div>
            </li>
          ))}
        </ul>

        <p className="compare-coda reveal">{t("coda")}</p>
        <div className="compare-cta reveal">
          <Link href="/compare" className="btn-secondary">
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
