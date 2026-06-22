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

export interface ATPerspective {
  label: "-A 自信型" | "-T 动荡型" | "中间区域";
  subtitle: string;
  description: string;
  strength: string;
  watchout: string;
}

export function getATPerspective(N: number): ATPerspective {
  if (N < 40) {
    return {
      label: "-A 自信型",
      subtitle: "你的情绪基线比较稳定，压力恢复力强",
      description:
        "在 Big Five 模型中，这对应「神经质（N）偏低」。你不太容易被突发状况打乱节奏，面对批评或挫折时恢复较快。",
      strength:
        "在高压环境（如 deadline 密集、频繁变更需求）中能保持清晰判断；团队中的「定海神针」角色。",
      watchout:
        "过低时可能显得「情绪迟钝」——对队友的焦虑信号不够敏感，或在需要表达紧迫感的场合显得过于松弛。",
    };
  }
  if (N > 60) {
    return {
      label: "-T 动荡型",
      subtitle: "你对压力和不确定性更敏感，驱动力强",
      description:
        "在 Big Five 模型中，这对应「神经质（N）偏高」。你对潜在风险有更早的警觉，对自我表现有更高的期待。",
      strength:
        "驱动力强，对细节和风险的嗅觉敏锐；在需要持续改进、追求完美主义的岗位（如品控、审计、深度创作）中表现出色。",
      watchout:
        "容易陷入反刍思维（反复回想失误），对批评反应强烈，需要更长的情绪恢复期。建议建立「情绪止损」机制。",
    };
  }
  return {
    label: "中间区域",
    subtitle: "你既有稳定性，也有警觉性",
    description:
      "你的 N 分数处于中等区间，意味着你既能感知压力，也不会被压力淹没。这是一种适应性很强的分布。",
    strength:
      "能根据情境切换「稳定模式」和「警觉模式」；在变化快的团队中是最灵活的成员。",
    watchout:
      "不同情境下表现差异较大，容易被别人误读为「情绪不稳定」。建议有意识地标注自己当下的状态。",
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
