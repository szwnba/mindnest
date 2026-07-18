"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  clearQuizHistory,
  getQuizHistory,
  type QuizHistoryEntry,
  type MBTIHistoryResult,
} from "@/lib/quiz-storage";
import { getTypeByCode } from "@/lib/data/personality-types";
import { BIG_FIVE_DIMENSIONS, BIG_FIVE_ORDER } from "@/lib/data/big-five-dimensions";
import { HEXACO_DIMENSIONS, HEXACO_ORDER } from "@/lib/data/hexaco-questions";
import type { BFI10Result } from "@/lib/bfi10-scoring";
import type { HexacoResult } from "@/lib/hexaco-scoring";
import { useHydratedInit } from "@/lib/use-hydrated";

function isMBTIResult(r: QuizHistoryEntry["result"]): r is MBTIHistoryResult {
  return (r as MBTIHistoryResult).code !== undefined;
}

function isBFI10Result(r: QuizHistoryEntry["result"]): r is BFI10Result {
  return (r as BFI10Result).O !== undefined && (r as BFI10Result).N !== undefined;
}

function isHexacoResult(r: QuizHistoryEntry["result"]): r is HexacoResult {
  return (r as HexacoResult).H !== undefined && (r as HexacoResult).X !== undefined;
}

function fmtTime(ts: number): string {
  try {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

export default function QuizHistory() {
  const t = useTranslations("quizHistory");
  const [entries, setEntries] = useState<QuizHistoryEntry[]>([]);

  // hydration 完成后从 localStorage 恢复历史（render 阶段 setState，React 19 允许）
  const hydrated = useHydratedInit(() => {
    setEntries(getQuizHistory());
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mindnest_quiz_history") setEntries(getQuizHistory());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!hydrated) return null;
  if (entries.length === 0) return null;

  function onClear() {
    if (typeof window === "undefined") return;
    const ok = window.confirm(t("confirmClear"));
    if (!ok) return;
    clearQuizHistory();
    setEntries([]);
  }

  return (
    <section
      className="section quiz-history-section"
      id="quiz-history"
      aria-labelledby="quiz-history-title"
    >
      <div className="section-inner">
        <div className="section-header reveal" style={{ marginBottom: "2rem" }}>
          <div className="section-eyebrow">
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="quiz-history-title">
            {t("title")}
          </h2>
          <p className="section-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <ul className="quiz-history-list reveal">
          {entries.map((e) => (
            <li key={e.id} className="quiz-history-item">
              {isMBTIResult(e.result) ? (
                <MBTIHistoryRow entry={e} result={e.result} />
              ) : isBFI10Result(e.result) ? (
                <BFI10HistoryRow entry={e} result={e.result} />
              ) : isHexacoResult(e.result) ? (
                <HexacoHistoryRow entry={e} result={e.result} />
              ) : null}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
            {t("clear")}
          </button>
        </div>
      </div>
    </section>
  );
}

function MBTIHistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: MBTIHistoryResult }) {
  const t = useTranslations("quizHistory");
  const locale = useLocale();
  const type = getTypeByCode(result.code);
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{type?.icon ?? "🫐"}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">{t("mbtiLabel", { code: result.code })}</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          {type ? `${locale === "en" ? type.nameEn : type.nameZh} — ${type.shortDesc}` : t("mbtiFallback")}
        </div>
      </div>
      {type && (
        <Link href={`/types/${type.code}`} className="btn btn-ghost btn-sm">
          {t("view")}
        </Link>
      )}
    </>
  );
}

function BFI10HistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: BFI10Result }) {
  let topDim = BIG_FIVE_ORDER[0];
  let topVal = -1;
  for (const d of BIG_FIVE_ORDER) {
    if (result[d] > topVal) {
      topVal = result[d];
      topDim = d;
    }
  }
  const topMeta = BIG_FIVE_DIMENSIONS[topDim];
  const t = useTranslations("quizHistory");
  const locale = useLocale();
  const dimName = locale === "en" ? topMeta.fullName : topMeta.name;
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{topMeta.icon}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">{t("bfi10Label")}</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          {t("dominantDim", { name: dimName, value: topVal })} · O{result.O} C{result.C} E{result.E} A{result.A} N{result.N}
        </div>
      </div>
      <Link href="/#quiz-bfi10" className="btn btn-ghost btn-sm">{t("retake")}</Link>
    </>
  );
}

function HexacoHistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: HexacoResult }) {
  let topDim = HEXACO_ORDER[0];
  let topVal = -1;
  for (const d of HEXACO_ORDER) {
    if (result[d] > topVal) {
      topVal = result[d];
      topDim = d;
    }
  }
  const topMeta = HEXACO_DIMENSIONS[topDim];
  const t = useTranslations("quizHistory");
  const locale = useLocale();
  const dimName = locale === "en" ? topMeta.fullName : topMeta.name;
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{topMeta.icon}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">{t("hexacoLabel")}</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          {t("dominantDim", { name: dimName, value: topVal })} · H{result.H} E{result.E} X{result.X} A{result.A} C{result.C} O{result.O}
        </div>
      </div>
      <Link href="/hexaco" className="btn btn-ghost btn-sm">{t("retake")}</Link>
    </>
  );
}
