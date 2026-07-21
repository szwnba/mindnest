"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterLink {
  label: string;
  href: string;
  placeholder?: boolean;
}

export default function Footer() {
  const t = useTranslations("footer");
  const columns = t.raw("columns") as { title: string; links: FooterLink[] }[];

  function renderLink(l: FooterLink) {
    if (l.placeholder) {
      return (
        <Link
          href="/"
          aria-disabled="true"
          title={t("comingSoon")}
          tabIndex={-1}
        >
          {l.label}
        </Link>
      );
    }
    return <Link href={l.href}>{l.label}</Link>;
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="nav-brand"
              style={{ marginBottom: 0 }}
              aria-label={t("homeAria")}
            >
              <div className="nav-logo" aria-hidden="true" />
              <div className="nav-title">
                {t("siteName")}
              </div>
            </Link>
            <p className="footer-brand-text">{t("brandText")}</p>
          </div>
          {columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul>
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>{renderLink(l)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{t("bottom.copyright")}</span>
          <div className="footer-bottom-links">
            <Link href="/privacy">{t("bottom.privacy")}</Link>
            <Link href="/terms">{t("bottom.terms")}</Link>
            <Link href="/contact">{t("bottom.contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
