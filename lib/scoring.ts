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

export interface DimensionResult {
  /** 该维度落在哪个字母（E/I, S/N, T/F, J/P） */
  letter: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  /** letter 对应的得分（7-35，越大越偏向该字母） */
  letterScore: number;
  /** 反向字母得分（letter + opposite = 42） */
  oppositeScore: number;
  /**
   * letter 占该维度总分（42）的百分比，整数 0-100。
   * 50 = 完全居中；越大越偏 letter。
   */
  letterPercent: number;
  /** 是否处于游移区（letterPercent 在 45-55 之间） */
  ambiguous: boolean;
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

/**
 * 把单题原始分（1-5）转化为 \"主字母\" 与 \"对立字母\" 的得分增量。
 *
 * - reverse=false：raw 越高越偏 primary（E/S/T/J）
 * - reverse=true ：raw 越高越偏 opposite（I/N/F/P）
 *
 * 两个字母的得分恒满足 primary + opposite = 6。
 */
function scoreItem(
  q: QuizQuestion,
  raw: LikertScore,
): { primaryDelta: number; oppositeDelta: number } {
  if (q.reverse) {
    return { primaryDelta: 6 - raw, oppositeDelta: raw };
  }
  return { primaryDelta: raw, oppositeDelta: 6 - raw };
}

/**
 * 根据全部回答计算结果。
 * 缺答的题用中立分 3 兜底（比 0 更合理：避免严重偏向某一极）。
 */
export function computeResult(answers: Answers): QuizResult {
  const sums: Record<Dimension, { primary: number; opposite: number }> = {
    EI: { primary: 0, opposite: 0 },
    SN: { primary: 0, opposite: 0 },
    TF: { primary: 0, opposite: 0 },
    JP: { primary: 0, opposite: 0 },
  };

  let answered = 0;
  for (const q of QUIZ_QUESTIONS) {
    const raw = (answers[q.id] ?? 3) as LikertScore;
    if (answers[q.id]) answered += 1;
    const { primaryDelta, oppositeDelta } = scoreItem(q, raw);
    sums[q.dimension].primary += primaryDelta;
    sums[q.dimension].opposite += oppositeDelta;
  }

  function buildDim(dim: Dimension): DimensionResult {
    const { primary, opposite } = DIMENSION_LETTERS[dim];
    const primaryScore = sums[dim].primary;
    const oppositeScore = sums[dim].opposite;
    const total = primaryScore + oppositeScore || 1;
    // 主字母占比
    const primaryPercent = Math.round((primaryScore / total) * 100);
    const useOpposite = primaryScore < oppositeScore;
    // 平局（primary === opposite）时，落到 primary（E/S/T/J）以提供稳定输出
    const letter = useOpposite ? opposite : primary;
    const letterScore = useOpposite ? oppositeScore : primaryScore;
    const oppoScore = useOpposite ? primaryScore : oppositeScore;
    const letterPercent = useOpposite ? 100 - primaryPercent : primaryPercent;
    const ambiguous = letterPercent <= 55;
    return {
      letter,
      letterScore,
      oppositeScore: oppoScore,
      letterPercent,
      ambiguous,
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
