"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface NavLink {
  href: string;
  label: string;
  cta?: boolean;
}

export default function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS: NavLink[] = [
    { href: "/#frameworks", label: t("theory") },
    { href: "/#types", label: t("types") },
    { href: "/#quiz", label: t("startQuiz") },
    { href: "/hexaco", label: t("hexaco") },
    { href: "/#resources", label: t("resources") },
    { href: "/#compare", label: t("compare") },
    { href: "/#faq", label: t("faq") },
    { href: "/#quiz", label: t("freeQuiz"), cta: true },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <header>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="主导航">
        <Link href="/" className="nav-brand" aria-label={t("homeAria")}>
          <div className="nav-logo" aria-hidden="true" />
          <div className="nav-title">
            心栖 <small>MindNest</small>
          </div>
        </Link>

        <ul
          id="primaryNav"
          className={`nav-links${open ? " nav-links--mobile-open" : ""}`}
        >
          {NAV_LINKS.map((l) => (
            <li key={`${l.href}-${l.label}`}>
              <Link
                href={l.href}
                className={l.cta ? "nav-cta" : ""}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-mobile-btn"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="primaryNav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </nav>
    </header>
  );
}
