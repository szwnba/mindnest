import {
  ENNEAGRAM_ORDER,
  ENNEAGRAM_QUESTIONS,
  ENNEAGRAM_RESULT_STORAGE_KEY,
  ENNEAGRAM_ANSWERS_STORAGE_KEY,
  type EnneagramResult,
} from "./data/enneagram-questions";

export type EnneagramAnswers = Record<number, number>;

/**
 * 计分逻辑：
 * 1. 将 36 题按 type 分组，每组 4 题
 * 2. 反向题反转得分（6 - 原始分）
 * 3. 每组求和 → 原始分 4-20
 * 4. 取最高分为主型，第二高分若与主型相差 ≤ 2 则为翼型候选
 * 5. 返回全部 9 个分数的详情
 */
export function scoreEnneagram(
  raw: EnneagramAnswers,
): EnneagramResult | null {
  // 校验：36 题全部作答
  if (Object.keys(raw).length < 36) return null;

  // 需要questions的reverse信息来正确计分

  const scores: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };

  for (const q of ENNEAGRAM_QUESTIONS) {
    const rawScore = raw[q.id];
    if (!rawScore) return null; // 有题未作答
    const score = q.reverse ? 6 - rawScore : rawScore;
    scores[q.type] += score;
  }

  // 找出最高和第二高的型
  const sortedTypes = (Object.entries(scores) as [string, number][])
    .sort(([, a], [, b]) => b - a);

  const dominantType = Number(sortedTypes[0][0]) as EnneagramResult["dominantType"];
  const secondaryType = Number(sortedTypes[1][0]) as EnneagramResult["secondaryType"];

  return {
    scores: scores as EnneagramResult["scores"],
    dominantType,
    secondaryType,
    computedAt: Date.now(),
  };
}

export { ENNEAGRAM_RESULT_STORAGE_KEY, ENNEAGRAM_ANSWERS_STORAGE_KEY };
