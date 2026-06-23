"use client";

import Link from "next/link";
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

type Phase = "intro" | "answering" | "result";

const LIKERT_OPTIONS: { value: BFI10Likert; label: string; aria: string }[] = [
  { value: 1, label: "非常不同意", aria: "1 分：非常不同意" },
  { value: 2, label: "不同意", aria: "2 分：不同意" },
  { value: 3, label: "中立", aria: "3 分：中立" },
  { value: 4, label: "同意", aria: "4 分：同意" },
  { value: 5, label: "非常同意", aria: "5 分：非常同意" },
];

export default function QuizBFI10() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<BFI10Answers>({});
  const [result, setResult] = useState<BFI10Result | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 从 sessionStorage 恢复
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
      // 忽略
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (nextResult) setResult(nextResult);
    if (nextAnswers) setAnswers(nextAnswers);
    if (nextQIdx !== null) setQIdx(nextQIdx);
    if (nextPhase) setPhase(nextPhase);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [hydrated]);

  // 持久化
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
        // 写入测评历史
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
            <span className="tag">学界量表 · BFI-10</span>
          </div>
          <h2 className="section-title" id="quiz-bfi10-title">
            也试试大五人格（10 题，约 60 秒）
          </h2>
          <p
            className="section-subtitle"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            BFI-10 是 Rammstedt &amp; John（2007）提出的学界标准短量表，
            覆盖开放性、尽责性、外向性、宜人性、神经质五大维度。
            适合作为 MBTI 之外的补充视角。
          </p>
        </div>

        {/* 交互阶段（answering/result）直接 visible，避免 IntersectionObserver 与 scrollIntoView(smooth) 竞态 */}
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

/* ────────────────── Intro ────────────────── */
function Bfi10Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="quiz-card-shell bfi10-intro">
      <div className="quiz-meta-dim" aria-hidden="true">
        准备好了吗
      </div>
      <h3 className="bfi10-question-text" style={{ marginTop: 8 }}>
        10 道题，60 秒，五维度全景画像
      </h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, margin: "0.75rem auto 0" }}>
        本量表为学界标准的 BFI-10 短版人格测评，每个维度仅 2 题（一正一反），
        在保持心理测量效度的同时把作答时间压到最短。
        请凭直觉作答，不必反复斟酌。
      </p>
      <div className="quiz-intro-stats">
        <div className="quiz-intro-stat"><strong>10</strong>道题</div>
        <div className="quiz-intro-stat"><strong>5</strong>个维度</div>
        <div className="quiz-intro-stat"><strong>5</strong>点 Likert</div>
        <div className="quiz-intro-stat"><strong>~ 60s</strong></div>
      </div>
      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        开始大五测评
        <span aria-hidden="true">→</span>
      </button>
      <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        测评结果保存在你浏览器本地（localStorage 历史 + sessionStorage 当前进度），不会上传。
      </p>
    </div>
  );
}

/* ────────────────── Answering ────────────────── */
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
  const q = BFI10_QUESTIONS[qIdx];
  const dimMeta = BIG_FIVE_DIMENSIONS[q.dimension];
  const current = answers[q.id];
  const progress = Math.round(((qIdx + 1) / total) * 100);

  return (
    <div className="quiz-card-shell">
      <div className="quiz-meta">
        <span className="quiz-meta-dim">
          {dimMeta.icon} {dimMeta.name} · 第 {qIdx + 1} / {total} 题
        </span>
        <span className="quiz-meta-step">{qIdx + 1} / {total}</span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuenow={qIdx + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`大五测评进度：第 ${qIdx + 1} 题，共 ${total} 题`}
      >
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="bfi10-question-text">{q.text}</p>

      <div className="likert-row bfi10-likert-row" role="group" aria-label="同意度选项">
        {LIKERT_OPTIONS.map((opt) => (
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
          aria-label="返回上一题"
        >
          ← 上一题
        </button>
        <span className="quiz-skip-hint">
          选择即自动进入下一题。
        </span>
      </div>
    </div>
  );
}

/* ────────────────── Result ────────────────── */
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
  const dimensions: BigFiveDimension[] = useMemo(() => BIG_FIVE_ORDER, []);

  return (
    <div className="quiz-result" aria-live="polite">
      <div className="quiz-meta-dim" aria-hidden="true">
        你的大五人格画像
      </div>
      <div className="quiz-result-name" style={{ marginTop: 12 }}>
        🌿 五维度分布
      </div>
      <p className="quiz-result-tagline">
        百分位 0-100；&lt;40 偏低，40-60 中等，&gt;60 偏高。每个人都是五维度的独特组合。
      </p>

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

      {/* BFI-10 五边形雷达图 */}
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

      {/* A/T 情绪稳定性视角 */}
      <ATPerspectiveCard N={result.N} />

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
        BFI-10 来自学术文献（Rammstedt &amp; John, 2007），适合快速画像；
        若想要细分到 60 个 facet，请期待 BFI-2 完整版的上线通知。
      </p>
    </div>
  );
}

/* ──────────────── A/T 情绪稳定性视角 ──────────────── */
function ATPerspectiveCard({ N }: { N: number }) {
  const at = getATPerspective(N);
  return (
    <div className="at-perspective" aria-labelledby="at-title">
      <div className="at-perspective-head">
        <span className="at-perspective-eyebrow">
          🎭 16Personalities 的 -A / -T 是什么？
        </span>
        <h3 className="at-perspective-title" id="at-title">
          你的情绪稳定性视角
        </h3>
      </div>
      <div className="at-perspective-badge">{at.label}</div>
      <p className="at-perspective-subtitle">{at.subtitle}</p>
      <p className="at-perspective-desc">{at.description}</p>
      <div className="at-perspective-grid">
        <div className="at-perspective-block">
          <div className="at-perspective-block-label">✓ 优势</div>
          <div className="at-perspective-block-text">{at.strength}</div>
        </div>
        <div className="at-perspective-block">
          <div className="at-perspective-block-label">⚠ 注意</div>
          <div className="at-perspective-block-text">{at.watchout}</div>
        </div>
      </div>
      <p className="at-perspective-footnote">
        注：16Personalities 用 -A / -T 标记这个维度；MindNest 使用学界标准的 Big Five 神经质（N）来测量同一特质。
      </p>
    </div>
  );
}
