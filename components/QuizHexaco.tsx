"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

type Phase = "intro" | "answering" | "result";

const LIKERT_OPTIONS: { value: HexacoLikert; label: string; aria: string }[] = [
  { value: 1, label: "完全不同意", aria: "1 分：完全不同意" },
  { value: 2, label: "不同意", aria: "2 分：不同意" },
  { value: 3, label: "中立", aria: "3 分：中立" },
  { value: 4, label: "同意", aria: "4 分：同意" },
  { value: 5, label: "完全同意", aria: "5 分：完全同意" },
];

const QUESTIONS_PER_PAGE = 5;
const TOTAL_QUESTIONS = HEXACO_QUESTIONS.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

export default function QuizHexaco() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<HexacoAnswers>({});
  const [result, setResult] = useState<HexacoResult | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 从 sessionStorage 恢复
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
      // 忽略
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (nextResult) setResult(nextResult);
    if (nextAnswers) setAnswers(nextAnswers);
    if (nextPage !== null) setPage(nextPage);
    if (nextPhase) setPhase(nextPhase);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [hydrated]);

  // 持久化
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
    setResult(null);
    setPage(0);
    setPhase("answering");
    queueMicrotask(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function pickAnswer(qId: number, score: HexacoLikert) {
    const next: HexacoAnswers = { ...answers, [qId]: score };
    setAnswers(next);
  }

  function goNextPage() {
    if (page < TOTAL_PAGES - 1) {
      setPage((p) => p + 1);
      queueMicrotask(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      // 最后一页，完成测评
      const r = scoreHexaco(answers);
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
            <span className="tag">学界量表 · HEXACO-60</span>
          </div>
          <h2 className="section-title" id="quiz-hexaco-title">
            六大人格维度测试（60 题，约 8 分钟）
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            HEXACO 是当今学界认可度最高的人格模型之一，
            在大五人格基础上增加了「诚实-谦逊」维度，
            并对「宜人性」进行了更精确的重构。
            每个维度 10 题，覆盖 H、E、X、A、C、O 六大维度。
          </p>
        </div>

        <div ref={cardRef} className="quiz-wrapper reveal">
          {phase === "intro" && <HexacoIntro onStart={startQuiz} />}
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

/* ──────────────── Intro ──────────────── */
function HexacoIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="quiz-card-shell hexaco-intro">
      <div className="quiz-meta-dim" aria-hidden="true">
        准备好了吗
      </div>
      <h3 className="hexaco-question-text" style={{ marginTop: 8 }}>
        60 题码，6 维度，全景人格画像
      </h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, margin: "0.75rem auto 0" }}>
        本量表为 HEXACO-60 简化中文版，每个维度 10 题（含反向计分题）。
        请凭直觉作答，不必反复捎酌。没有对错之分，选择最符合你平时状态的选项即可。
      </p>
      <div className="quiz-intro-stats">
        <div className="quiz-intro-stat"><strong>60</strong>道题</div>
        <div className="quiz-intro-stat"><strong>6</strong>个维度</div>
        <div className="quiz-intro-stat"><strong>5</strong>点 Likert</div>
        <div className="quiz-intro-stat"><strong>~ 8min</strong></div>
      </div>
      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        开始 HEXACO 测评
        <span aria-hidden="true">→</span>
      </button>
      <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        测评结果保存在你浏览器本地（localStorage 历史 + sessionStorage 当前进度），不会上传。
      </p>
    </div>
  );
}

/* ──────────────── Answering ──────────────── */
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
  const questions = getPageQuestions(page);
  const progress = Math.round(((page + 1) / TOTAL_PAGES) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          第 {page + 1} / {TOTAL_PAGES} 页
        </span>
        <span className="quiz-meta-step">
          {Object.keys(answers).length} / {TOTAL_QUESTIONS} 题
        </span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuenow={page + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_PAGES}
        aria-label={`HEXACO 测评进度：第 ${page + 1} 页，共 ${TOTAL_PAGES} 页`}
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
                <span className="hexaco-question-num">第 {q.id} 题</span>
              </div>
              <p className="hexaco-question-text">{q.text}</p>
              <div className="likert-row hexaco-likert-row" role="group" aria-label={`同意度选项 — ${q.text}`}>
                {LIKERT_OPTIONS.map((opt) => (
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
          aria-label="返回上一页"
        >
          ← 上一页
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          aria-label={page === TOTAL_PAGES - 1 ? "完成测评" : "下一页"}
        >
          {page === TOTAL_PAGES - 1 ? "查看结果 →" : "下一页 →"}
        </button>
      </div>
    </div>
  );
}

/* ──────────────── Result ──────────────── */
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
  const dimensions: HexacoDimension[] = useMemo(() => HEXACO_ORDER, []);

  return (
    <div className="quiz-result" aria-live="polite">
      <div className="quiz-meta-dim" aria-hidden="true">
        你的 HEXACO 六维画像
      </div>
      <div className="quiz-result-name" style={{ marginTop: 12 }}>
        🤝 六维度分布
      </div>
      <p className="quiz-result-tagline">
        百分位 0-100；&lt;40 偏低，40-60 中等，&gt;60 偏高。每个人都是六维度的独特组合。
      </p>

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
                  {meta.fullName} · {level}
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

      {/* HEXACO 六边形雷达图 */}
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
          {copyStatus === "copied" ? "✓ 链接已复制" : "📋 复制结果链接"}
        </button>
        <Link href="/#quiz" className="btn btn-ghost">
          也做 MBTI 测评
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          重新测试
        </button>
      </div>

      <p style={{
        marginTop: "1.25rem",
        fontSize: "0.82rem",
        color: "var(--text-muted)",
      }}>
        量表基于 Ashton &amp; Lee (2009) HEXACO-60，是当今学界公认度最高的六维度人格测评工具之一。
      </p>
    </div>
  );
}
