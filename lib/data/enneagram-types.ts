import type { EnneagramResult } from "./enneagram-questions";

export interface EnneagramType {
  code: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  coreFear: string;
  coreDesire: string;
  coreMotivation: string;
  shortDescription: string;
  strengths: string[];
  blindSpots: string[];
  growthTip: string;
}

export const ENNEAGRAM_TYPES: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, EnneagramType> = {
  1: {
    code: "1",
    nameZh: "完美主义者",
    nameEn: "The Reformer",
    icon: "⚖️",
    coreFear: "害怕自己是腐败的、有缺陷的",
    coreDesire: "保持正直、平衡与完整性",
    coreMotivation: "追求正确，改善自己与世界",
    shortDescription: "有原则、自律、追求高标准。你是那个总是看到「可以更好」的人，但有时也会陷入自我批评的漩涡。",
    strengths: ["有原则", "自律", "追求卓越", "公正"],
    blindSpots: ["过度自我批判", "难以容忍不完美", "固执于标准"],
    growthTip: "试着对自己温柔一点——完美不是一种状态，而是一个方向。",
  },
  2: {
    code: "2",
    nameZh: "助人者",
    nameEn: "The Helper",
    icon: "💗",
    coreFear: "害怕不被需要、不被爱",
    coreDesire: "感受被爱与被需要",
    coreMotivation: "通过帮助他人来建立连接",
    shortDescription: "温暖、慷慨、善于感知他人需求。你是那个总是先顾他人的人，但有时会忘记照顾自己。",
    strengths: ["善解人意", "慷慨", "热情", "富有同理心"],
    blindSpots: ["忽视自身需求", "期待被认可", "过度介入他人生活"],
    growthTip: "真正的爱不是用付出来交换，而是先完整自己，再给予他人。",
  },
  3: {
    code: "3",
    nameZh: "成就者",
    nameEn: "The Achiever",
    icon: "🏆",
    coreFear: "害怕没有价值、不被认可",
    coreDesire: "感受有价值与被认可",
    coreMotivation: "追求成就与形象",
    shortDescription: "适应力强、高效、以目标为导向。你是那个总能完成任务的人，但有时会在忙碌中忘记自己真正的感受。",
    strengths: ["高效", "适应力强", "目标导向", "自信"],
    blindSpots: ["过度关注形象", "情感隔离", "害怕失败"],
    growthTip: "你的价值不由成就来定义——停下来问问自己「我真正想要的是什么？」",
  },
  4: {
    code: "4",
    nameZh: "个人主义者",
    nameEn: "The Individualist",
    icon: "🎨",
    coreFear: "害怕没有独特身份或意义",
    coreDesire: "找到自我并建立独特身份",
    coreMotivation: "追求真实、深刻与独特",
    shortDescription: "敏感、深刻、富有创造力。你是那个总能触及情感深处的人，但有时会陷入比较与缺失感。",
    strengths: ["深刻", "创造力", "真实", "情感丰富"],
    blindSpots: ["过度自我沉浸", "容易陷入忧郁", "总觉得缺失什么"],
    growthTip: "你的独特不是因为你缺失什么，而是因为你拥有别人无法复制的光芒。",
  },
  5: {
    code: "5",
    nameZh: "调查者",
    nameEn: "The Investigator",
    icon: "🔬",
    coreFear: "害怕无知、无能或入侵",
    coreDesire: "获得知识与能力",
    coreMotivation: "通过理解世界来获得安全感",
    shortDescription: "洞察力强、独立、知识渊博。你是那个总能看透事物本质的人，但有时会在观察中忘记参与。",
    strengths: ["洞察力", "独立", "深度思考", "客观"],
    blindSpots: ["情感隔离", "过度退缩", "害怕参与"],
    growthTip: "知识让你安全，但连接让你完整——有时候，投入比观察更需要勇气。",
  },
  6: {
    code: "6",
    nameZh: "忠诚者",
    nameEn: "The Loyalist",
    icon: "🛡️",
    coreFear: "害怕没有支持或指导",
    coreDesire: "获得安全感与支持",
    coreMotivation: "寻求安全与确定性",
    shortDescription: "忠诚、负责、寻求安全感。是你让团队保持稳定，但有时会陷入「如果……怎么办」的焦虑中。",
    strengths: ["忠诚", "负责", "可靠", "有预见性"],
    blindSpots: ["过度焦虑", "犹豫不决", "怀疑自己"],
    growthTip: "真正的安全不来自外部的保证，而是来自你内在的力量——你已经足够强大了。",
  },
  7: {
    code: "7",
    nameZh: "热情者",
    nameEn: "The Enthusiast",
    icon: "🎪",
    coreFear: "害怕被束缚、被剥夺体验",
    coreDesire: "保持快乐与满足",
    coreMotivation: "追求新体验与可能性",
    shortDescription: "乐观、多才多艺、热爱体验。你是团队的活力源泉，但有时会逃避痛苦而错过深度。",
    strengths: ["乐观", "灵活", "创造力", "活力"],
    blindSpots: ["逃避痛苦", "缺乏深度", "容易分心"],
    growthTip: "不是所有痛苦都需要逃避——有些深度，只有在停下来的时候才能触及。",
  },
  8: {
    code: "8",
    nameZh: "挑战者",
    nameEn: "The Challenger",
    icon: "🦁",
    coreFear: "害怕被控制或伤害",
    coreDesire: "掌控自己的生命与环境",
    coreMotivation: "追求力量与控制以保护自己与他人",
    shortDescription: "自信、果断、保护性强。是你为他人撑起一片天，但有时会因为过于强势而忘记柔软的力量。",
    strengths: ["果断", "保护性", "领导力", "正直"],
    blindSpots: ["过度控制", "难以示弱", "愤怒管理"],
    growthTip: "真正的强大不是控制一切，而是敢于在信任的人面前放下盔甲。",
  },
  9: {
    code: "9",
    nameZh: "和平者",
    nameEn: "The Peacemaker",
    icon: "☮️",
    coreFear: "害怕冲突、分离与失连",
    coreDesire: "保持内心平静与和谐",
    coreMotivation: "追求内外和谐，避免冲突",
    shortDescription: "平和、包容、善于调和。是你让周围充满宁静，但有时会在维持和平中忘记自己的立场。",
    strengths: ["包容", "稳定", "善解人意", "调和能力"],
    blindSpots: ["消极抵抗", "忽视自身需求", "顽固"],
    growthTip: "和平不是没有冲突，而是在冲突中依然保持与自己内心的连接。",
  },
};

/** 获取 Enneagram 类型描述 */
export function getEnneagramType(
  code: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
): EnneagramType {
  return ENNEAGRAM_TYPES[code];
}

/**
 * 生成简短的 Enneagram 描述文档（约 200 字）
 */
export function generateEnneagramInsight(result: EnneagramResult): string {
  const main = getEnneagramType(result.dominantType);
  const secondary = getEnneagramType(result.secondaryType);

  const mainScore = result.scores[result.dominantType];
  const mainPercent = Math.round(((mainScore - 4) / 16) * 100);

  return `你的主型是${main.code}号${main.nameZh}（${main.nameEn}，匹配度${mainPercent}%）。${main.shortDescription}翼型倾向${secondary.code}号${secondary.nameZh}，说明你在保持${main.nameZh}核心特质的同时，也汲取了${secondary.nameZh}的部分风格。`;
}
