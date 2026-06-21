/**
 * BFI-10（Big Five Inventory-10, Rammstedt & John, 2007）
 * 学界标准短版「大五人格量表」：10 题，每个维度 2 题（一正一反），5 点 Likert。
 *
 * 维度：
 *  - O (Openness 开放性)
 *  - C (Conscientiousness 尽责性)
 *  - E (Extraversion 外向性)
 *  - A (Agreeableness 宜人性)
 *  - N (Neuroticism 神经质)
 *
 * 引用：Rammstedt, B., & John, O. P. (2007). Measuring personality in one minute or less:
 * A 10-item short version of the Big Five Inventory in English and German.
 * Journal of Research in Personality, 41(1), 203-212.
 */

export type BigFiveDimension = "O" | "C" | "E" | "A" | "N";

export interface BFI10Question {
  id: number;
  dimension: BigFiveDimension;
  /** UI 显示的中文题面 */
  text: string;
  /** 原始英文题面（参考） */
  textEn: string;
  /** 是否为反向题（计分时需翻转） */
  reverse: boolean;
}

export const BFI10_QUESTIONS: readonly BFI10Question[] = [
  {
    id: 1,
    dimension: "E",
    text: "我把自己看作一个外向、爱社交的人",
    textEn: "I see myself as someone who is outgoing, sociable",
    reverse: false,
  },
  {
    id: 2,
    dimension: "A",
    text: "我把自己看作一个常常挑剔他人的人",
    textEn: "I see myself as someone who tends to find fault with others",
    reverse: true,
  },
  {
    id: 3,
    dimension: "C",
    text: "我把自己看作一个做事彻底、靠谱的人",
    textEn: "I see myself as someone who does a thorough job",
    reverse: false,
  },
  {
    id: 4,
    dimension: "N",
    text: "我把自己看作一个常常紧张、容易心烦的人",
    textEn: "I see myself as someone who gets nervous easily",
    reverse: false,
  },
  {
    id: 5,
    dimension: "O",
    text: "我把自己看作一个想象力丰富的人",
    textEn: "I see myself as someone who has an active imagination",
    reverse: false,
  },
  {
    id: 6,
    dimension: "E",
    text: "我把自己看作一个比较内敛、安静的人",
    textEn: "I see myself as someone who is reserved",
    reverse: true,
  },
  {
    id: 7,
    dimension: "A",
    text: "我把自己看作一个友善、能体谅他人的人",
    textEn: "I see myself as someone who is generally trusting",
    reverse: false,
  },
  {
    id: 8,
    dimension: "C",
    text: "我把自己看作一个有点懒散的人",
    textEn: "I see myself as someone who tends to be lazy",
    reverse: true,
  },
  {
    id: 9,
    dimension: "N",
    text: "我把自己看作一个情绪稳定、不易心烦的人",
    textEn: "I see myself as someone who is relaxed, handles stress well",
    reverse: true,
  },
  {
    id: 10,
    dimension: "O",
    text: "我把自己看作一个想象力较少的人",
    textEn: "I see myself as someone who has few artistic interests",
    reverse: true,
  },
] as const;

export const BFI10_DIMENSION_LABELS: Record<BigFiveDimension, string> = {
  O: "开放性",
  C: "尽责性",
  E: "外向性",
  A: "宜人性",
  N: "神经质",
};
