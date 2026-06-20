export interface Framework {
  /** 简体中文名 */
  name: string;
  /** 完整英文/学术名 */
  fullName: string;
  /** 简码（用于 anchor / data-* 属性） */
  code: string;
  /** Emoji 图标（装饰，aria-hidden） */
  icon: string;
  /** 主题色 token（CSS 变量名，不带 var()） */
  color: string;
  /** 主题背景色 token */
  bg: string;
  /** 段落简介 */
  description: string;
  /** 3-4 条要点（特性列表） */
  items: string[];
}

/**
 * 6 大权威人格测评体系。
 * 数据完整提取自 original-prototype.html（L1866-1950）。
 */
export const FRAMEWORKS: Framework[] = [
  {
    name: "MBTI 人格类型",
    fullName: "Myers-Briggs Type Indicator",
    code: "mbti",
    icon: "🧩",
    color: "--sage",
    bg: "--sage-bg",
    description:
      "基于荣格心理类型理论发展而来，通过四个二元维度（E/I、S/N、T/F、J/P）划分出 16 种人格类型，是全球应用最广泛的人格评估工具之一。",
    items: [
      "16 种人格类型分类",
      "认知功能栈深度分析",
      "适用于自我认知与职业探索",
    ],
  },
  {
    name: "大五人格模型",
    fullName: "Big Five / OCEAN Model",
    code: "bigfive",
    icon: "🔬",
    color: "--terracotta",
    bg: "--terracotta-bg",
    description:
      "学术界最受认可的人格框架，将人格分解为开放性、尽责性、外倾性、宜人性和神经质五个维度，提供连续谱系而非二元分类。",
    items: ["高信度与效度的科学验证", "连续维度而非类型划分", "学术研究首选工具"],
  },
  {
    name: "九型人格",
    fullName: "Enneagram of Personality",
    code: "enneagram",
    icon: "💎",
    color: "--warm-gold",
    bg: "--warm-gold-bg",
    description:
      "从核心动机与恐惧出发，识别九种基本人格类型及其内在成长路径。深层关注「为什么」而非「是什么」，是自我成长的有力工具。",
    items: ["9 种核心人格 + 18 种翼型", "整合与瓦解方向图谱", "深层动机与恐惧分析"],
  },
  {
    name: "DISC 行为风格",
    fullName: "DISC Assessment",
    code: "disc",
    icon: "⚡",
    color: "--sky",
    bg: "--sky-bg",
    description:
      "聚焦可观察的行为模式，将行为风格分为支配(D)、影响(I)、稳健(S)、谨慎(C)四类，广泛应用于职场沟通与团队建设。",
    items: ["简单易用的四象限模型", "职场沟通优化利器", "团队配置与领导力发展"],
  },
  {
    name: "霍兰德职业兴趣",
    fullName: "Holland Code (RIASEC)",
    code: "riasec",
    icon: "🎯",
    color: "--lavender",
    bg: "--lavender-bg",
    description:
      "将职业兴趣分为现实型、研究型、艺术型、社会型、企业型和常规型六类，帮助找到与人格最匹配的职业方向。",
    items: ["6 种职业兴趣类型", "人格-环境匹配理论", "职业规划必备参考"],
  },
  {
    name: "气质类型理论",
    fullName: "Four Temperaments",
    code: "temperaments",
    icon: "🌊",
    color: "--rose",
    bg: "--rose-bg",
    description:
      "源自古希腊的四种气质分类（多血质、胆汁质、粘液质、抑郁质），与现代神经科学形成呼应，帮助理解情绪反应的基本模式。",
    items: ["4 种基本气质类型", "情绪反应模式分析", "理解人际互动风格"],
  },
];
