"use client";

import Link from "next/link";
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
  const [hydrated, setHydrated] = useState(false);
  const [entries, setEntries] = useState<QuizHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getQuizHistory());
    setHydrated(true);
  }, []);

  // 监听跨标签更新
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
    const ok = window.confirm("确定要清空所有测评历史吗？此操作无法撤销。");
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
            <span className="tag">📜 我的轨迹</span>
          </div>
          <h2 className="section-title" id="quiz-history-title">
            你过往的测评记录
          </h2>
          <p className="section-subtitle">
            一切结果都只在你这台浏览器里保存。回看时间线，看见自己的变化。
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
            清空历史
          </button>
        </div>
      </div>
    </section>
  );
}

function MBTIHistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: MBTIHistoryResult }) {
  const type = getTypeByCode(result.code);
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{type?.icon ?? "🧭"}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">MBTI · {result.code}</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          {type ? `${type.nameZh} — ${type.shortDesc}` : "MBTI 测评结果"}
        </div>
      </div>
      {type && (
        <Link href={`/types/${type.code}`} className="btn btn-ghost btn-sm">
          查看
        </Link>
      )}
    </>
  );
}

function BFI10HistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: BFI10Result }) {
  // 找最高维度
  let topDim = BIG_FIVE_ORDER[0];
  let topVal = -1;
  for (const d of BIG_FIVE_ORDER) {
    if (result[d] > topVal) {
      topVal = result[d];
      topDim = d;
    }
  }
  const topMeta = BIG_FIVE_DIMENSIONS[topDim];
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{topMeta.icon}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">大五 BFI-10</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          主导维度「{topMeta.name}」{topVal} · O{result.O} C{result.C} E{result.E} A{result.A} N{result.N}
        </div>
      </div>
      <Link href="/#quiz-bfi10" className="btn btn-ghost btn-sm">再测</Link>
    </>
  );
}

function HexacoHistoryRow({ entry, result }: { entry: QuizHistoryEntry; result: HexacoResult }) {
  // 找最高维度
  let topDim = HEXACO_ORDER[0];
  let topVal = -1;
  for (const d of HEXACO_ORDER) {
    if (result[d] > topVal) {
      topVal = result[d];
      topDim = d;
    }
  }
  const topMeta = HEXACO_DIMENSIONS[topDim];
  return (
    <>
      <div className="quiz-history-icon" aria-hidden="true">{topMeta.icon}</div>
      <div className="quiz-history-body">
        <div className="quiz-history-head">
          <span className="quiz-history-type">HEXACO 六维</span>
          <span className="quiz-history-time">{fmtTime(entry.completedAt)}</span>
        </div>
        <div className="quiz-history-desc">
          主导维度「{topMeta.name}」{topVal} · H{result.H} E{result.E} X{result.X} A{result.A} C{result.C} O{result.O}
        </div>
      </div>
      <Link href="/hexaco" className="btn btn-ghost btn-sm">再测</Link>
    </>
  );
}
