"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="container narrow" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 700, lineHeight: 1, marginBottom: "1rem" }}>
          {t("title")}
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          {t("message")}
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
