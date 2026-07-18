"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { type CareerMatch } from "@/lib/career-matches";

function CareerSectionBase({ careers }: { careers: CareerMatch[] }) {
  const t = useTranslations("careers");

  if (careers.length === 0) return null;

  const topPick = careers[0];
  const others = careers.slice(1);

  return (
    <div className="career-section">
      <h3 className="career-section-title">{t("title")}</h3>

      {/* Top Pick */}
      <div className="career-top-pick">
        <div className="career-top-label">{t("topPick")}</div>
        <div className="career-top-card">
          <div className="career-top-name">{topPick.title}</div>
          <div className="career-top-match">
            <div className="career-match-bar">
              <div
                className="career-match-fill"
                style={{ width: `${topPick.matchPercent}%` }}
              />
            </div>
            <span className="career-match-pct">{topPick.matchPercent}%</span>
          </div>
          <p className="career-top-why">{topPick.why}</p>
        </div>
      </div>

      {/* Other Matches */}
      {others.length > 0 && (
        <div className="career-others">
          {others.map((c, i) => (
            <div key={i} className="career-other-item">
              <span className="career-other-name">{c.title}</span>
              <div className="career-other-bar">
                <div
                  className="career-other-fill"
                  style={{ width: `${c.matchPercent}%` }}
                />
              </div>
              <span className="career-other-pct">{c.matchPercent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 职业匹配展示区,careers 不变时跳过重渲染。
 */
const CareerSection = memo(CareerSectionBase);
export default CareerSection;
