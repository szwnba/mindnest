"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DIMENSION_LABELS,
  QUIZ_QUESTIONS,
  type Dimension,
} from "@/lib/data/quiz-questions";
import {
  ANSWERS_STORAGE_KEY,
  STORAGE_KEY,
  computeResult,
  type Answers,
  type LikertScore,
  type QuizResult,
} from "@/lib/scoring";
import { getTypeByCode } from "@/lib/data/personality-types";
import { projectMBTIResult, saveQuizHistory } from "@/lib/quiz-storage";
import RadarChart from "@/components/RadarChart";
import { useHydratedInit } from "@/lib/use-hydrated";

type Phase = "intro" | "answering" | "result";

function useLikertOptions() {
  const t = useTranslations("quiz.likert");
  return [
    { value: 1 as LikertScore, label: t("0.label"), aria: t("0.aria") },
    { value: 2 as LikertScore, label: t("1.label"), aria: t("1.aria") },
    { value: 3 as LikertScore, label: t("2.label"), aria: t("2.aria") },
    { value: 4 as LikertScore, label: t("3.label"), aria: t("3.aria") },
    { value: 5 as LikertScore, label: t("4.label"), aria: t("4.aria") },
  ];
}

const DIMENSION_ORDER: Dimension[] = ["EI", "SN", "TF", "JP"];

function dimensionProgress(qIdx: number): { dim: Dimension; nth: number } {
  const q = QUIZ_QUESTIONS[qIdx];
  const sameDim = QUIZ_QUESTIONS.filter((x, i) => x.dimension === q.dimension && i <= qIdx);
  return { dim: q.dimension, nth: sameDim.length };
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // hydration 完成后从 sessionStorage 恢复进度（render 阶段 setState，React 19 允许）
  useHydratedInit(() => {
    try {
      const savedResult = window.sessionStorage.getItem(STORAGE_KEY);
      const savedAnswers = window.sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      if (savedResult) {
        setResult(JSON.parse(savedResult) as QuizResult);
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers) as Answers);
        setPhase("result");
      } else if (savedAnswers) {
        const a = JSON.parse(savedAnswers) as Answers;
        const nextUnanswered = QUIZ_QUESTIONS.findIndex((q) => !(q.id in a));
        setAnswers(a);
        if (nextUnanswered >= 0) {
          setQIdx(nextUnanswered);
          setPhase("answering");
        }
      }
    } catch {
      // ignore
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Object.keys(answers).length === 0) {
      window.sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (result) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [result]);

  function startQuiz() {
    setAnswers({});
    setResult(null);
    setQIdx(0);
    setPhase("answering");
    queueMicrotask(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function pickAnswer(score: LikertScore) {
    const q = QUIZ_QUESTIONS[qIdx];
    const next: Answers = { ...answers, [q.id]: score };
    setAnswers(next);

    if (qIdx < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setQIdx((i) => i + 1);
      }, 220);
    } else {
      const r = computeResult(next);
      setTimeout(() => {
        setResult(r);
        setPhase("result");
        saveQuizHistory({
          type: "mbti",
          completedAt: Date.now(),
          result: projectMBTIResult(r),
        });
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 220);
    }
  }

  function goPrev() {
    if (qIdx > 0) setQIdx((i) => i - 1);
  }

  function reset() {
    setAnswers({});
    setResult(null);
    setQIdx(0);
    setPhase("intro");
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
    }
  }

  function shareResult() {
    if (!result) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const typeUrl = `${origin}/types/${result.code}`;
    const text = t("result.shareText", { code: result.code, url: typeUrl });
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: t("result.shareTitle", { code: result.code }), text, url: typeUrl }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        alert(t("result.copyAlert"));
      });
    }
  }

  function copyShareLink() {
    if (!result || typeof window === "undefined") return;
    const url = `${window.location.origin}/?result=mbti:${result.code}`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url).then(() => {
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2400);
      });
    }
  }

  const totalQ = QUIZ_QUESTIONS.length;
  const t = useTranslations("quiz");

  return (
    <section className="section quiz-bg" id="quiz" aria-labelledby="quiz-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="quiz-title">
            {t("title")}
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div ref={cardRef} className={`quiz-wrapper reveal ${phase !== "intro" ? "visible" : ""}`}>
          {phase === "intro" && <IntroPanel onStart={startQuiz} />}
          {phase === "answering" && (
            <AnsweringPanel
              qIdx={qIdx}
              total={totalQ}
              answers={answers}
              onPick={pickAnswer}
              onPrev={goPrev}
            />
          )}
          {phase === "result" && result && (
            <ResultPanel
              result={result}
              onReset={reset}
              onShare={shareResult}
              onCopy={copyShareLink}
              copyStatus={copyStatus}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  const t = useTranslations("quiz.intro");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <div className="quiz-card-shell quiz-intro">
      <div className="quiz-meta-dim" aria-hidden="true">
        {t("ready")}
      </div>
      <h3 className="quiz-question-text" style={{ marginTop: 8 }}>
        {t("heading")}
      </h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, margin: "0.75rem auto 0" }}>
        {t("desc")}
      </p>
      <div className="quiz-intro-stats">
        {stats.map((s) => (
          <div className="quiz-intro-stat" key={s.label}>
            <strong>{s.value}</strong>
            {s.label}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        {t("start")}
        <span aria-hidden="true">&#8594;</span>
      </button>
      <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        {t("privacyNote")}
      </p>
    </div>
  );
}

function AnsweringPanel({
  qIdx,
  total,
  answers,
  onPick,
  onPrev,
}: {
  qIdx: number;
  total: number;
  answers: Answers;
  onPick: (s: LikertScore) => void;
  onPrev: () => void;
}) {
  const ta = useTranslations("quiz.answering");
  const likert = useLikertOptions();
  const q = QUIZ_QUESTIONS[qIdx];
  const { dim, nth } = dimensionProgress(qIdx);
  const dimLabel = DIMENSION_LABELS[dim];
  const current = answers[q.id];
  const progress = Math.round(((qIdx + 1) / total) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          {ta("dimLabel", { dim: dimLabel, nth })}
        </span>
        <span className="quiz-meta-step">
          {qIdx + 1} / {total}
        </span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuenow={qIdx + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={ta("progressLabel", { current: qIdx + 1, total })}
      >
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="quiz-question-text">{q.text}</p>

      <div className="likert-row" role="group" aria-label={ta("likertGroupAria")}>
        {likert.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="likert-btn"
            aria-label={`${opt.aria} — ${q.text}`}
            aria-pressed={current === opt.value}
            onClick={() => onPick(opt.value)}
          >
            <span className="likert-num" aria-hidden="true">
              {opt.value}
            </span>
            <span className="likert-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="quiz-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onPrev}
          disabled={qIdx === 0}
          aria-label={ta("prevAria")}
        >
          {ta("prev")}
        </button>
        <span className="quiz-skip-hint">
          {ta("skipHint")}
        </span>
      </div>
    </div>
  );
}

function ResultPanel({
  result,
  onReset,
  onShare,
  onCopy,
  copyStatus,
}: {
  result: QuizResult;
  onReset: () => void;
  onShare: () => void;
  onCopy: () => void;
  copyStatus: "idle" | "copied";
}) {
  const t = useTranslations("quiz.result");
  const locale = useLocale();
  const type = useMemo(() => getTypeByCode(result.code), [result.code]);

  return (
    <div className="quiz-result" aria-live="polite">
      <div className="quiz-meta-dim" aria-hidden="true">
        {t("portrait")}
      </div>
      <div className="quiz-result-code">
        {result.code}
        {result.hasAmbiguous ? (
          <span
            style={{ fontSize: "0.4em", marginLeft: 12, color: "var(--text-muted)" }}
            aria-label={t("ambiguousAria")}
          >
            {t("ambiguous")}
          </span>
        ) : null}
      </div>
      <div className="quiz-result-name">
        {type ? `${type.icon} ${locale === "en" ? type.nameEn : type.nameZh}` : result.code}
      </div>
      {type && <p className="quiz-result-tagline">{type.shortDesc}</p>}

      <div className="dim-bars" aria-label={t("dimLabel")}>
        {DIMENSION_ORDER.map((dim) => {
          const r = result.dimensions[dim];
          return (
            <div
              key={dim}
              className={`dim-bar${r.ambiguous ? " is-ambiguous" : ""}`}
            >
              <div className="dim-bar-head">
                <span className="dim-bar-name">{DIMENSION_LABELS[dim]}</span>
                <span className="dim-bar-letters">
                  {dim[0]} / {dim[1]} &#8594; {t("dimBarLabel", { dim: DIMENSION_LABELS[dim], letter: r.letter, percent: r.letterPercent })}
                </span>
              </div>
              <div
                className="dim-bar-track"
                role="progressbar"
                aria-valuenow={r.letterPercent}
                aria-valuemin={50}
                aria-valuemax={100}
                aria-label={t("dimBarLabel", { dim: DIMENSION_LABELS[dim], letter: r.letter, percent: r.letterPercent })}
              >
                <div
                  className="dim-bar-fill"
                  style={{ width: `${r.letterPercent}%` }}
                />
              </div>
              <div className="dim-bar-percent">{r.letterPercent}%</div>
            </div>
          );
        })}
      </div>

      <div className="radar-result-wrap" style={{ marginTop: "1.5rem" }}>
        <RadarChart
          data={DIMENSION_ORDER.map((dim) => {
            const r = result.dimensions[dim];
            return {
              label: DIMENSION_LABELS[dim],
              value: r.letterPercent,
              letter: r.letter,
            };
          })}
          centerLabel={result.code}
          ariaTitle={`MBTI ${t("dimLabel")}（${result.code}）`}
          color="--terracotta"
          size={280}
        />
      </div>

      {result.hasAmbiguous && (
        <div className="quiz-result-confidence" role="note">
          <span aria-hidden="true">&#8505;&#65039;</span>
          <span>{t("confidenceNote")}</span>
        </div>
      )}

      {type && (
        <div className="quiz-result-cols">
          <div>
            <h3>{t("strengths")}</h3>
            <ul>
              {type.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("growth")}</h3>
            <ul>
              {type.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="quiz-result-actions">
        {type && (
          <Link href={`/types/${type.code}`} className="btn btn-primary">
            {t("readFull", { code: type.code })}
          </Link>
        )}
        <Link href="/types" className="btn btn-ghost">
          {t("browseAll")}
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onCopy}>
          {copyStatus === "copied" ? t("copied") : t("copyLink")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onShare}>
          {t("share")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          {t("retake")}
        </button>
      </div>
    </div>
  );
}
