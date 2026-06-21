import type { BigFiveDimension } from "./bfi10-questions";

export interface BigFiveMeta {
  name: string;
  fullName: string;
  icon: string;
  /** 引用 globals.css 中的 CSS 变量名（不含 var()） */
  color: string;
  description: string;
  high: string;
  low: string;
}

export const BIG_FIVE_DIMENSIONS: Record<BigFiveDimension, BigFiveMeta> = {
  O: {
    name: "开放性",
    fullName: "Openness",
    icon: "🎨",
    color: "--terracotta",
    description: "对新经验、新想法的接纳程度",
    high: "富有想象、好奇、爱探索",
    low: "务实、传统、偏好熟悉",
  },
  C: {
    name: "尽责性",
    fullName: "Conscientiousness",
    icon: "🎯",
    color: "--sage",
    description: "自律、有组织的程度",
    high: "条理、可靠、目标导向",
    low: "灵活、随性、当下导向",
  },
  E: {
    name: "外向性",
    fullName: "Extraversion",
    icon: "✨",
    color: "--gold",
    description: "从社交中获得能量的程度",
    high: "热情、健谈、寻求刺激",
    low: "安静、内敛、独处充电",
  },
  A: {
    name: "宜人性",
    fullName: "Agreeableness",
    icon: "🌿",
    color: "--sage-light",
    description: "对他人体谅、合作的程度",
    high: "温和、信任、合作",
    low: "直率、坚持立场、竞争",
  },
  N: {
    name: "神经质",
    fullName: "Neuroticism",
    icon: "🌊",
    color: "--sky",
    description: "情绪波动与压力反应的程度",
    high: "敏感、容易焦虑",
    low: "稳定、抗压力强",
  },
};

export const BIG_FIVE_ORDER: BigFiveDimension[] = ["O", "C", "E", "A", "N"];
