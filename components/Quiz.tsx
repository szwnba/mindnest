"use client";

import Link from "next/link";
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

type Phase = "intro" | "answering" | "result";

const LIKERT_OPTIONS: { value: LikertScore; label: string; aria: string }[] = [
  { value: 1, label: "非常不同意", aria: "1 分：非常不同意" },
  { value: 2, label: "不同意", aria: "2 分：不同意" },
  { value: 3, label: "中立", aria: "3 分：中立" },
  { value: 4, label: "同意", aria: "4 分：同意" },
  { value: 5, label: "非常同意", aria: "5 分：非常同意" },
];

const DIMENSION_ORDER: Dimension[] = ["EI", "SN", "TF", "JP"];

/** 计算「该维度第 N / 7 题」 */
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
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // ── 从 sessionStorage 恢复（一次性 hydration；setState 是必要的） ──
  useEffect(() => {
    if (hydrated) return;
    if (typeof window === "undefined") return;
    let nextPhase: Phase | null = null;
    let nextResult: QuizResult | null = null;
    let nextAnswers: Answers | null = null;
    let nextQIdx: number | null = null;
    try {
      const savedResult = window.sessionStorage.getItem(STORAGE_KEY);
      const savedAnswers = window.sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      if (savedResult) {
        nextResult = JSON.parse(savedResult) as QuizResult;
        nextAnswers = savedAnswers ? (JSON.parse(savedAnswers) as Answers) : {};
        nextPhase = "result";
      } else if (savedAnswers) {
        const a = JSON.parse(savedAnswers) as Answers;
        const nextUnanswered = QUIZ_QUESTIONS.findIndex((q) => !(q.id in a));
        nextAnswers = a;
        if (nextUnanswered >= 0) {
          nextQIdx = nextUnanswered;
          nextPhase = "answering";
        }
      }
    } catch {
      // 解析失败时忽略，重新开始
    }
    // React 19 / Next.js 16 在同一 microtask 中会 batch 这些 setState，只触发一次 re-render
    /* eslint-disable react-hooks/set-state-in-effect */
    if (nextResult) setResult(nextResult);
    if (nextAnswers) setAnswers(nextAnswers);
    if (nextQIdx !== null) setQIdx(nextQIdx);
    if (nextPhase) setPhase(nextPhase);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [hydrated]);

  // ── 持久化 ──
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
    // 滚动到 quiz 顶部
    queueMicrotask(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function pickAnswer(score: LikertScore) {
    const q = QUIZ_QUESTIONS[qIdx];
    const next: Answers = { ...answers, [q.id]: score };
    setAnswers(next);

    if (qIdx < QUIZ_QUESTIONS.length - 1) {
      // 给用户视觉反馈：选完之后自动进入下一题（小延迟）
      setTimeout(() => {
        setQIdx((i) => i + 1);
      }, 220);
    } else {
      // 最后一题：直接出结果
      const r = computeResult(next);
      setTimeout(() => {
        setResult(r);
        setPhase("result");
        // 写入持久化测评历史（localStorage）
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
    const text = `我在心栖 MindNest 测出的人格类型是 ${result.code}。看看你的：${typeUrl}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: `我是 ${result.code}`, text, url: typeUrl }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        alert("分享文本已复制到剪贴板");
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

  return (
    <section className="section quiz-bg" id="quiz" aria-labelledby="quiz-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">互动测评</span>
          </div>
          <h2 className="section-title" id="quiz-title">
            开始你的人格探索之旅
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            请根据你最自然的反应来选择，没有对错之分。真实地回答，才能获得最准确的结果。
          </p>
        </div>

        {/* 交互阶段（answering/result）直接 visible，避免 IntersectionObserver 与 scrollIntoView(smooth) 竞态 */}
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

/* ────────────────────────────────────────────── */
/*  Intro Panel                                   */
/* ────────────────────────────────────────────── */
function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="quiz-card-shell quiz-intro">
      <div className="quiz-meta-dim" aria-hidden="true">
        准备好了吗
      </div>
      <h3 className="quiz-question-text" style={{ marginTop: 8 }}>
        28 道题，约 6-8 分钟，看见更立体的自己
      </h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, margin: "0.75rem auto 0" }}>
        本测评基于荣格类型学的 4 个核心维度（能量取向、信息加工、决策风格、生活节奏），
        每个维度 7 题（含正反向题平衡测谎），采用 5 点 Likert 量表评分。
        请在安静的环境下，凭直觉选择最贴近自己日常状态的选项。
      </p>
      <div className="quiz-intro-stats">
        <div className="quiz-intro-stat">
          <strong>28</strong>
          道题
        </div>
        <div className="quiz-intro-stat">
          <strong>4</strong>
          个核心维度
        </div>
        <div className="quiz-intro-stat">
          <strong>5</strong>
          点 Likert
        </div>
        <div className="quiz-intro-stat">
          <strong>~ 7</strong>
          分钟
        </div>
      </div>
      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        开始测评
        <span aria-hidden="true">→</span>
      </button>
      <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        测评结果仅保存在你当前浏览器的 sessionStorage 中，刷新不丢；关闭标签页或重新测评会清除。
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Answering Panel                                */
/* ────────────────────────────────────────────── */
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
  const q = QUIZ_QUESTIONS[qIdx];
  const { dim, nth } = dimensionProgress(qIdx);
  const dimLabel = DIMENSION_LABELS[dim];
  const current = answers[q.id];
  const progress = Math.round(((qIdx + 1) / total) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          {dimLabel} · 第 {nth} / 7 题
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
        aria-label={`测评进度：第 ${qIdx + 1} 题，共 ${total} 题`}
      >
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="quiz-question-text">{q.text}</p>

      <div className="likert-row" role="group" aria-label="同意度选项">
        {LIKERT_OPTIONS.map((opt) => (
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
          aria-label="返回上一题"
        >
          ← 上一题
        </button>
        <span className="quiz-skip-hint">
          选择即自动进入下一题。最后一题选完会出结果。
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Result Panel                                   */
/* ────────────────────────────────────────────── */
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
  const type = useMemo(() => getTypeByCode(result.code), [result.code]);

  return (
    <div className="quiz-result" aria-live="polite">
      <div className="quiz-meta-dim" aria-hidden="true">
        你的人格画像
      </div>
      <div className="quiz-result-code">
        {result.code}
        {result.hasAmbiguous ? (
          <span
            style={{ fontSize: "0.4em", marginLeft: 12, color: "var(--text-muted)" }}
            aria-label="带有游移维度"
          >
            · 游移
          </span>
        ) : null}
      </div>
      <div className="quiz-result-name">
        {type ? `${type.icon} ${type.nameZh}` : result.code}
      </div>
      {type && <p className="quiz-result-tagline">{type.shortDesc}</p>}

      <div className="dim-bars" aria-label="四维度分布">
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
                  {dim[0]} / {dim[1]} → 偏向 {r.letter}
                </span>
              </div>
              <div
                className="dim-bar-track"
                role="progressbar"
                aria-valuenow={r.letterPercent}
                aria-valuemin={50}
                aria-valuemax={100}
                aria-label={`${DIMENSION_LABELS[dim]}：偏向 ${r.letter} ${r.letterPercent}%`}
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

      {/* MBTI 四边形雷达图 */}
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
          ariaTitle={`MBTI 四维度雷达图（${result.code}）`}
          color="--terracotta"
          size={280}
        />
      </div>

      {result.hasAmbiguous && (
        <div className="quiz-result-confidence" role="note">
          <span aria-hidden="true">ℹ️</span>
          <span>
            你在某些维度的得分非常接近 50%，说明你在这两种倾向之间游移。
            这并不代表测评不准，而是你确实兼具两种特质——结果可能受当前情境影响。
            建议过一段时间再做一次，关注反复出现的模式。
          </span>
        </div>
      )}

      {type && (
        <div className="quiz-result-cols">
          <div>
            <h3>你的天然优势</h3>
            <ul>
              {type.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>成长方向</h3>
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
            阅读完整 {type.code} 报告 →
          </Link>
        )}
        <Link href="/types" className="btn btn-ghost">
          浏览全部 16 类型
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onCopy}>
          {copyStatus === "copied" ? "✓ 链接已复制" : "📋 复制结果链接"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onShare}>
          分享结果
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          重新测试
        </button>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.1rem 1.25rem",
          borderRadius: 14,
          background: "var(--bg-elev-1, rgba(168, 184, 168, 0.08))",
          border: "1px solid var(--border-soft, rgba(110, 130, 110, 0.18))",
          textAlign: "center",
        }}
      >
        <strong style={{ color: "var(--sage-dark)" }}>🌿 继续做大五人格测评</strong>
        <span style={{ color: "var(--text-secondary)" }}>
          {" "}— 用学界 BFI-10 量表，再花 60 秒补一个互补视角。{" "}
        </span>
        <Link href="/#quiz-bfi10" className="btn btn-primary btn-sm" style={{ marginTop: "0.6rem" }}>
          继续做大五人格测评 →
        </Link>
      </div>

      <p
        style={{
          marginTop: "1.25rem",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
        }}
      >
        想要更深的认知功能拆解、压力反应模式与职业地图？
        我们正在打磨「深度报告」服务，
        <Link href="/#cta-newsletter" style={{ color: "var(--sage-dark)" }}>
          点击订阅通讯
        </Link>{" "}
        在它上线时第一时间收到通知。
      </p>
    </div>
  );
}
