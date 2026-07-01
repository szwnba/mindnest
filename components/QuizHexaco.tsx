"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  HEXACO_QUESTIONS,
  HEXACO_DIMENSIONS,
  HEXACO_ORDER,
  type HexacoDimension,
} from "@/lib/data/hexaco-questions";
import {
  HEXACO_ANSWERS_STORAGE_KEY,
  HEXACO_RESULT_STORAGE_KEY,
  encodeHexacoForUrl,
  scoreHexaco,
  type HexacoAnswers,
  type HexacoLikert,
  type HexacoResult,
} from "@/lib/hexaco-scoring";
import { saveQuizHistory } from "@/lib/quiz-storage";
import RadarChart from "@/components/RadarChart";
import InsightSection from "@/components/InsightSection";
import CareerSection from "@/components/CareerSection";
import { getHexacoInsights } from "@/lib/personality-insights";
import { getHexacoCareers } from "@/lib/career-matches";

type Phase = "intro" | "answering" | "result";

function useLikertOptions() {
  const t = useTranslations("quizHexaco.likert");
  return [
    { value: 1 as HexacoLikert, label: t("0.label"), aria: t("0.aria") },
    { value: 2 as HexacoLikert, label: t("1.label"), aria: t("1.aria") },
    { value: 3 as HexacoLikert, label: t("2.label"), aria: t("2.aria") },
    { value: 4 as HexacoLikert, label: t("3.label"), aria: t("3.aria") },
    { value: 5 as HexacoLikert, label: t("4.label"), aria: t("4.aria") },
  ];
}

const QUESTIONS_PER_PAGE = 5;
const TOTAL_QUESTIONS = HEXACO_QUESTIONS.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

export default function QuizHexaco() {
  const t = useTranslations("quizHexaco");
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<HexacoAnswers>({});
  const answersRef = useRef<HexacoAnswers>({});
  const [result, setResult] = useState<HexacoResult | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hydrated) return;
    if (typeof window === "undefined") return;
    let nextPhase: Phase | null = null;
    let nextResult: HexacoResult | null = null;
    let nextAnswers: HexacoAnswers | null = null;
    let nextPage: number | null = null;
    try {
      const savedResult = window.sessionStorage.getItem(HEXACO_RESULT_STORAGE_KEY);
      const savedAnswers = window.sessionStorage.getItem(HEXACO_ANSWERS_STORAGE_KEY);
      if (savedResult) {
        nextResult = JSON.parse(savedResult) as HexacoResult;
        nextAnswers = savedAnswers ? (JSON.parse(savedAnswers) as HexacoAnswers) : {};
        nextPhase = "result";
      } else if (savedAnswers) {
        const a = JSON.parse(savedAnswers) as HexacoAnswers;
        const answeredCount = Object.keys(a).length;
        nextAnswers = a;
        nextPage = Math.min(Math.floor(answeredCount / QUESTIONS_PER_PAGE), TOTAL_PAGES - 1);
        nextPhase = "answering";
      }
    } catch {
      // ignore
    }
    if (nextResult) setResult(nextResult);
    if (nextAnswers) {
      setAnswers(nextAnswers);
      answersRef.current = nextAnswers;
    }
    if (nextPage !== null) setPage(nextPage);
    if (nextPhase) setPhase(nextPhase);
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Object.keys(answers).length === 0) {
      window.sessionStorage.removeItem(HEXACO_ANSWERS_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(HEXACO_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (result) {
      window.sessionStorage.setItem(HEXACO_RESULT_STORAGE_KEY, JSON.stringify(result));
    } else {
      window.sessionStorage.removeItem(HEXACO_RESULT_STORAGE_KEY);
    }
  }, [result]);

  function startQuiz() {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    setPage(0);
    setPhase("answering");
    queueMicrotask(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function pickAnswer(qId: number, score: HexacoLikert) {
    const next: HexacoAnswers = { ...answersRef.current, [qId]: score };
    answersRef.current = next;
    setAnswers(next);
  }

  function goNextPage() {
    if (page < TOTAL_PAGES - 1) {
      setPage((p) => p + 1);
      queueMicrotask(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      const r = scoreHexaco(answersRef.current);
      setResult(r);
      setPhase("result");
      saveQuizHistory({ type: "hexaco", completedAt: Date.now(), result: r });
      queueMicrotask(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function goPrevPage() {
    if (page > 0) {
      setPage((p) => p - 1);
      queueMicrotask(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function reset() {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    setPage(0);
    setPhase("intro");
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(HEXACO_RESULT_STORAGE_KEY);
      window.sessionStorage.removeItem(HEXACO_ANSWERS_STORAGE_KEY);
    }
  }

  function copyShareLink() {
    if (!result || typeof window === "undefined") return;
    const url = `${window.location.origin}/?result=hexaco:${encodeHexacoForUrl(result)}`;
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
      id="quiz-hexaco"
      aria-labelledby="quiz-hexaco-title"
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
          <h2 className="section-title" id="quiz-hexaco-title">
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
          {phase === "intro" && (
            <HexacoIntro
              onStart={startQuiz}
              answersRef={answersRef}
              setAnswers={setAnswers}
              setPage={setPage}
              setPhase={setPhase}
            />
          )}
          {phase === "answering" && (
            <HexacoAnswering
              page={page}
              answers={answers}
              onPick={pickAnswer}
              onPrev={goPrevPage}
              onNext={goNextPage}
            />
          )}
          {phase === "result" && result && (
            <HexacoResult
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

function getPageQuestions(pageIndex: number) {
  const start = pageIndex * QUESTIONS_PER_PAGE;
  return HEXACO_QUESTIONS.slice(start, start + QUESTIONS_PER_PAGE);
}

function HexacoIntro({
  onStart,
  answersRef: ref,
  setAnswers: setAns,
  setPage: setPg,
  setPhase: setPh,
}: {
  onStart: () => void;
  answersRef: MutableRefObject<HexacoAnswers>;
  setAnswers: Dispatch<SetStateAction<HexacoAnswers>>;
  setPage: Dispatch<SetStateAction<number>>;
  setPhase: Dispatch<SetStateAction<Phase>>;
}) {
  const t = useTranslations("quizHexaco.intro");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const savedAnswers = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem("mindnest:hexaco-answers-v1");
      if (raw) return Object.keys(JSON.parse(raw)).length;
    } catch { /* ignore */ }
    return null;
  }, []);
  const hasSaved = savedAnswers && savedAnswers > 0;

  return (
    <div className="quiz-card-shell hexaco-intro">
      {hasSaved && (
        <div className="resume-banner">
          <div className="resume-banner-text">
            <span className="resume-banner-title">{t("resumeTitle")}</span>
            <span className="resume-banner-progress">
              {t("resumeProgress", { answered: savedAnswers })}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              // Load saved answers and jump to next unanswered
              try {
                const raw = window.sessionStorage.getItem("mindnest:hexaco-answers-v1");
                if (raw) {
                  const parsed = JSON.parse(raw) as HexacoAnswers;
                  ref.current = parsed;
                  setAns(parsed);
                  const answeredCount = Object.keys(parsed).length;
                  const pageIndex = Math.min(
                    Math.floor(answeredCount / QUESTIONS_PER_PAGE),
                    TOTAL_PAGES - 1
                  );
                  setPg(pageIndex);
                  setPh("answering");
                }
              } catch { /* ignore */ }
            }}
          >
            {t("resumeBtn")}
          </button>
        </div>
      )}
      <div className="quiz-meta-dim" aria-hidden="true">
        {t("ready")}
      </div>
      <h3 className="hexaco-question-text" style={{ marginTop: 8 }}>
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

function HexacoAnswering({
  page,
  answers,
  onPick,
  onPrev,
  onNext,
}: {
  page: number;
  answers: HexacoAnswers;
  onPick: (qId: number, s: HexacoLikert) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const ta = useTranslations("quizHexaco.answering");
  const likert = useLikertOptions();
  const questions = getPageQuestions(page);
  const progress = Math.round(((page + 1) / TOTAL_PAGES) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          {ta("pageLabel", { current: page + 1, total: TOTAL_PAGES })}
        </span>
        <span className="quiz-meta-step">
          {Object.keys(answers).length} / {TOTAL_QUESTIONS} {ta("answeredLabel", { answered: Object.keys(answers).length, total: TOTAL_QUESTIONS })}
        </span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuenow={page + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_PAGES}
        aria-label={ta("progressLabel", { current: page + 1, total: TOTAL_PAGES })}
      >
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="hexaco-page-questions">
        {questions.map((q) => {
          const current = answers[q.id];
          const dimMeta = HEXACO_DIMENSIONS[q.dimension];
          return (
            <div key={q.id} className="hexaco-question-block">
              <div className="hexaco-question-meta">
                <span className="hexaco-question-dim">
                  {dimMeta.icon} {dimMeta.name}
                </span>
                <span className="hexaco-question-num">第 {q.id} {ta("answeredLabel", { answered: q.id, total: TOTAL_QUESTIONS })}</span>
              </div>
              <p className="hexaco-question-text">{q.text}</p>
              <div className="likert-row hexaco-likert-row" role="group" aria-label={`同意度选项 — ${q.text}`}>
                {likert.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="likert-btn hexaco-likert-btn"
                    aria-label={`${opt.aria} — ${q.text}`}
                    aria-pressed={current === opt.value}
                    onClick={() => onPick(q.id, opt.value)}
                  >
                    <span className="likert-num" aria-hidden="true">{opt.value}</span>
                    <span className="likert-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onPrev}
          disabled={page === 0}
          aria-label={ta("prevAria")}
        >
          {ta("prev")}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          aria-label={page === TOTAL_PAGES - 1 ? ta("finishAria") : ta("next")}
        >
          {page === TOTAL_PAGES - 1 ? ta("finish") : ta("next")}
        </button>
      </div>
    </div>
  );
}

function HexacoResult({
  result,
  onReset,
  onCopy,
  copyStatus,
}: {
  result: HexacoResult;
  onReset: () => void;
  onCopy: () => void;
  copyStatus: "idle" | "copied";
}) {
  const t = useTranslations("quizHexaco.result");
  const dimensions: HexacoDimension[] = useMemo(() => HEXACO_ORDER, []);
  const insight = useMemo(() => getHexacoInsights(result), [result]);
  const careers = useMemo(() => getHexacoCareers(result), [result]);

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

      <div className="dim-bars" aria-label="HEXACO 六维度分布">
        {dimensions.map((d) => {
          const pct = result[d];
          const meta = HEXACO_DIMENSIONS[d];
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
                {level === "高" ? meta.high : level === "低" ? meta.low : meta.medium}
              </p>
            </div>
          );
        })}
      </div>

      <div className="radar-result-wrap" style={{ marginTop: "1.5rem" }}>
        <RadarChart
          data={dimensions.map((d) => {
            const meta = HEXACO_DIMENSIONS[d];
            return {
              label: meta.name,
              value: result[d],
              letter: meta.fullName,
              emoji: meta.icon,
            };
          })}
          ariaTitle="HEXACO 六维度雷达图"
          color="--sage"
          size={320}
        />
      </div>

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
