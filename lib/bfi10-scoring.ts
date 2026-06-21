import {
  BFI10_QUESTIONS,
  type BigFiveDimension,
} from "./data/bfi10-questions";

export type BFI10Likert = 1 | 2 | 3 | 4 | 5;
export type BFI10Answers = Record<number, BFI10Likert>;

export type BFI10Level = "高" | "中" | "低";

export interface BFI10Result {
  /** 0-100 百分位（每维度） */
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
  /** 每维度的「高 / 中 / 低」标签 */
  profile: { O: BFI10Level; C: BFI10Level; E: BFI10Level; A: BFI10Level; N: BFI10Level };
  /** 时间戳（毫秒） */
  computedAt: number;
}

/**
 * 单题 raw 1..5；若 reverse 则取 6 - raw。
 * 每维度 2 题求和 ∈ [2, 10]，标准化为 (sum - 2) / 8 * 100 → 0..100。
 */
export function scoreBFI10(answers: BFI10Answers): BFI10Result {
  const sums: Record<BigFiveDimension, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  for (const q of BFI10_QUESTIONS) {
    const raw = (answers[q.id] ?? 3) as BFI10Likert;
    const score = q.reverse ? 6 - raw : raw;
    sums[q.dimension] += score;
  }

  function normalize(sum: number): number {
    // sum ∈ [2,10] → [0,100]
    const v = ((sum - 2) / 8) * 100;
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  function level(pct: number): BFI10Level {
    if (pct < 40) return "低";
    if (pct > 60) return "高";
    return "中";
  }

  const O = normalize(sums.O);
  const C = normalize(sums.C);
  const E = normalize(sums.E);
  const A = normalize(sums.A);
  const N = normalize(sums.N);

  return {
    O,
    C,
    E,
    A,
    N,
    profile: { O: level(O), C: level(C), E: level(E), A: level(A), N: level(N) },
    computedAt: Date.now(),
  };
}

export const BFI10_RESULT_STORAGE_KEY = "mindnest:bfi10-result-v1";
export const BFI10_ANSWERS_STORAGE_KEY = "mindnest:bfi10-answers-v1";

/** 把 BFI-10 结果编码到 URL 参数：e.g. "O72-C58-E33-A65-N42" */
export function encodeBFI10ForUrl(r: BFI10Result): string {
  return `O${r.O}-C${r.C}-E${r.E}-A${r.A}-N${r.N}`;
}

/** 从 URL 参数解码 BFI-10 结果（容错：缺失维度按 50 处理） */
export function decodeBFI10FromUrl(s: string): {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
} | null {
  if (!s) return null;
  const out = { O: 50, C: 50, E: 50, A: 50, N: 50 };
  let matched = 0;
  for (const part of s.split("-")) {
    const m = part.match(/^([OCEAN])(\d{1,3})$/i);
    if (!m) continue;
    const dim = m[1].toUpperCase() as "O" | "C" | "E" | "A" | "N";
    const v = Math.max(0, Math.min(100, parseInt(m[2], 10)));
    if (Number.isFinite(v)) {
      out[dim] = v;
      matched += 1;
    }
  }
  return matched >= 1 ? out : null;
}
