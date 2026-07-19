
import { type BFI10Result } from "./bfi10-scoring";
import { HEXACO_DIMENSIONS, type HexacoDimension } from "./data/hexaco-questions";
import { BIG_FIVE_DIMENSIONS } from "./data/big-five-dimensions";
import { type BigFiveDimension } from "./data/bfi10-questions";
import { HEXACO_ORDER } from "./data/hexaco-questions";
import { BIG_FIVE_ORDER } from "./data/big-five-dimensions";

// ─── Types ───────────────────────────────────────────────────────────

export interface PersonalityInsight {
  /** 2-3 句个性化画像总结 */
  narrative: string;
  /** 从高分维度提炼的核心优势标签 */
  signatureStrengths: { title: string; description: string }[];
  /** 从低分维度提炼的自我盲区洞察 */
  blindSpot: {
    title: string;
    insight: string;
  };
  /** 「比 X% 更○○」式统计数字 */
  standoutStats: { label: string; percentile: number }[];
  /** Plum 式 Drivers / Drainers */
  drivers: { title: string; description: string }[];
  drainers: { title: string; description: string }[];
}

export interface CareerMatch {
  title: string;
  matchPercent: number;
  why: string;
}

// ─── Percentile Calculator (线性插值近似正态分布) ───────────────

/** 把 0-100 原始分数转换为 1-99 百分位（假设正态分布） */
export function toPercentile(score: number): number {
  // 用简单 logistic 映射：50 → 50%，75 → 85%，25 → 15%
  const z = (score - 50) / 17; // 近似 z-score
  const pct = Math.round(50 + 50 * Math.tanh(z * 1.2));
  return Math.max(1, Math.min(99, pct));
}

// ─── HEXACO Insights Engine ─────────────────────────────────────────

export function getHexacoInsights(r: HexacoResult): PersonalityInsight {
  const dims: HexacoDimension[] = HEXACO_ORDER;

  // 计算所有维度的百分位
  const percentiles: Record<HexacoDimension, number> = dims.reduce(
    (acc, d) => ({ ...acc, [d]: toPercentile(r[d]) }),
    {} as Record<HexacoDimension, number>
  );

  // 排序：最高和最低
  const sorted = [...dims].sort((a, b) => r[b] - r[a]);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const bottom1 = sorted[5];
  const bottom2 = sorted[4];

  // ── Narrative ──
  const narrative = buildHexacoNarrative(top1, top2, bottom1, percentiles);

  // ── Signature Strengths (从最高两个维度提炼) ──
  const signatureStrengths: PersonalityInsight["signatureStrengths"] = [
    {
      title: hexacoStrengthTitle(top1, r[top1]),
      description: hexacoStrengthDesc(top1, r[top1]),
    },
    {
      title: hexacoStrengthTitle(top2, r[top2]),
      description: hexacoStrengthDesc(top2, r[top2]),
    },
  ];

  // ── Blind Spot (从最低维度洞察) ──
  const blindSpot: PersonalityInsight["blindSpot"] = {
    title: hexacoBlindSpotTitle(bottom1, r[bottom1]),
    insight: hexacoBlindSpotInsight(bottom1, r[bottom1], bottom2, r[bottom2]),
  };

  // ── Standout Stats ──
  const standoutStats: PersonalityInsight["standoutStats"] = [];
  for (const d of dims) {
    const p = percentiles[d];
    if (p >= 80) {
      standoutStats.push({
        label: `比 ${p}% 的人${hexacoPraise[d]}`,
        percentile: p,
      });
    }
  }

  // ── Drivers / Drainers ──
  const drivers = dims
    .filter((d) => r[d] >= 60)
    .sort((a, b) => r[b] - r[a])
    .slice(0, 2)
    .map((d) => ({
      title: `⚡ ${HEXACO_DIMENSIONS[d].name}`,
      description: hexacoDriverDesc(d),
    }));

  const drainers = dims
    .filter((d) => r[d] <= 40)
    .sort((a, b) => r[a] - r[b])
    .slice(0, 2)
    .map((d) => ({
      title: `🌀 ${HEXACO_DIMENSIONS[d].name}`,
      description: hexacoDrainerDesc(d),
    }));

  return { narrative, signatureStrengths, blindSpot, standoutStats, drivers, drainers };
}

function buildHexacoNarrative(
  top1: HexacoDimension,
  top2: HexacoDimension,
  bottom1: HexacoDimension,
  percentiles: Record<HexacoDimension, number>
): string {
  const t1 = HEXACO_DIMENSIONS[top1];
  const t2 = HEXACO_DIMENSIONS[top2];
  const b1 = HEXACO_DIMENSIONS[bottom1];
  const p1 = percentiles[top1];
  const pb1 = percentiles[bottom1];

  // 高 O + 高 X = 创意推动者
  if ((top1 === "O" && top2 === "X") || (top1 === "X" && top2 === "O")) {
    return `你是一个自带能量的探索者——${p1 >= 75 ? `在${t1.name}上超过${p1}%的人` : `对新鲜事物充满好奇`}，又${percentiles.X >= 60 ? "善于表达、乐于分享" : "在人群中不卑不亢"}。这种组合让你既能生发创意，又能${percentiles.X >= 60 ? "把想法传递给他人" : "在安静中打磨作品"}。`;
  }

  // 高 C + 高 A = 稳健合作者
  if ((top1 === "C" && top2 === "A") || (top1 === "A" && top2 === "C")) {
    return `你是一个${percentiles.C >= 75 ? `极其靠谱、细节控（${t1.name}超过${p1}%）` : `值得信赖并且体谅他人`}的人。你喜欢把事情做到位，${percentiles.A >= 60 ? "也乐意与人协作" : "同时也保持独立判断"}。这种特质让你成为团队中最${percentiles.C >= 75 ? "\"定海神针\"般的" : "被信赖的"}存在。`;
  }

  // 高 H = 本质正直
  if (top1 === "H" && percentiles.H >= 70) {
    return `你${percentiles.H >= 75 ? `在${t1.name}上超过${p1}%的人——这意味着你天生抗拒利用他人` : `有着强烈的道德直觉`}。在一个${"激励竞争"}的世界里，你的正直是你的${"超级power——虽然它并不总能带来最快的结果，但能赢得最持久的信任"}。`;
  }

  // 高 E = 情绪丰富
  if (top1 === "E" && percentiles.E >= 70) {
    return `你拥有丰富的情感光谱——${percentiles.E >= 75 ? `${p1}%的人不如你敏感` : "你很容易感受到他人的情绪"}。这不是脆弱，这是你${"共情能力的来源——只是需要学会保护自己不被情绪淹没"}。`;
  }

  // 低 X = 深度独处者
  if (bottom1 === "X" && percentiles.X <= 30) {
    return `你更喜欢${pb1 <= 20 ? `安静的环境（外向性仅超过${pb1}%——意味着绝大多数人比你更社交）` : "小范围深入交流"}。你的${`能量来源于内在反思，而非外部刺激`}。${percentiles.O >= 60 ? "加上你对内心世界的探索，独处对你来说不是孤独，而是一种滋养。" : ""}`;
  }

  // 低 C = 灵活适应者
  if (bottom1 === "C" && percentiles.C <= 30) {
    return `你是一个灵活应变的人——${pb1 <= 20 ? `尽责性上仅超过${pb1}%，意味着你喜欢即兴发挥` : "不喜欢被条条框框束缚"}。${percentiles.O >= 60 ? "你的开放思维让你总能看到新可能，只是不一定能把它们全部落地。" : "这种随性让你在需要快速调整的环境中反应敏捷。"}`;
  }

  // 通用叙事
  return `你在${t1.name}${p1 >= 70 ? `上表现突出（高于${p1}%的人）` : "上有自己的倾向"}，同时在${b1.name}${percentiles[bottom1] <= 30 ? `上低于${100 - pb1}%的人` : "上保持另一种节奏"}。这种组合塑造了一个${narrativeFlavor(top1, top2, bottom1)}的你。`;
}

function narrativeFlavor(
  top1: HexacoDimension,
  top2: HexacoDimension,
  bottom1: HexacoDimension
): string {
  if (top1 === "H" || top2 === "H") return "真实而不张扬";
  if (top1 === "C" || top2 === "C") return "可靠且有执行力";
  if (top1 === "O" || top2 === "O") return "富有想象力";
  if (bottom1 === "E") return "冷静沉着";
  if (bottom1 === "A") return "直截了当";
  return "复杂而有趣";
}

const hexacoPraise: Record<HexacoDimension, string> = {
  H: "正直诚实",
  E: "细腻敏感",
  X: "活力自信",
  A: "温和包容",
  C: "自律尽责",
  O: "开放好奇",
};

const hexacoStrengthTitle = (d: HexacoDimension, score: number): string => {
  const titles: Record<HexacoDimension, string> = {
    H: score >= 70 ? "🏔️ 不可动摇的正直" : "🤝 务实的分寸感",
    E: score >= 70 ? "🌊 情绪雷达" : "🧘 情绪稳定性",
    X: score >= 70 ? "✨ 社交能量场" : "🎯 深度专注者",
    A: score >= 70 ? "🕊️ 和平缔造者" : "🎯 原则守护者",
    C: score >= 70 ? "⚙️ 执行官" : "🌬️ 灵活适应者",
    O: score >= 70 ? "🌈 想象力引擎" : "🛠️ 务实建构者",
  };
  return titles[d];
};

const hexacoStrengthDesc = (d: HexacoDimension, score: number): string => {
  if (score >= 70) {
    const descs: Record<HexacoDimension, string> = {
      H: "你有一种罕见的真诚本能——即使没人看着，你也倾向于选择正确的路。这种品质在长期关系中是无价的。",
      E: "你对别人的情绪状态有天然的感知力，这让你成为一个温暖而贴心的朋友和同事。",
      X: "你的活力是有感染力的——你不需要刻意表现，自然就能带动周围的氛围。",
      A: "你拥有一种化解紧张的天赋，即使所有人都剑拔弩张，你也能找到共同点。",
      C: "一旦你决定做某件事，就会可靠地完成——这种品质在任何团队里都是稀缺资源。",
      O: "你的大脑里永远有新点子冒出来，即使90%没落地，剩下10%也足以改变游戏规则。",
    };
    return descs[d];
  }
  const descs: Record<HexacoDimension, string> = {
    H: "在竞争环境中，你知道何时坚持原则、何时务实妥协——这是一种重要的生存智慧。",
    E: "你的情绪稳定性让你在压力下也能保持冷静决策，这是领导者必备的素质。",
    X: "不需要成为全场焦点，你的深度思考和专注工作同样能创造巨大价值。",
    A: "温和不是软弱——你知道什么时候该体谅、什么时候该坚定立场。",
    C: "你既有执行的乐趣也有随性的空间，这种弹性让你在各种环境里都舒适。",
    O: "你既了解传统智慧的价值，也能在合适的时机拥抱新的可能。",
  };
  return descs[d];
};

const hexacoBlindSpotTitle = (d: HexacoDimension, score: number): string => {
  if (score >= 60) return "";
  const titles: Record<HexacoDimension, string> = {
    H: "潜在的盲区：过于务实",
    E: "潜在的盲区：理性面具",
    X: "潜在的盲区：舒适区边界",
    A: "潜在的盲区：直率的双刃剑",
    C: "潜在的盲区：随性的代价",
    O: "潜在的盲区：对确定性的偏好",
  };
  return titles[d];
};

const hexacoBlindSpotInsight = (
  d: HexacoDimension,
  score: number,
  d2: HexacoDimension,
  score2: number
): string => {
  if (score >= 60) return "";
  const insights: Record<HexacoDimension, string> = {
    H: `当别人信任你时，你可能会不自觉地把"利用"重新定义为"互惠"。下次面对灰色地带时，试着问自己：「如果全世界都看到我正在做的事，我还会做吗？」`,
    E: `你习惯了在别人面前保持镇定——但有时别人会误读为"不在乎"。偶尔展露脆弱不仅不会削弱权威，反而会拉近你与他人的距离。`,
    X: `你可能会错过一些只有通过社交才能打开的机会。不需要变成社交达人，只是让自己适度地接受邀请，也许会发现意想不到的可能性。`,
    A: `当你直言不讳时，你可能没有意识到自己的话有多尖锐。试着在说完观点后加一句：「这只是我的看法」——这能让你的真相同样有效但不那么刺耳。`,
    C: `灵活是你的优点，但有些人可能会把你的"随性"解读为"不靠谱"。对于重要承诺，试着用一句明确的「我周四周五前给你」来替代「我尽快」。`,
    O: `你可能会过早否定一些"不够成熟"的想法。有时候先让一个不存在的点子多活24小时，会看出它是不是真的有潜力。`,
  };
  return insights[d];
};

const hexacoDriverDesc = (d: HexacoDimension): string => {
  const descs: Record<HexacoDimension, string> = {
    H: "与正直、透明的人共事让你充满动力",
    E: "深度的情感连接和真实表达是你的能量来源",
    X: "被看见、被认可——公众表达让你精神焕发",
    C: "清晰的目标和可交付的成果让你充满干劲",
    A: "融洽的协作氛围让你表现最好",
    O: "学习新事物、探索未知领域让你精力充沛",
  };
  return descs[d];
};

const hexacoDrainerDesc = (d: HexacoDimension): string => {
  const descs: Record<HexacoDimension, string> = {
    H: "面对明显的利益冲突或灰色地带会消耗你的能量",
    E: "你很少焦虑，但长期积累的情绪压力也需要出口",
    X: "连续多天的独处或文书工作会让你失去活力",
    A: "频繁的冲突和紧张氛围会让你快速疲惫",
    C: "不断变化的需求和混乱的流程会让你效率下降",
    O: "重复性的任务或缺乏创意空间的工作让你提不起劲",
  };
  return descs[d];
};

// ─── BFI10 Insights Engine ──────────────────────────────────────────

export function getBfi10Insights(r: BFI10Result): PersonalityInsight {
  const dims: BigFiveDimension[] = BIG_FIVE_ORDER;
  const percentiles = dims.reduce(
    (acc, d) => ({ ...acc, [d]: toPercentile(r[d]) }),
    {} as Record<BigFiveDimension, number>
  );

  const sorted = [...dims].sort((a, b) => r[b] - r[a]);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const bottom1 = sorted[4];
  const bottom2 = sorted[3];

  const narrative = buildBfi10Narrative(top1, top2, bottom1, percentiles);
  const signatureStrengths: PersonalityInsight["signatureStrengths"] = [
    { title: bfi10StrengthTitle(top1, r[top1]), description: bfi10StrengthDesc(top1, r[top1]) },
    { title: bfi10StrengthTitle(top2, r[top2]), description: bfi10StrengthDesc(top2, r[top2]) },
  ];

  const blindSpot: PersonalityInsight["blindSpot"] = {
    title: bfi10BlindSpotTitle(bottom1, r[bottom1]),
    insight: bfi10BlindSpotInsight(bottom1, r[bottom1]),
  };

  const standoutStats: PersonalityInsight["standoutStats"] = [];
  for (const d of dims) {
    const p = percentiles[d];
    if (d === "N") {
      // N 低 = 情绪稳定
      if (r.N <= 25) standoutStats.push({ label: `情绪稳定性超过 ${100 - p}% 的人`, percentile: 100 - p });
    } else if (p >= 80) {
      standoutStats.push({ label: `比 ${p}% 的人更${bfi10Praise[d]}`, percentile: p });
    }
  }

  const drivers = dims
    .filter((d) => d !== "N" ? r[d] >= 60 : r["N"] <= 40)
    .sort((a, b) => {
      const av = a === "N" ? 100 - r[a] : r[a];
      const bv = b === "N" ? 100 - r[b] : r[b];
      return bv - av;
    })
    .slice(0, 2)
    .map((d) => ({
      title: `⚡ ${BIG_FIVE_DIMENSIONS[d].name}`,
      description: bfi10DriverDesc(d),
    }));

  const drainers = dims
    .filter((d) => d !== "N" ? r[d] <= 40 : r[d] >= 60)
    .sort((a, b) => {
      const av = a === "N" ? r[a] : 100 - r[a];
      const bv = b === "N" ? r[b] : 100 - r[b];
      return bv - av;
    })
    .slice(0, 2)
    .map((d) => ({
      title: `🌀 ${BIG_FIVE_DIMENSIONS[d].name}`,
      description: bfi10DrainerDesc(d, r[d]),
    }));

  return { narrative, signatureStrengths, blindSpot, standoutStats, drivers, drainers };
}

function buildBfi10Narrative(
  top1: BigFiveDimension,
  top2: BigFiveDimension,
  bottom1: BigFiveDimension,
  percentiles: Record<BigFiveDimension, number>
): string {
  const t1 = BIG_FIVE_DIMENSIONS[top1];
  const t2 = BIG_FIVE_DIMENSIONS[top2];
  const b1 = BIG_FIVE_DIMENSIONS[bottom1];

  // 高 N 需要正向包装
  if (top1 === "N" && percentiles.N >= 70) {
    const tail = percentiles.O >= 60 ? "加上你的开放性，你有潜力成为一个非常有洞察力的创作者或咨询者。" : "这种敏感是你的超能力，只是需要学会给情绪一个安全的出口。";
    return `你拥有极其丰富的情感世界——感受力强、共情力深。${tail}`;
  }

  if (bottom1 === "N" && percentiles.N <= 30) {
    const head = percentiles.N <= 20 ? `${100 - percentiles.N}%的人不如你镇定` : "面对压力时你能保持清醒";
    const tail = top1 === "C" || top2 === "C" ? `与你的${BIG_FIVE_DIMENSIONS[top1 === "C" ? top1 : top2].name}搭配，你是一个极其可靠的执行者。` : "";
    return `你的情绪基线非常稳定——${head}。${tail}`;
  }

  if ((top1 === "O" && top2 === "C") || (top1 === "C" && top2 === "O")) {
    const head = percentiles.O >= 70 ? "充满创意的好奇心" : "保有开放的心态";
    const tail = percentiles.C >= 70 ? "有把想法落地的纪律" : "能在需要时专注执行";
    return `你既${head}，又${tail}。这种"创意×执行"的组合让你成为既能构想又能交付的人。`;
  }

  const highStr = percentiles[top1] >= 70 ? `（高于${percentiles[top1]}%的人）` : "";
  return `你在${t1.name}${highStr}上最突出，同时${b1.name}${percentiles[bottom1] <= 30 ? `显著低于平均水平` : "保持自己的节奏"}。这种特质组合让你在${narrativeFlavorBfi(top1, top2, bottom1)}场景中表现最佳。`;
}

function narrativeFlavorBfi(
  top1: BigFiveDimension,
  top2: BigFiveDimension,
  bottom1: BigFiveDimension
): string {
  if (top1 === "E" || top2 === "E") return "需要人际互动和表达";
  if (top1 === "C" || top2 === "C") return "需要精准执行和可靠交付";
  if (top1 === "O" || top2 === "O") return "需要创意探索和开放讨论";
  if (bottom1 === "N") return "高压和紧急";
  return "需要综合判断";
}

const bfi10Praise: Record<BigFiveDimension, string> = {
  O: "开放好奇",
  C: "自律负责",
  E: "外向活力",
  A: "温和合作",
  N: "情绪稳定（反向）",
};

const bfi10StrengthTitle = (d: BigFiveDimension, score: number): string => {
  const titles: Record<BigFiveDimension, string> = {
    O: score >= 70 ? "🌈 创意先锋" : "🎨 平衡探索者",
    C: score >= 70 ? "⚙️ 目标掌控者" : "🎯 灵活执行者",
    E: score >= 70 ? "✨ 能量传导者" : "🤝 选择性社交",
    A: score >= 70 ? "🕊️ 协调者" : "🎯 独立判断者",
    N: score >= 70 ? "🌊 感受力丰富" : "🧘 情绪稳定者",
  };
  return titles[d];
};

const bfi10StrengthDesc = (d: BigFiveDimension, score: number): string => {
  if (d === "N") {
    if (score >= 70) return "你的敏感性让你对世界有更深层的感知——这是艺术家和治疗师的核心品质。只要确保有健康的出口。";
    return "你的情绪弹性让你比大多数人更稳定地度过风浪——这是领导者和管理者的宝贵品质。";
  }
  if (score >= 70) {
    const descs: Record<BigFiveDimension, string> = {
      O: "你的思维从不被边界束缚——能在别人觉得不可能的地方找到新方案。",
      C: "当你说「我会完成」时，所有相关的人都会松一口气——因为你说到做到。",
      E: "你可以在30秒内让一个冷场变得活跃——这种社交资本是无形资产。",
      A: "你天生能让一群人从'我'变成'我们'——这种凝聚力在任何组织里都是稀缺的。",
      N: "",
    };
    return descs[d];
  }
  const descs: Record<BigFiveDimension, string> = {
    O: "你既尊重传统也有开放心态——这种平衡让你在各种环境里都能找到舒适区。",
    C: "你不一定要完美交付，但知道什么时候该认真对待——这是可持续的工作方式。",
    E: "你懂得独处的价值，也享受与人共处的时光——弹性是种难得的能力。",
    A: "你有自己的立场，也知道什么时候该配合他人——这种分寸感让你在各种关系中都舒适。",
    N: "",
  };
  return descs[d];
};

const bfi10BlindSpotTitle = (d: BigFiveDimension, score: number): string => {
  if (d === "N" && score >= 60) {
    return "潜在的盲区：被情绪淹没";
  }
  if (score >= 60) return "";
  const titles: Record<BigFiveDimension, string> = {
    O: "潜在的盲区：对新体验的保守",
    C: "潜在的盲区：灵活的双刃剑",
    E: "潜在的盲区：社交回避陷阱",
    A: "潜在的盲区：直率伤人",
    N: "",
  };
  return titles[d];
};

const bfi10BlindSpotInsight = (d: BigFiveDimension, score: number): string => {
  if (d === "N" && score >= 60) {
    return `你的感受力是天赋也是负担——当情绪堆积时，你可能会被负面漩涡拉入深水中。试着建立一个日常的「情绪急救箱」：写下三件小事、和朋友说一句话、或者只是深呼吸三次，然后过去。`;
  }
  if (score >= 60) return "";
  const insights: Record<BigFiveDimension, string> = {
    O: `你可能会被熟悉的舒适区困住。试着给自己设定"月度冒犯"——每星期做一件从未做过的小事，哪怕只是在餐厅点一道陌生的菜。`,
    C: `灵活让你在变化中生存，但也可能让你失去方向。重要的不是严格执行计划，而是知道你现在为什么放弃它。`,
    E: `社交回避可能让你错过一些珍贵的机会。不需要变成一个社交达人，只是在下一次收到邀请时，先答应再决定是否取消。`,
    A: `你的直接是美德，但有些真相不需要赤裸裸地说出来。试着在批评之前先说一句"我认为我们可以做得更好"——真相同样传达，但不会制造敌人。`,
    N: "",
  };
  return insights[d];
};

const bfi10DriverDesc = (d: BigFiveDimension): string => {
  const descs: Record<BigFiveDimension, string> = {
    O: "学习新事物、接触不同观点",
    C: "清晰的期望和可衡量的进展",
    E: "与同事/合作伙伴的面对面交流",
    A: "和谐协作的团队氛围",
    N: "稳定可预测的工作节奏",
  };
  return descs[d];
};

const bfi10DrainerDesc = (d: BigFiveDimension, score: number): string => {
  if (d === "N" && score >= 60) {
    return "长期暴露在批评或高压环境中会让你快速耗尽";
  }
  const descs: Record<BigFiveDimension, string> = {
    O: "重复性的任务或没有学习空间的工作",
    C: "需求不断变更或缺乏明确目标的环境",
    E: "长期独自工作、缺乏人际互动",
    A: "办公室政治或团队内部消耗性冲突",
    N: "",
  };
  return descs[d];
};
