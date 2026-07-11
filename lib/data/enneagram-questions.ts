export interface EnneagramQuestion {
  id: number;
  /** 题目所属九型型号 */
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** 是否反向计分 */
  reverse?: boolean;
}

/**
 * Enneagram 36 题简化版题库（每型 4 题，共 36 题）
 *
 * 采用 Likert 5 点量表（1=非常不同意，5=非常同意）。
 * 每型取 4 道最具代表性的简化版题目，优先选择日常行为/思维模式描述。
 *
 * 计分：将同型号的 4 题得分相加 → 原始分 4-20 → 百分位。
 * 最高分为主型，若出现同分则取编号较小者。
 */
export const ENNEAGRAM_QUESTIONS: EnneagramQuestion[] = [
  // ── Type 1 完美主义者 ──────────────────────────
  { id: 1,  type: 1 },
  { id: 2,  type: 1 },
  { id: 3,  type: 1 },
  { id: 4,  type: 1 },

  // ── Type 2 助人者 ─────────────────────────────
  { id: 5,  type: 2 },
  { id: 6,  type: 2 },
  { id: 7,  type: 2 },
  { id: 8,  type: 2, reverse: true },

  // ── Type 3 成就者 ─────────────────────────────
  { id: 9,  type: 3 },
  { id: 10, type: 3 },
  { id: 11, type: 3 },
  { id: 12, type: 3, reverse: true },

  // ── Type 4 个人主义者 ─────────────────────────
  { id: 13, type: 4 },
  { id: 14, type: 4, reverse: true },
  { id: 15, type: 4 },
  { id: 16, type: 4 },

  // ── Type 5 调查者 ─────────────────────────────
  { id: 17, type: 5 },
  { id: 18, type: 5 },
  { id: 19, type: 5, reverse: true },
  { id: 20, type: 5 },

  // ── Type 6 忠诚者 ─────────────────────────────
  { id: 21, type: 6 },
  { id: 22, type: 6, reverse: true },
  { id: 23, type: 6 },
  { id: 24, type: 6 },

  // ── Type 7 热情者 ─────────────────────────────
  { id: 25, type: 7 },
  { id: 26, type: 7 },
  { id: 27, type: 7, reverse: true },
  { id: 28, type: 7 },

  // ── Type 8 挑战者 ─────────────────────────────
  { id: 29, type: 8 },
  { id: 30, type: 8 },
  { id: 31, type: 8, reverse: true },
  { id: 32, type: 8 },

  // ── Type 9 和平者 ─────────────────────────────
  { id: 33, type: 9 },
  { id: 34, type: 9, reverse: true },
  { id: 35, type: 9 },
  { id: 36, type: 9 },
];

export const ENNEAGRAM_ORDER: readonly (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
] as const;

export const ENNEAGRAM_RESULT_STORAGE_KEY = "mindnest:enneagram-result-v1";
export const ENNEAGRAM_ANSWERS_STORAGE_KEY = "mindnest:enneagram-answers-v1";

/** Enneagram 结果 */
export interface EnneagramResult {
  scores: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>;
  dominantType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** 第二高分型（翼型候选） */
  secondaryType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  computedAt: number;
}
