"use client";

import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { number: string; title: string; desc: string }[];

  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag tag--warm">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="how-title">
            {t("title")}
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div className={`step-card reveal${i > 0 ? ` reveal-d${i}` : ""}`} key={step.number}>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
