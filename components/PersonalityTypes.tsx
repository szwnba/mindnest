"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  PERSONALITY_TYPES,
  TYPE_GROUPS,
  type TypeGroup,
} from "@/lib/data/personality-types";

type FilterValue = "all" | TypeGroup;

interface Tab {
  value: FilterValue;
  label: string;
}

const TABS: Tab[] = [
  { value: "all", label: "全部类型" },
  { value: "analyst", label: TYPE_GROUPS.analyst.label },
  { value: "diplomat", label: TYPE_GROUPS.diplomat.label },
  { value: "sentinel", label: TYPE_GROUPS.sentinel.label },
  { value: "explorer", label: TYPE_GROUPS.explorer.label },
];

export default function PersonalityTypes() {
  const [active, setActive] = useState<FilterValue>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
            <span className="tag">人格图谱</span>
          </div>
          <h2 className="section-title" id="types-title">
            探索 16 种人格类型
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            每种人格都有独特的认知方式和行为偏好。了解这些差异，不是为了分类，而是为了理解与欣赏人类心理的丰富性。
          </p>
        </div>

        <div
          className="types-tabs reveal"
          role="tablist"
          aria-label="按人格族群筛选"
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
          {visible.map((t, i) => (
            <Link
              key={t.code}
              href={`/types/${t.code}`}
              className={`type-card-link reveal${i % 4 ? ` reveal-d${i % 4}` : ""}`}
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

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/types" className="btn btn-ghost">
            查看全部 16 种类型 →
          </Link>
        </div>
      </div>
    </section>
  );
}
