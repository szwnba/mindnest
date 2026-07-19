
import { type HexacoResult } from "./hexaco-scoring";
import { type BFI10Result } from "./bfi10-scoring";
import { type BigFiveDimension } from "./data/bfi10-questions";
import { HEXACO_ORDER, type HexacoDimension } from "./data/hexaco-questions";

export interface CareerMatch {
  title: string;
  matchPercent: number;
  why: string;
}

// ─── HEXACO → Career Mapping ─────────────────────────────────────────

const hexacoWeights: Record<string, Record<HexacoDimension, number>> = {
  teacher: { H: 1, E: -0.5, X: 0.5, A: 1, C: 0.5, O: 0.5 },
  counselor: { H: 1, E: 0.5, X: 0, A: 1, C: 0.5, O: 0.5 },
  manager: { H: 0.5, E: -0.5, X: 0.5, A: 0.5, C: 1, O: 0.5 },
  engineer: { H: 0.5, E: 0, X: -0.5, A: 0, C: 1, O: 1 },
  designer: { H: 0.5, E: 0, X: 0, A: 0.5, C: 0.5, O: 1 },
  sales: { H: 0, E: -0.5, X: 1, A: 0, C: 0.5, O: 0.5 },
  researcher: { H: 0.5, E: 0, X: -0.5, A: 0, C: 1, O: 1 },
  writer: { H: 0.5, E: 0.5, X: -0.5, A: 0, C: 0.5, O: 1 },
  hr: { H: 1, E: 0, X: 0.5, A: 1, C: 0.5, O: 0.5 },
  entrepreneur: { H: 0, E: 0, X: 1, A: 0, C: 1, O: 1 },
};

const hexacoCareerTitle: Record<string, string> = {
  teacher: "🏫 教师 / 培训师",
  counselor: "🧠 心理咨询师",
  manager: "📊 项目经理",
  engineer: "💻 软件工程师",
  designer: "🎨 产品/UX 设计师",
  sales: "🤝 销售 / BD",
  researcher: "🔬 学术研究员",
  writer: "✍️ 内容创作者",
  hr: "👥 人力资源",
  entrepreneur: "🚀 创业者",
};

const hexacoCareerWhy: Record<string, string> = {
  teacher: "你的正直和包容让学生天然信任你，社交活力让课堂有感染力。",
  counselor: "你对他人情绪的高敏感度，加上真诚的倾听，让你成为天生的治愈者。",
  manager: "公正感和执行力让你能平衡团队需求与目标，成为可靠的领航者。",
  engineer: "高尽责+高开放的特质让你在抽象系统和细节执行之间找到平衡。",
  designer: "你的创造力和对体验的敏感让你能设计出真正为人着想的产品。",
  sales: "你的活力和说服力让陌生人很快对你敞开心扉，转化为合作意愿。",
  researcher: "你对新知的渴望和严谨的学术自律让你在探索未知中享受乐趣。",
  writer: "你丰富的情感和开放的想象力让你能把抽象的感受化为具体的文字。",
  hr: "你对人的敏感和公平感让你能在组织中找到人才并帮助他们成长。",
  entrepreneur: "活力、执行力和创造力的组合是创业者的经典特质。",
};

export function getHexacoCareers(r: HexacoResult): CareerMatch[] {
  const ids = Object.keys(hexacoWeights);
  const scores = ids.map((id) => {
    const w = hexacoWeights[id];
    let match = 50;
    for (const dim of HEXACO_ORDER) {
      match += w[dim] * (r[dim] - 50) * 0.3;
    }
    match = Math.max(20, Math.min(99, Math.round(match)));
    return {
      title: hexacoCareerTitle[id] ?? id,
      matchPercent: match,
      why: hexacoCareerWhy[id] ?? "",
    };
  });

  return scores
    .filter((s) => s.matchPercent >= 55)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);
}

// ─── BFI10 → Career Mapping ─────────────────────────────────────────

const bfi10Weights: Record<string, Record<BigFiveDimension, number>> = {
  "product-manager": { O: 1, C: 1, E: 0.5, A: 0, N: -0.5 },
  "data-analyst": { O: 1, C: 1, E: -0.5, A: 0, N: -0.5 },
  marketer: { O: 1, C: 0.5, E: 1, A: 0, N: -0.5 },
  therapist: { O: 0.5, C: 0.5, E: 0, A: 1, N: 0.5 },
  founder: { O: 1, C: 1, E: 1, A: 0, N: -1 },
  academic: { O: 1, C: 1, E: -0.5, A: 0.5, N: -0.5 },
  "creative-director": { O: 1, C: 0.5, E: 0.5, A: 0.5, N: 0 },
  operator: { O: 0, C: 1, E: 0, A: 0.5, N: -1 },
  "customer-success": { O: 0.5, C: 0.5, E: 1, A: 1, N: -0.5 },
  writer: { O: 1, C: 0.5, E: -0.5, A: 0, N: 0 },
};

const bfi10CareerTitle: Record<string, string> = {
  "product-manager": "📦 产品经理",
  "data-analyst": "📊 数据分析师",
  marketer: "📣 市场营销",
  therapist: "🧠 心理咨询师",
  founder: "🚀 创业者",
  academic: "🔬 学术研究",
  "creative-director": "🎨 创意总监",
  operator: "⚙️ 运营管理",
  "customer-success": "🤝 客户成功经理",
  writer: "✍️ 内容创作者",
};

const bfi10CareerWhy: Record<string, string> = {
  "product-manager": "好奇心+执行力让你能从用户洞察出发，推出真正有价值的产品。",
  "data-analyst": "你喜欢在数据中发现规律，专注力和逻辑思维是你的核心优势。",
  marketer: "你的开放性能抓住趋势，外向性能把创意传播出去，感染他人。",
  therapist: "高宜人+高敏感的组合让你天然能走进他人的内心世界。",
  founder: "高C高E高O的三核驱动是创业者的经典组合——构想、执行、影响。",
  academic: "对知识的渴望和严谨的治学态度让你在专业领域不断精进。",
  "creative-director": "你的审美感+执行力让你能把创意方向从概念落地到作品。",
  operator: "极高尽责性是你最大的优势——组织、流程、执行就是你天然的舒适区。",
  "customer-success": "你的共情力和耐心让客户在关键时刻感到被支持，降低流失。",
  writer: "你的开放性和内省倾向让你能把复杂的感受化为有共鸣的文字。",
};

const bfiDims: BigFiveDimension[] = ["O", "C", "E", "A", "N"];

export function getBfi10Careers(r: BFI10Result): CareerMatch[] {
  const ids = Object.keys(bfi10Weights);
  const scores = ids.map((id) => {
    const w = bfi10Weights[id];
    let match = 50;
    for (const dim of bfiDims) {
      const weight = dim === "N" ? w[dim] * -1 : w[dim]; // N 反向计分
      match += weight * (r[dim] - 50) * 0.35;
    }
    match = Math.max(20, Math.min(99, Math.round(match)));
    return {
      title: bfi10CareerTitle[id] ?? id,
      matchPercent: match,
      why: bfi10CareerWhy[id] ?? "",
    };
  });

  return scores
    .filter((s) => s.matchPercent >= 55)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);
}
