"use client";

import { useTranslations } from "next-intl";


export default function InsightSection({ insight }: { insight: PersonalityInsight }) {
  const t = useTranslations("insights");

  return (
    <div className="insight-section">
      {/* Narrative */}
      <div className="insight-narrative">
        <p>{insight.narrative}</p>
      </div>

      {/* Standout Stats */}
      {insight.standoutStats.length > 0 && (
        <div className="insight-standout">
          <h4 className="insight-standout-title">{t("standoutTitle")}</h4>
          {insight.standoutStats.map((stat, i) => (
            <div key={i} className="stat-highlight">
              <span className="stat-percentile">{stat.percentile}%</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Signature Strengths */}
      <div className="insight-strengths">
        <h4 className="insight-strengths-title">{t("strengthsTitle")}</h4>
        {insight.signatureStrengths.map((s, i) => (
          <div key={i} className="strength-card">
            <div className="strength-card-title">{s.title}</div>
            <p className="strength-card-desc">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Blind Spot */}
      {insight.blindSpot.title && (
        <div className="insight-blindspot">
          <h4 className="insight-blindspot-title">{t("blindSpotTitle")}</h4>
          <div className="blindspot-card">
            <div className="blindspot-card-title">{insight.blindSpot.title}</div>
            <p className="blindspot-card-insight">{insight.blindSpot.insight}</p>
          </div>
        </div>
      )}

      {/* Drivers / Drainers */}
      {(insight.drivers.length > 0 || insight.drainers.length > 0) && (
        <div className="insight-energy">
          <div className="energy-col">
            <h4 className="energy-title energy-drivers-title">{t("driversTitle")}</h4>
            {insight.drivers.map((d, i) => (
              <div key={i} className="energy-item">
                <span className="energy-item-title">{d.title}</span>
                <span className="energy-item-desc">{d.description}</span>
              </div>
            ))}
          </div>
          <div className="energy-col">
            <h4 className="energy-title energy-drainers-title">{t("drainersTitle")}</h4>
            {insight.drainers.map((d, i) => (
              <div key={i} className="energy-item">
                <span className="energy-item-title">{d.title}</span>
                <span className="energy-item-desc">{d.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
