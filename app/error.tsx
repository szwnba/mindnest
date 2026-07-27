"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("errorBoundary");

  return (
    <main
      className="container narrow"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          {t("title")}
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          {t("description")}
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={reset}
            className="btn btn-primary"
          >
            {t("retry")}
          </button>
          <Link href="/" className="btn btn-outline">
            {t("homeLink")}
          </Link>
        </div>
      </div>
    </main>
  );
}
