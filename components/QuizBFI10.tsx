"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BFI10_QUESTIONS,
  type BigFiveDimension,
} from "@/lib/data/bfi10-questions";
import {
  BIG_FIVE_DIMENSIONS,
  BIG_FIVE_ORDER,
} from "@/lib/data/big-five-dimensions";
import {
  BFI10_ANSWERS_STORAGE_KEY,
  BFI10_RESULT_STORAGE_KEY,
  encodeBFI10ForUrl,
  getATPerspective,
  scoreBFI10,
  type BFI10Answers,
  type BFI10Likert,
  type BFI10Result,
} from "@/lib/bfi10-scoring";
import { saveQuizHistory } from "@/lib/quiz-storage";
import RadarChart from "@/components/RadarChart";
import InsightSection from "@/components/InsightSection";
import CareerSection from "@/components/CareerSection";
import { getBfi10Insights } from "@/lib/personality-insights";
import { getBfi10Careers } from "@/lib/career-matches";

type Phase = "intro" | "answering" | "result";

function useLikertOptions() {
  const t = useTranslations("quizBFI10.likert");
  return [
    { value: 1 as BFI10Likert, label: t("0.label"), aria: t("0.aria") },
    { value: 2 as BFI10Likert, label: t("1.label"), aria: t("1.aria") },
    { value: 3 as BFI10Likert, label: t("2.label"), aria: t("2.aria") },
    { value: 4 as BFI10Likert, label: t("3.label"), aria: t("3.aria") },
    { value: 5 as BFI10Likert, label: t("4.label"), aria: t("4.aria") },
  ];
}

export default function QuizBFI10() {
  const t = useTranslations("quizBFI10");
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<BFI10Answers>({});
  const [result, setResult] = useState<BFI10Result | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hydrated) return;
    if (typeof window === "undefined") return;
    let nextPhase: Phase | null = null;
    let nextResult: BFI10Result | null = null;
    let nextAnswers: BFI10Answers | null = null;
    let nextQIdx: number | null = null;
    try {
      const savedResult = window.sessionStorage.getItem(BFI10_RESULT_STORAGE_KEY);
      const savedAnswers = window.sessionStorage.getItem(BFI10_ANSWERS_STORAGE_KEY);
      if (savedResult) {
        nextResult = JSON.parse(savedResult) as BFI10Result;
        nextAnswers = savedAnswers ? (JSON.parse(savedAnswers) as BFI10Answers) : {};
        nextPhase = "result";
      } else if (savedAnswers) {
        const a = JSON.parse(savedAnswers) as BFI10Answers;
        const nextUnanswered = BFI10_QUESTIONS.findIndex((q) => !(q.id in a));
        nextAnswers = a;
        if (nextUnanswered >= 0) {
          nextQIdx = nextUnanswered;
          nextPhase = "answering";
        }
      }
    } catch {
      // ignore
    }
    if (nextResult) setResult(nextResult);
    if (nextAnswers) setAnswers(nextAnswers);
    if (nextQIdx !== null) setQIdx(nextQIdx);
    if (nextPhase) setPhase(nextPhase);
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Object.keys(answers).length === 0) {
      window.sessionStorage.removeItem(BFI10_ANSWERS_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(BFI10_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (result) {
      window.sessionStorage.setItem(BFI10_RESULT_STORAGE_KEY, JSON.stringify(result));
    } else {
      window.sessionStorage.removeItem(BFI10_RESULT_STORAGE_KEY);
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

  function pickAnswer(score: BFI10Likert) {
    const q = BFI10_QUESTIONS[qIdx];
    const next: BFI10Answers = { ...answers, [q.id]: score };
    setAnswers(next);

    if (qIdx < BFI10_QUESTIONS.length - 1) {
      setTimeout(() => setQIdx((i) => i + 1), 220);
    } else {
      const r = scoreBFI10(next);
      setTimeout(() => {
        setResult(r);
        setPhase("result");
        saveQuizHistory({ type: "bfi10", completedAt: Date.now(), result: r });
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
      window.sessionStorage.removeItem(BFI10_RESULT_STORAGE_KEY);
      window.sessionStorage.removeItem(BFI10_ANSWERS_STORAGE_KEY);
    }
  }

  function copyShareLink() {
    if (!result || typeof window === "undefined") return;
    const url = `${window.location.origin}/?result=bfi10:${encodeBFI10ForUrl(result)}`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url).then(() => {
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2400);
      });
    }
  }

  return (
    <section
      className="section quiz-bg"
      id="quiz-bfi10"
      aria-labelledby="quiz-bfi10-title"
    >
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">{t("tag")}</span>
          </div>
          <h2 className="section-title" id="quiz-bfi10-title">
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
          {phase === "intro" && <Bfi10Intro onStart={startQuiz} />}
          {phase === "answering" && (
            <Bfi10Answering
              qIdx={qIdx}
              total={BFI10_QUESTIONS.length}
              answers={answers}
              onPick={pickAnswer}
              onPrev={goPrev}
            />
          )}
          {phase === "result" && result && (
            <Bfi10Result
              result={result}
              onReset={reset}
              onCopy={copyShareLink}
              copyStatus={copyStatus}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Bfi10Intro({ onStart }: { onStart: () => void }) {
  const t = useTranslations("quizBFI10.intro");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <div className="quiz-card-shell bfi10-intro">
      <div className="quiz-meta-dim" aria-hidden="true">
        {t("ready")}
      </div>
      <h3 className="bfi10-question-text" style={{ marginTop: 8 }}>
        {t("heading")}
      </h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, margin: "0.75rem auto 0" }}>
        {t("desc")}
      </p>
      <div className="quiz-intro-stats">
        {stats.map((s) => (
          <div className="quiz-intro-stat" key={s.label || s.value}>
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

function Bfi10Answering({
  qIdx,
  total,
  answers,
  onPick,
  onPrev,
}: {
  qIdx: number;
  total: number;
  answers: BFI10Answers;
  onPick: (s: BFI10Likert) => void;
  onPrev: () => void;
}) {
  const ta = useTranslations("quizBFI10.answering");
  const likert = useLikertOptions();
  const q = BFI10_QUESTIONS[qIdx];
  const dimMeta = BIG_FIVE_DIMENSIONS[q.dimension];
  const current = answers[q.id];
  const progress = Math.round(((qIdx + 1) / total) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          {dimMeta.icon} {dimMeta.name} &#183; {qIdx + 1} / {total} {ta("progressLabel", { current: qIdx + 1, total })}
        </span>
        <span className="quiz-meta-step">{qIdx + 1} / {total}</span>
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

      <p className="bfi10-question-text">{q.text}</p>

      <div className="likert-row bfi10-likert-row" role="group" aria-label="同意度选项">
        {likert.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="likert-btn bfi10-likert-btn"
            aria-label={`${opt.aria} — ${q.text}`}
            aria-pressed={current === opt.value}
            onClick={() => onPick(opt.value)}
          >
            <span className="likert-num" aria-hidden="true">{opt.value}</span>
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

function Bfi10Result({
  result,
  onReset,
  onCopy,
  copyStatus,
}: {
  result: BFI10Result;
  onReset: () => void;
  onCopy: () => void;
  copyStatus: "idle" | "copied";
}) {
  const t = useTranslations("quizBFI10.result");
  const dimensions: BigFiveDimension[] = useMemo(() => BIG_FIVE_ORDER, []);
  const insight = useMemo(() => getBfi10Insights(result), [result]);
  const careers = useMemo(() => getBfi10Careers(result), [result]);

  return (
    <div className="quiz-result" aria-live="polite">
      <div className="quiz-meta-dim" aria-hidden="true">
        {t("portrait")}
      </div>
      <div className="quiz-result-name" style={{ marginTop: 12 }}>
        {t("distribution")}
      </div>
      <p className="quiz-result-tagline">
        {t("tagline")}
      </p>

      {/* 洞察叙事引擎 */}
      <InsightSection insight={insight} />

      {/* 职业匹配引擎 */}
      <CareerSection careers={careers} />

      <div className="dim-bars" aria-label="大五人格五维度分布">
        {dimensions.map((d) => {
          const pct = result[d];
          const meta = BIG_FIVE_DIMENSIONS[d];
          const level = result.profile[d];
          return (
            <div key={d} className="dim-bar">
              <div className="dim-bar-head">
                <span className="dim-bar-name">
                  {meta.icon} {meta.name}
                </span>
                <span className="dim-bar-letters">
                  {meta.fullName} &#183; {level}
                </span>
              </div>
              <div
                className="dim-bar-track"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${meta.name}：${pct} 分（${level}）`}
              >
                <div className="dim-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="dim-bar-percent">{pct}</div>
              <p style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginTop: "0.4rem",
                lineHeight: 1.6,
              }}>
                {level === "高" ? meta.high : level === "低" ? meta.low : `${meta.description}（处于平衡区）`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="radar-result-wrap" style={{ marginTop: "1.5rem" }}>
        <RadarChart
          data={dimensions.map((d) => {
            const meta = BIG_FIVE_DIMENSIONS[d];
            return {
              label: meta.name,
              value: result[d],
              letter: meta.fullName,
              emoji: meta.icon,
            };
          })}
          ariaTitle="大五人格五维度雷达图"
          color="--sage"
          size={320}
        />
      </div>

      <ATPerspectiveCard N={result.N} />

      <div className="quiz-result-actions">
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          {copyStatus === "copied" ? t("copied") : t("copyLink")}
        </button>
        <Link href="/#quiz" className="btn btn-ghost">
          {t("mbtiLink")}
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          {t("retake")}
        </button>
      </div>

      <p style={{
        marginTop: "1.25rem",
        fontSize: "0.82rem",
        color: "var(--text-muted)",
      }}>
        {t("footnote")}
      </p>
    </div>
  );
}

function ATPerspectiveCard({ N }: { N: number }) {
  const at = getATPerspective(N);
  const t = useTranslations("quizBFI10.result");
  return (
    <div className="at-perspective" aria-labelledby="at-title">
      <div className="at-perspective-head">
        <span className="at-perspective-eyebrow">
          {t("atEyebrow")}
        </span>
        <h3 className="at-perspective-title" id="at-title">
          {t("atTitle")}
        </h3>
      </div>
      <div className="at-perspective-badge">{at.label}</div>
      <p className="at-perspective-subtitle">{at.subtitle}</p>
      <p className="at-perspective-desc">{at.description}</p>
      <div className="at-perspective-grid">
        <div className="at-perspective-block">
          <div className="at-perspective-block-label">{t("atStrengths")}</div>
          <div className="at-perspective-block-text">{at.strength}</div>
        </div>
        <div className="at-perspective-block">
          <div className="at-perspective-block-label">{t("atWatchout")}</div>
          <div className="at-perspective-block-text">{at.watchout}</div>
        </div>
      </div>
      <p className="at-perspective-footnote">
        {t("atFootnote")}
      </p>
    </div>
  );
}
