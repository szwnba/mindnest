"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CtaBanner() {
  const t = useTranslations("ctaBanner");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="section" aria-labelledby="newsletter-title">
      <div className="section-inner">
        <div className="cta-banner reveal">
          <div className="cta-banner-content">
            <h2 id="newsletter-title" className="cta-banner-title">{t("title")}</h2>
            <p className="cta-banner-desc">
              {t("desc")}
            </p>
            <form className="cta-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="newsletter-email" className="cta-form-label">
                {t("emailLabel")}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                className="cta-input"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby="newsletter-feedback"
              />
              <button type="submit" className="btn btn-primary">
                {submitted ? t("submitted") : t("submit")}
              </button>
            </form>
            <div
              id="newsletter-feedback"
              className={`cta-feedback${submitted ? " cta-feedback--ok" : ""}`}
              role="status"
              aria-live="polite"
            >
              {submitted
                ? t("feedbackOk")
                : t("feedbackIdle")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
