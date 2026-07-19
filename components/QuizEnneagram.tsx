"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ENNEAGRAM_QUESTIONS,
} from "@/lib/data/enneagram-questions";

import { scoreEnneagram, type EnneagramAnswers } from "@/lib/enneagram-scoring";
import { type EnneagramResult } from "@/lib/data/enneagram-questions";
import { generateEnneagramInsight } from "@/lib/data/enneagram-types";

type Phase = "intro" | "answering" | "result";

const QUESTIONS_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(ENNEAGRAM_QUESTIONS.length / QUESTIONS_PER_PAGE);

export default function QuizEnneagram() {
  const t = useTranslations("quizEnneagram");
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<EnneagramResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [hydrated, setHydrated] = useState(false);

  //  hydration guard — 防止 SSR 与客户端初始渲染不一致
  useEffect(() => {
    setHydrated(true);
  }, []);

  const answersRef = useRef<EnneagramAnswers>({});
  const [answers, setAnswers] = useState<EnneagramAnswers>({});

  const totalQuestions = ENNEAGRAM_QUESTIONS.length;

  const startQuiz = useCallback(() => {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    setPage(0);
    setPhase("answering");
  }, []);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    setPage(0);
    setPhase("intro");
    try {
      window.sessionStorage.removeItem("mindnest:enneagram-result-v1");
      window.sessionStorage.removeItem("mindnest:enneagram-answers-v1");
    } catch { /* ignore */ }
  }, []);

  const pickAnswer = useCallback(
    (qId: number, score: number) => {
      const next = { ...answersRef.current, [qId]: score };
      answersRef.current = next;
      setAnswers(next);

      // 自动保存答题进度到 sessionStorage
      try {
        window.sessionStorage.setItem("mindnest:enneagram-answers-v1", JSON.stringify(next));
      } catch { /* ignore */ }

      // 自动跳转逻辑
      const currentQIndex = ENNEAGRAM_QUESTIONS.findIndex(q => q.id === qId);
      const isLastQuestion = currentQIndex === ENNEAGRAM_QUESTIONS.length - 1;
      const isLastInPage = (currentQIndex + 1) % QUESTIONS_PER_PAGE === 0;

      if (isLastQuestion) {
        // 最后一题：计分并跳转结果
        setTimeout(() => {
          const r = scoreEnneagram(next);
          if (r) {
            setResult(r);
            setPhase("result");
            try {
              window.sessionStorage.setItem("mindnest:enneagram-result-v1", JSON.stringify(r));
              window.sessionStorage.removeItem("mindnest:enneagram-answers-v1");
            } catch { /* ignore */ }
          }
        }, 200);
      } else if (isLastInPage) {
        // 页末自动翻页
        setTimeout(() => setPage((p) => Math.min(p + 1, TOTAL_PAGES - 1)), 150);
      }
    },
    [],
  );

  const handleCopy = useCallback(() => {
    if (!result) return;
    const type = result.dominantType;
    const wing = result.secondaryType;
    const url = `${window.location.origin}/enneagram?result=${type}w${wing}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }).catch(() => {
      // fallback
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    });
  }, [result]);

  const currentPageQuestions = useMemo(
    () => ENNEAGRAM_QUESTIONS.slice(
      page * QUESTIONS_PER_PAGE,
      (page + 1) * QUESTIONS_PER_PAGE,
    ),
    [page],
  );

  const currentProgress = useMemo(() => {
    return Object.keys(answersRef.current).length;
  }, [answers]);

  return (
    <div className="quiz-wrapper">
      {phase === "intro" && (
        <EnneagramIntro
          hydrated={hydrated}
          onStart={startQuiz}
          setAnswers={setAnswers}
          setPage={setPage}
          setPhase={setPhase}
        />
      )}
      {phase === "answering" && (
        <div className="quiz-card-shell enneagram-answering">
          <header className="quiz-progress-header">
            <h2>{t("answering.title")}</h2>
            <div
              className="quiz-progress-bar"
              role="progressbar"
              aria-valuenow={currentProgress}
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
            >
              <div
                className="quiz-progress-fill"
                style={{ width: `${(currentProgress / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="quiz-progress-label">
              {t("answering.progressLabel", {
                current: currentProgress,
                total: totalQuestions,
              })}
            </span>
          </header>

          <div className="enneagram-page">
            {currentPageQuestions.map((q) => (
              <div key={q.id} className="quiz-question-block">
                <p className="quiz-question-text">
                  {t(`questions.${q.id}`)}
                </p>
                <div className="likert-row" role="radiogroup">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSel = answers[q.id] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        className={`likert-btn${isSel ? " selected" : ""}`}
                        aria-pressed={isSel}
                        onClick={() => pickAnswer(q.id, val)}
                      >
                        <span className="likert-dot" />
                        <span className="likert-label">
                          {t(`likert.${val - 1}.label`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-page-actions">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              {t("answering.prev")}
            </button>
            <span className="quiz-page-indicator">
              {t("answering.pageIndicator", { current: page + 1, total: TOTAL_PAGES })}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page >= TOTAL_PAGES - 1}
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
            >
              {t("answering.next")}
            </button>
          </div>
        </div>
      )}
      {phase === "result" && result && (
        <EnneagramEnneagramResult
          result={result}
          onReset={resetQuiz}
          onCopy={handleCopy}
          copyStatus={copyStatus}
        />
      )}
    </div>
  );
}

function EnneagramIntro({
  hydrated,
  onStart,
  setAnswers: setAns,
  setPage: setPg,
  setPhase: setPh,
}: {
  hydrated: boolean;
  onStart: () => void;
  setAnswers: (a: EnneagramAnswers) => void;
  setPage: (n: number) => void;
  setPhase: (p: Phase) => void;
}) {
  const t = useTranslations("quizEnneagram.intro");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const savedAnswers = useMemo(() => {
    if (!hydrated) return null;
    try {
      const raw = window.sessionStorage.getItem("mindnest:enneagram-answers-v1");
      if (raw) return Object.keys(JSON.parse(raw)).length;
    } catch { /* ignore */ }
    return null;
  }, [hydrated]);
  const hasSaved = savedAnswers && savedAnswers > 0;

  return (
    <div className="quiz-card-shell enneagram-intro">
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
              try {
                const raw = window.sessionStorage.getItem("mindnest:enneagram-answers-v1");
                if (raw) {
                  const parsed = JSON.parse(raw) as EnneagramAnswers;
                  setAns(parsed);
                  const answeredCount = Object.keys(parsed).length;
                  const pageIndex = Math.min(
                    Math.floor(answeredCount / QUESTIONS_PER_PAGE),
                    TOTAL_PAGES - 1,
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
      <h2 className="quiz-title">{t("title")}</h2>
      <p className="quiz-tagline">{t("tagline")}</p>
      <div className="quiz-stats">
        {stats.map((s) => (
          <div key={s.label} className="quiz-stat">
            <span className="quiz-stat-value">{s.value}</span>
            <span className="quiz-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        {t("start")}
      </button>
      <p className="quiz-privacy-note">{t("privacyNote")}</p>
    </div>
  );
}

function EnneagramEnneagramResult({
  result,
  onReset,
  onCopy,
  copyStatus,
}: {
  result: EnneagramResult;
  onReset: () => void;
  onCopy: () => void;
  copyStatus: "idle" | "copied";
}) {
  const t = useTranslations("quizEnneagram.result");
  const insight = generateEnneagramInsight(result);
  const main = result.dominantType;
  const wing = result.secondaryType;

  // 找出最高分和第二高分
  const sortedScores = (Object.entries(result.scores) as [string, number][])
    .map(([type, score]) => ({ type: Number(type), score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="quiz-card-shell enneagram-result">
      <h2 className="quiz-title">{t("portrait")}</h2>

      {/* 主型大卡片 */}
      <div className="enneagram-main-card">
        <div className="enneagram-type-badge">
          <span className="enneagram-type-icon">
            {getEnneagramIcon(main)}
          </span>
          <span className="enneagram-type-code">{main}w{wing}</span>
        </div>
        <h3 className="enneagram-type-name">
          {t(`types.${main}.name`)}
        </h3>
        <p className="enneagram-type-subtitle">
          {t(`types.${main}.subtitle`)}
        </p>
      </div>

      {/* 洞察叙事 */}
      <div className="insight-narrative">
        <p>{insight}</p>
      </div>

      {/* 核心恐惧 / 欲望 */}
      <div className="enneagram-core-row">
        <div className="enneagram-core-card">
          <span className="enneagram-core-label">{t("coreFear")}</span>
          <span className="enneagram-core-value">
            {t(`types.${main}.coreFear`)}
          </span>
        </div>
        <div className="enneagram-core-card">
          <span className="enneagram-core-label">{t("coreDesire")}</span>
          <span className="enneagram-core-value">
            {t(`types.${main}.coreDesire`)}
          </span>
        </div>
      </div>

      {/* 分数分布 */}
      <div className="hexaco-distribution">
        <h3>{t("distribution")}</h3>
        <div className="hexaco-bars">
          {sortedScores.map(({ type, score }) => {
            const percent = ((score - 4) / 16) * 100;
            return (
              <div key={type} className="hexaco-bar-row">
                <span className="hexaco-bar-label">{type}</span>
                <div className="hexaco-bar-track">
                  <div
                    className="hexaco-bar-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="hexaco-bar-value">{Math.round(percent)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="quiz-result-actions">
        <button type="button" className="btn btn-secondary" onClick={onCopy}>
          {copyStatus === "copied" ? t("copied") : t("copyLink")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          {t("retake")}
        </button>
      </div>
    </div>
  );
}

function getEnneagramIcon(type: number): string {
  const icons: Record<number, string> = {
    1: "⚖️", 2: "💗", 3: "🏆", 4: "🎨",
    5: "🔬", 6: "🛡️", 7: "🎪", 8: "🦁", 9: "☮️",
  };
  return icons[type] || "❓";
}
