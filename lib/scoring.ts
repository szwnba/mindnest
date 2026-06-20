import {
  type Dimension,
  type QuizQuestion,
  QUIZ_QUESTIONS,
} from "./data/quiz-questions";

export type LikertScore = 1 | 2 | 3 | 4 | 5;

/**
 * 用户答题记录：questionId -> 1..5 的整数。
 */
export type Answers = Record<number, LikertScore>;

/** confidence level：基于 letterPercent。 */
export type ConfidenceLevel = "high" | "medium" | "low";

export interface DimensionResult {
  /** 该维度落在哪个字母（E/I, S/N, T/F, J/P） */
  letter: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  /**
   * 偏移量（offset），范围 -14..+14。
   * - >0：偏向 primary 字母（E/S/T/J）
   * - <0：偏向 opposite 字母（I/N/F/P）
   * - =0：完全居中（ambiguous=true）
   *
   * 计算：每题 (answer - 3) * (reverse ? -1 : 1) ∈ [-2, +2]，
   * 7 题求和，理论极值 ±14。
   */
  offset: number;
  /**
   * letter 占该维度的百分比，整数 50-100（始终视作"所选字母"的强度）。
   * 50 = 完全居中（仅当 offset=0 时出现，此时 letter 默认 primary）；
   * 越大代表越倾向所选字母。
   */
  letterPercent: number;
  /** 是否处于游移区（letterPercent <= 55 视为 ambiguous） */
  ambiguous: boolean;
  /** 该维度的把握度等级 */
  confidence: ConfidenceLevel;
}

export interface QuizResult {
  /** 4 字母 MBTI 代码（如 "INFP"） */
  code: string;
  /** 4 个维度详细结果 */
  dimensions: {
    EI: DimensionResult;
    SN: DimensionResult;
    TF: DimensionResult;
    JP: DimensionResult;
  };
  /** 是否在某些维度上游移（任一维度 ambiguous=true） */
  hasAmbiguous: boolean;
  /** 用户作答总题数（应为 28，否则结果不可信） */
  answeredCount: number;
  /** 时间戳（毫秒） */
  computedAt: number;
}

const DIMENSION_LETTERS: Record<
  Dimension,
  { primary: "E" | "S" | "T" | "J"; opposite: "I" | "N" | "F" | "P" }
> = {
  EI: { primary: "E", opposite: "I" },
  SN: { primary: "S", opposite: "N" },
  TF: { primary: "T", opposite: "F" },
  JP: { primary: "J", opposite: "P" },
};

/** 每维度满分偏移（每维度 7 题，每题 ±2）。 */
const MAX_OFFSET = 14;
/** ambiguous 阈值：letterPercent <= 55 视为游移。 */
const AMBIGUOUS_THRESHOLD = 55;

/**
 * 单题偏移：(raw - 3) * (reverse ? -1 : 1) ∈ [-2, +2]，
 * 表示 "向 primary 字母（E/S/T/J）所偏的量"。
 *
 * - 中立答（3）→ 偏移 0，不贡献任何方向；
 * - 正向题答 5（非常同意）→ +2，偏 primary；
 * - 反向题答 5（非常同意）→ -2，偏 opposite（因为反向题表达 opposite 立场）。
 */
function itemOffset(q: QuizQuestion, raw: LikertScore): number {
  return (raw - 3) * (q.reverse ? -1 : 1);
}

/**
 * 把维度 offset 映射到 [50, 100] 的"所选字母强度"百分比。
 * - offset = ±14 → 100%
 * - offset = 0 → 50%
 */
function offsetToPercent(offset: number): number {
  return Math.round((Math.abs(offset) / MAX_OFFSET) * 50 + 50);
}

function levelFromPercent(pct: number): ConfidenceLevel {
  if (pct >= 85) return "high";
  if (pct >= 65) return "medium";
  return "low";
}

/**
 * 根据全部回答计算结果。
 * 缺答的题用中立分 3 兜底（不贡献偏移）。
 *
 * 计分采用"偏移制"：每题 (raw-3)*(reverse?-1:1)，维度满分 ±14；
 * 这样无脑全选同一档（如全 5）时，正向题和反向题相互抵消，
 * 落入 ambiguous 区，避免任何极端用户都被打"游移"标签的旧 bug。
 */
export function computeResult(answers: Answers): QuizResult {
  const offsets: Record<Dimension, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  let answered = 0;
  for (const q of QUIZ_QUESTIONS) {
    const raw = (answers[q.id] ?? 3) as LikertScore;
    if (answers[q.id]) answered += 1;
    offsets[q.dimension] += itemOffset(q, raw);
  }

  function buildDim(dim: Dimension): DimensionResult {
    const { primary, opposite } = DIMENSION_LETTERS[dim];
    const offset = offsets[dim];
    // offset > 0 → primary, offset < 0 → opposite, offset == 0 → 默认 primary 但 ambiguous
    const letter = offset < 0 ? opposite : primary;
    const letterPercent = offsetToPercent(offset);
    const ambiguous = letterPercent <= AMBIGUOUS_THRESHOLD;
    const confidence = levelFromPercent(letterPercent);
    return {
      letter,
      offset,
      letterPercent,
      ambiguous,
      confidence,
    };
  }

  const dimensions = {
    EI: buildDim("EI"),
    SN: buildDim("SN"),
    TF: buildDim("TF"),
    JP: buildDim("JP"),
  };

  const code =
    dimensions.EI.letter +
    dimensions.SN.letter +
    dimensions.TF.letter +
    dimensions.JP.letter;

  const hasAmbiguous =
    dimensions.EI.ambiguous ||
    dimensions.SN.ambiguous ||
    dimensions.TF.ambiguous ||
    dimensions.JP.ambiguous;

  return {
    code,
    dimensions,
    hasAmbiguous,
    answeredCount: answered,
    computedAt: Date.now(),
  };
}

export const STORAGE_KEY = "mindnest:quiz-result-v1";
export const ANSWERS_STORAGE_KEY = "mindnest:quiz-answers-v1";

/* ──────────────────────────────────────────────────────────
 * dev-only 自检：启动时打印 all-5 / all-1 / all-3 三个用例，
 * 用于回归 P0 计分修复（QA-V2 P0-NEW-1）。
 * 仅在 NODE_ENV === "development" 时执行（生产环境会被 dead-code 消除）。
 * ────────────────────────────────────────────────────────── */
if (process.env.NODE_ENV === "development") {
  const cases: { name: string; answers: Answers }[] = [
    {
      name: "all-5",
      answers: Object.fromEntries(
        QUIZ_QUESTIONS.map((q) => [q.id, 5 as LikertScore]),
      ) as Answers,
    },
    {
      name: "all-1",
      answers: Object.fromEntries(
        QUIZ_QUESTIONS.map((q) => [q.id, 1 as LikertScore]),
      ) as Answers,
    },
    {
      name: "all-3",
      answers: Object.fromEntries(
        QUIZ_QUESTIONS.map((q) => [q.id, 3 as LikertScore]),
      ) as Answers,
    },
  ];
  for (const c of cases) {
    const r = computeResult(c.answers);
    console.log(
      `[scoring-test] ${c.name}: code=${r.code} hasAmbiguous=${r.hasAmbiguous} pct=${r.dimensions.EI.letterPercent}/${r.dimensions.SN.letterPercent}/${r.dimensions.TF.letterPercent}/${r.dimensions.JP.letterPercent}`,
    );
  }
}
