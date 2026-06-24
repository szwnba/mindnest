"use client";

import { useTranslations } from "next-intl";

interface TrustItem {
  icon: string;
  bgVar?: string;
  title: string;
  desc: string;
}

export default function TrustBar() {
  const t = useTranslations("trustBar");
  const items = t.raw("items") as TrustItem[];

  return (
    <div className="trust-bar" role="region" aria-label={t("title")}>
      <div className="trust-bar-inner">
        {items.map((it, i) => (
          <div
            key={it.title}
            className={`trust-item reveal${i > 0 ? ` reveal-d${i}` : ""}`}
          >
            <div
              className="trust-icon"
              style={it.bgVar ? { background: `var(${it.bgVar})` } : undefined}
              aria-hidden="true"
            >
              {it.icon}
            </div>
            <div className="trust-label">
              <strong>{it.title}</strong>
              {it.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
