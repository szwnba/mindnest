"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  PERSONALITY_TYPES,
  TYPE_GROUPS,
  type TypeGroup,
} from "@/lib/data/personality-types";

type FilterValue = "all" | TypeGroup;

export default function PersonalityTypes() {
  const t = useTranslations("personalityTypes");
  const locale = useLocale();
  const [active, setActive] = useState<FilterValue>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const TABS = [
    { value: "all" as FilterValue, label: t("tabs.all") },
    { value: "analyst" as FilterValue, label: TYPE_GROUPS.analyst.label },
    { value: "diplomat" as FilterValue, label: TYPE_GROUPS.diplomat.label },
    { value: "sentinel" as FilterValue, label: TYPE_GROUPS.sentinel.label },
    { value: "explorer" as FilterValue, label: TYPE_GROUPS.explorer.label },
  ];

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    e.preventDefault();
    let next = idx;
    if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    setActive(TABS[next].value);
    tabRefs.current[next]?.focus();
  };

  const visible = PERSONALITY_TYPES.filter(
    (t) => active === "all" || t.group === active,
  );

  return (
    <section className="section" id="types" aria-labelledby="types-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="types-title">
            {t("title")}
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className="types-tabs reveal"
          role="tablist"
          aria-label={t("tabsAriaLabel")}
        >
          {TABS.map((tab, i) => {
            const selected = active === tab.value;
            return (
              <button
                key={tab.value}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className={`types-tab${selected ? " active" : ""}`}
                onClick={() => setActive(tab.value)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="types-grid">
          {visible.map((type, i) => (
            <Link
              key={type.code}
              href={`/types/${type.code}`}
              className={`type-card-link reveal${i % 4 ? ` reveal-d${i % 4}` : ""}`}
              aria-label={t("ariaLabel", { code: type.code, name: locale === "en" ? type.nameEn : type.nameZh })}
            >
              <article
                className="type-card"
                style={
                  {
                    ["--type-accent" as string]: `var(${type.accentColor})`,
                    ["--type-bg" as string]: `var(${type.accentBg})`,
                  } as React.CSSProperties
                }
              >
                <div className="type-card-top">
                  <span className="type-code">{type.code}</span>
                  <span className="type-emoji" aria-hidden="true">
                    {type.icon}
                  </span>
                </div>
                <h3 className="type-name-zh">{type.nameZh}</h3>
                <div className="type-name-en">{type.nameEn}</div>
                <p className="type-desc-short">{type.shortDesc}</p>
              </article>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/types" className="btn btn-ghost">
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
