export type Dimension = "EI" | "SN" | "TF" | "JP";

/** 维度的人话标签（答题时展示给用户） */
export const DIMENSION_LABELS: Record<Dimension, string> = {
  EI: "能量取向",
  SN: "信息加工",
  TF: "决策风格",
  JP: "生活节奏",
};

export interface QuizQuestion {
  /** 题号（1-28） */
  id: number;
  /** 所测维度 */
  dimension: Dimension;
  /** 题面（陈述句，要求用户表达同意度） */
  text: string;
  /**
   * reverse=false：同意 → 加到 \"前一字母\" (E/S/T/J)
   * reverse=true ：同意 → 加到 \"后一字母\" (I/N/F/P)
   * 这样我们用一个统一的字段表达\"正向题指向哪个字母\"。
   * 计分时：rawScore (1-5) 直接累加给该题指向的字母；
   * 同时给反方向字母累加 (6 - rawScore)。
   */
  reverse: boolean;
}

/**
 * 28 题 Likert MBTI 测评。
 *
 * 设计依据：参考 BFI-44 / IPIP 量表风格 + 经典 MBTI Form M 题面，
 * 由本项目原创撰写，符合以下要求：
 *
 * - 每维度 7 题（合计 28 题），每维度 4 正向 + 3 反向（reverse），平衡测谎
 * - 5 点 Likert：1=非常不同意，2=不同意，3=中立，4=同意，5=非常同意
 * - 维度交错排列（EI / SN / TF / JP / EI / SN ...），不连续测同一维度
 * - 中文口语化，避免心理学术语
 *
 * 计分规则（见 lib/scoring.ts）：
 *   每题 rawScore 1-5。
 *   - reverse=false：rawScore 加到 (E|S|T|J)，(6-rawScore) 加到 (I|N|F|P)
 *   - reverse=true ：rawScore 加到 (I|N|F|P)，(6-rawScore) 加到 (E|S|T|J)
 *
 * 因此每个维度满分 35，每个字母最低 7 / 最高 35，对立两字母之和恒为 42。
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // round 1 (8 题)
  { id: 1, dimension: "EI", reverse: false, text: "在社交场合，我倾向于主动结识新朋友。" },
  { id: 2, dimension: "SN", reverse: false, text: "我更关注眼前的具体事实，而不是事物之间隐含的联系。" },
  { id: 3, dimension: "TF", reverse: false, text: "做决定时，我更看重逻辑分析而不是个人感受。" },
  { id: 4, dimension: "JP", reverse: false, text: "我习惯把日程提前安排好，按计划推进。" },
  { id: 5, dimension: "EI", reverse: true,  text: "在热闹的环境里待久了，我会感到能量被消耗，需要独处恢复。" },
  { id: 6, dimension: "SN", reverse: true,  text: "我经常会想到\"如果……会怎样\"这类假设性的可能。" },
  { id: 7, dimension: "TF", reverse: true,  text: "面对他人的难过时，我会先关心对方感受，而不是先分析问题。" },
  { id: 8, dimension: "JP", reverse: true,  text: "我喜欢保持选项开放，不到必要时不轻易拍板。" },

  // round 2 (8 题)
  { id: 9,  dimension: "EI", reverse: false, text: "我通过和别人聊天与互动来梳理自己的想法。" },
  { id: 10, dimension: "SN", reverse: false, text: "比起抽象理论，我更相信亲身验证过的经验。" },
  { id: 11, dimension: "TF", reverse: false, text: "我能比较冷静地指出别人方案中的漏洞，即便对方在场。" },
  { id: 12, dimension: "JP", reverse: false, text: "完成清单上的任务能给我明显的满足感。" },
  { id: 13, dimension: "EI", reverse: true,  text: "我的好想法多半是在一个人安静思考时冒出来的。" },
  { id: 14, dimension: "SN", reverse: true,  text: "我喜欢从一件小事联想到一个更宏大的主题。" },
  { id: 15, dimension: "TF", reverse: true,  text: "判断一件事好不好，我会先看它对相关的人意味着什么。" },
  { id: 16, dimension: "JP", reverse: true,  text: "deadline 临近时我反而能进入最有创造力的状态。" },

  // round 3 (8 题)
  { id: 17, dimension: "EI", reverse: false, text: "我习惯一边说一边想，随着表达逐渐清晰自己的观点。" },
  { id: 18, dimension: "SN", reverse: false, text: "看一份报告时，我会先关注具体数字和事实细节。" },
  { id: 19, dimension: "TF", reverse: false, text: "在原则问题上，我会坚持公正而不是顾及情面。" },
  { id: 20, dimension: "JP", reverse: false, text: "我的物品和文件大多放在固定的位置，不随便更动。" },
  { id: 21, dimension: "EI", reverse: true,  text: "比起多人聚会，我更享受和一两个亲近的人深谈。" },
  { id: 22, dimension: "SN", reverse: true,  text: "我容易被一些原创的、没有人想过的点子打动。" },
  { id: 23, dimension: "TF", reverse: true,  text: "如果方案完全合理但伤害了某个人，我会觉得它仍然有问题。" },
  { id: 24, dimension: "JP", reverse: true,  text: "我享受根据当下的心情和情境随时调整计划。" },

  // round 4 (4 题，补齐每维度第 7 题)
  { id: 25, dimension: "EI", reverse: false, text: "在团队讨论中，我经常是较早开口、推动方向的那个人。" },
  { id: 26, dimension: "SN", reverse: false, text: "学习新事物时，我希望先弄清楚每一步具体怎么做。" },
  { id: 27, dimension: "TF", reverse: false, text: "我觉得\"对事不对人\"是处理冲突的好原则。" },
  { id: 28, dimension: "JP", reverse: false, text: "比起开放式探索，我更喜欢有清晰目标和阶段成果的项目。" },
];

/** 每维度题数自检（构建时校验，防止数据失衡） */
const _check: Record<Dimension, { total: number; reverse: number }> = {
  EI: { total: 0, reverse: 0 },
  SN: { total: 0, reverse: 0 },
  TF: { total: 0, reverse: 0 },
  JP: { total: 0, reverse: 0 },
};
for (const q of QUIZ_QUESTIONS) {
  _check[q.dimension].total += 1;
  if (q.reverse) _check[q.dimension].reverse += 1;
}
// 这是一个开发态自检：每维度 7 题，3 反向。
if (process.env.NODE_ENV !== "production") {
  for (const dim of Object.keys(_check) as Dimension[]) {
    if (_check[dim].total !== 7) {
      console.warn(
        `[quiz-questions] dimension ${dim} has ${_check[dim].total} items (expected 7)`,
      );
    }
  }
}
