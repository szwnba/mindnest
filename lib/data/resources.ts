export interface Resource {
  /** 唯一 slug */
  slug: string;
  /** 卡片分类 */
  category: string;
  /** 标题 */
  title: string;
  /** 摘要 */
  excerpt: string;
  /** 是否为头牌（占大格） */
  featured?: boolean;
  /** 头牌副标题（顶部 tag 文案） */
  featuredTag?: string;
  /** 头牌作者 / 团队 */
  author?: string;
  /** 头牌发布日期（展示用文案） */
  date?: string;
  /** 小卡片标签 */
  tags?: string[];
  /** 头牌图标 emoji */
  icon?: string;
}

/**
 * 资料库 5 篇，提取自 original-prototype.html（L2218-2273）。
 */
export const RESOURCES: Resource[] = [
  {
    slug: "cognitive-functions-deep-guide",
    category: "深度解读",
    featuredTag: "深度解读 · 2025 年 6 月",
    title: "认知功能理论深度指南：从主导到劣势，理解你的思维偏好层次",
    excerpt:
      "了解 MBTI 四字母只是起点。真正的深度理解来自认知功能（Cognitive Functions）——主导功能如何塑造你的核心思维模式？辅助功能如何平衡你的决策？本文逐层拆解 8 种认知功能的运作机制，帮你超越表面类型，理解心智的内在结构。",
    featured: true,
    author: "Persona Research Team",
    date: "2025 年 6 月 10 日",
    icon: "📖",
  },
  {
    slug: "stress-signals-by-type",
    category: "应用场景",
    title: "不同人格类型的压力信号与自我调节策略",
    excerpt:
      "当每种人格类型「失控」时会呈现什么特征？如何提前识别并温柔地拉回自己？",
    tags: ["压力管理", "自我调节"],
  },
  {
    slug: "compatibility-myth",
    category: "人际关系",
    title: "人格兼容性迷思：MBTI 类型之间真的有「最佳配对」吗？",
    excerpt:
      "跳出简单配对思维，从认知功能互补角度理解深度关系的可能。",
    tags: ["关系", "认知功能"],
  },
  {
    slug: "personality-plasticity",
    category: "学术前沿",
    title: "人格的可塑性：你的性格真的不会变吗？",
    excerpt:
      "最新纵向研究揭示，人格特质在一生中持续演化，关键转折点是什么？",
    tags: ["人格发展", "研究"],
  },
  {
    slug: "leadership-by-type",
    category: "职场应用",
    title: "基于人格的领导力发展：不同类型的管理风格与成长建议",
    excerpt:
      "每种人格都有独特的领导力潜能，关键是发展你天然擅长的方式而非模仿他人。",
    tags: ["领导力", "职场"],
  },
];
