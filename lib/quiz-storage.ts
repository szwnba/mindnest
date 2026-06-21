/**
 * 测评历史持久化（localStorage）。
 *
 * 设计要点：
 *  - 全部函数 SSR 安全：window 不在时返回 null/[] 而不是抛错。
 *  - 只存少量轻量字段，避免膨胀。最多保留 50 条。
 *  - 任何 JSON parse 异常都返回空数组（自愈）。
 */

import type { BFI10Result } from "./bfi10-scoring";
import type { QuizResult } from "./scoring";

export type QuizType = "mbti" | "bfi10";

export interface MBTIHistoryResult {
  code: string;
  /** EI/SN/TF/JP 的 letterPercent，便于历史摘要展示 */
  scores: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
}

export interface QuizHistoryEntry {
  id: string;
  type: QuizType;
  completedAt: number;
  result: MBTIHistoryResult | BFI10Result;
}

const HISTORY_KEY = "mindnest_quiz_history";
const MAX_HISTORY = 50;

function genId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeRead(): QuizHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as QuizHistoryEntry[];
  } catch {
    return [];
  }
}

function safeWrite(items: QuizHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
  } catch {
    // 配额满或无权访问，忽略
  }
}

export function saveQuizHistory(
  entry: Omit<QuizHistoryEntry, "id">,
): QuizHistoryEntry | null {
  if (typeof window === "undefined") return null;
  const full: QuizHistoryEntry = { ...entry, id: genId() };
  const list = safeRead();
  // 新的放前面
  list.unshift(full);
  safeWrite(list);
  return full;
}

export function getQuizHistory(): QuizHistoryEntry[] {
  return safeRead();
}

export function clearQuizHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

export function getLatestByType(type: QuizType): QuizHistoryEntry | null {
  const list = safeRead();
  for (const e of list) if (e.type === type) return e;
  return null;
}

/** 把 MBTI QuizResult 投影成轻量历史记录 */
export function projectMBTIResult(r: QuizResult): MBTIHistoryResult {
  return {
    code: r.code,
    scores: {
      EI: r.dimensions.EI.letterPercent,
      SN: r.dimensions.SN.letterPercent,
      TF: r.dimensions.TF.letterPercent,
      JP: r.dimensions.JP.letterPercent,
    },
  };
}
