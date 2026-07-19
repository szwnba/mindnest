import { HEXACO_QUESTIONS } from "./data/hexaco-questions";

export type HexacoLikert = 1 | 2 | 3 | 4 | 5;
export type HexacoAnswers = Record<number, HexacoLikert>;
export type HexacoLevel = "high" | "medium" | "low";

export interface HexacoResult {
  H: number;
  E: number;
  X: number;
  A: number;
  C: number;
  O: number;
  profile: {
    H: HexacoLevel;
    E: HexacoLevel;
    X: HexacoLevel;
    A: HexacoLevel;
    C: HexacoLevel;
    O: HexacoLevel;
  };
  computedAt: number;
}

export function scoreHexaco(answers: HexacoAnswers): HexacoResult {
  const sums: Record<HexacoDimension, number> = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };
  for (const q of HEXACO_QUESTIONS) {
    const raw = (answers[q.id] ?? 3) as HexacoLikert;
    const score = q.reverse ? 6 - raw : raw;
    sums[q.dimension] += score;
  }
  function normalize(sum: number): number {
    // sum ∈ [10, 50] → [0, 100]
    const v = ((sum - 10) / 40) * 100;
    return Math.max(0, Math.min(100, Math.round(v)));
  }
  function level(pct: number): HexacoLevel {
    if (pct < 40) return "low";
    if (pct > 60) return "high";
    return "medium";
  }
  const H = normalize(sums.H);
  const E = normalize(sums.E);
  const X = normalize(sums.X);
  const A = normalize(sums.A);
  const C = normalize(sums.C);
  const O = normalize(sums.O);
  return {
    H,
    E,
    X,
    A,
    C,
    O,
    profile: {
      H: level(H),
      E: level(E),
      X: level(X),
      A: level(A),
      C: level(C),
      O: level(O),
    },
    computedAt: Date.now(),
  };
}

export const HEXACO_RESULT_STORAGE_KEY = "mindnest:hexaco-result-v1";
export const HEXACO_ANSWERS_STORAGE_KEY = "mindnest:hexaco-answers-v1";

export function encodeHexacoForUrl(r: HexacoResult): string {
  return `H${r.H}-E${r.E}-X${r.X}-A${r.A}-C${r.C}-O${r.O}`;
}

/** 从 URL 参数解码 HEXACO 结果（容错：缺失维度按 50 处理） */
export function decodeHexacoFromUrl(s: string): {
  H: number;
  E: number;
  X: number;
  A: number;
  C: number;
  O: number;
} | null {
  if (!s) return null;
  const out = { H: 50, E: 50, X: 50, A: 50, C: 50, O: 50 };
  let matched = 0;
  for (const part of s.split("-")) {
    const m = part.match(/^([HEXACO])(\d{1,3})$/i);
    if (!m) continue;
    const dim = m[1].toUpperCase() as HexacoDimension;
    const v = Math.max(0, Math.min(100, parseInt(m[2], 10)));
    if (Number.isFinite(v)) {
      out[dim] = v;
      matched += 1;
    }
  }
  return matched >= 1 ? out : null;
}
