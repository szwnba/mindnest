"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface SharePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SharePage({ searchParams }: SharePageProps) {
  const t = useTranslations("share");
  const [code, setCode] = useState<string>("");
  const [type, setType] = useState<string>("mbti");

  useEffect(() => {
    searchParams.then((params) => {
      setCode(typeof params.code === "string" ? params.code : "");
      setType(typeof params.type === "string" ? params.type : "mbti");
    });
  }, [searchParams]);

  const shareText = t("ogDescription", { type: type.toUpperCase(), code });
  const shareUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="w-full max-w-lg text-center">
        <p className="text-sm text-[var(--color-muted)] mb-2">
          {t("resultFor", { type: type.toUpperCase() })}
        </p>
        <h1 className="text-6xl font-display font-bold tracking-tight mb-4">
          {code || "—"}
        </h1>
        <p className="text-lg text-[var(--color-body)] mb-8">{shareText}</p>

        <div className="flex items-center justify-center gap-3">
          <a
            className="inline-flex h-10 items-center rounded-full bg-[var(--color-accent)] px-5 font-medium text-white hover:opacity-90 transition"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareText
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("shareOnX")}
          </a>
          <a
            className="inline-flex h-10 items-center rounded-full border border-[color-mix(in_srgb,var(--color-foreground)_20%,transparent)] px-5 font-medium hover:bg-[var(--color-card)] transition"
            href="/"
          >
            {t("takeTest")}
          </a>
        </div>
      </div>
    </main>
  );
}
