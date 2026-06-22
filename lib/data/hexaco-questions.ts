export type HexacoDimension = "H" | "E" | "X" | "A" | "C" | "O";

export interface HexacoQuestion {
  id: number;
  text: string;
  dimension: HexacoDimension;
  reverse: boolean;
}

// HEXACO-60 简化中文版（参考 Ashton & Lee, 2009，中文化重写）
// 每维度 10 题，共 60 题
export const HEXACO_QUESTIONS: HexacoQuestion[] = [
  // H - 诚实-谦逊 (10 题)
  { id: 1, text: "如果我知道有人偷了东西却不会被发现，我可能也会考虑这么做。", dimension: "H", reverse: true },
  { id: 2, text: "我觉得自己比大多数人更值得拥有高社会地位。", dimension: "H", reverse: true },
  { id: 3, text: "即使我有机会从别人那里获取金钱，我也不会利用它。", dimension: "H", reverse: false },
  { id: 4, text: "我喜欢听别人谈论我的成就。", dimension: "H", reverse: true },
  { id: 5, text: "如果我发现店员给我找多了零钱，我会还给他/她。", dimension: "H", reverse: false },
  { id: 6, text: "我希望能拥有更多的特权和贵重的物品。", dimension: "H", reverse: true },
  { id: 7, text: "我不会在考试中作弊，即使我确信自己不会被抓到。", dimension: "H", reverse: false },
  { id: 8, text: "我觉得我比大多数人更重要。", dimension: "H", reverse: true },
  { id: 9, text: "如果我知道某人不会再与我交往，我依然会尽力帮助他/她。", dimension: "H", reverse: false },
  { id: 10, text: "我很在意自己在他人眼中是否成功。", dimension: "H", reverse: true },
  // E - 情绪性 (10 题)
  { id: 11, text: "即使是小事，我也容易感到焦虑或担心。", dimension: "E", reverse: false },
  { id: 12, text: "看到别人哭或难过时，我很少会感到自己也想哭。", dimension: "E", reverse: true },
  { id: 13, text: "我经常担心事情会变得很糟。", dimension: "E", reverse: false },
  { id: 14, text: "我对恐怖片和幽灵故事感到很兴奋。", dimension: "E", reverse: true },
  { id: 15, text: "即使在正常的社交场合下，我也容易开始害怕。", dimension: "E", reverse: false },
  { id: 16, text: "看到亲人受伤或病退时，我会感到非常难受。", dimension: "E", reverse: false },
  { id: 17, text: "我很少会因为压力而失眠。", dimension: "E", reverse: true },
  { id: 18, text: "我很容易被伤感或激动。", dimension: "E", reverse: false },
  { id: 19, text: "当朋友遇到困难时，我不太会感同身受。", dimension: "E", reverse: true },
  { id: 20, text: "我经常觉得自己紧张或不安。", dimension: "E", reverse: false },
  // X - 外向性 (10 题)
  { id: 21, text: "在社交场合中，我喜欢成为众人关注的焦点。", dimension: "X", reverse: false },
  { id: 22, text: "我觉得在小型聚会上说话很不自在。", dimension: "X", reverse: true },
  { id: 23, text: "我不介意成为活动的中心。", dimension: "X", reverse: false },
  { id: 24, text: "我通常是朋友们召集聚会的发起人。", dimension: "X", reverse: false },
  { id: 25, text: "我对陌生人会感到羞怯。", dimension: "X", reverse: true },
  { id: 26, text: "我觉得自己是一个非常活跃和有活力的人。", dimension: "X", reverse: false },
  { id: 27, text: "我通常不太愿意在团体中发言。", dimension: "X", reverse: true },
  { id: 28, text: "我喜欢在派对或社交活动中表现自己。", dimension: "X", reverse: false },
  { id: 29, text: "我很少主动与新认识的人交谈。", dimension: "X", reverse: true },
  { id: 30, text: "我喜欢让别人开心。", dimension: "X", reverse: false },
  // A - 宜人性 (10 题)
  { id: 31, text: "即使别人对我不公平，我也不会抱怨。", dimension: "A", reverse: false },
  { id: 32, text: "当别人犯了错，我很容易生气。", dimension: "A", reverse: true },
  { id: 33, text: "我很少与别人发生争执。", dimension: "A", reverse: false },
  { id: 34, text: "我觉得对人生气是一种浪费时间的行为。", dimension: "A", reverse: false },
  { id: 35, text: "我对别人的过错很容忍。", dimension: "A", reverse: false },
  { id: 36, text: "我容易对别人的行为感到不耐烦。", dimension: "A", reverse: true },
  { id: 37, text: "我通常会赞美别人的成就。", dimension: "A", reverse: false },
  { id: 38, text: "即使别人让我失望，我也不会说他们坏话。", dimension: "A", reverse: false },
  { id: 39, text: "我对人很直接，即使可能会伤害感情。", dimension: "A", reverse: true },
  { id: 40, text: "我认为人们应该互相包容。", dimension: "A", reverse: false },
  // C - 尽责性 (10 题)
  { id: 41, text: "我在工作时非常注意细节。", dimension: "C", reverse: false },
  { id: 42, text: "我很少做好计划或任务清单。", dimension: "C", reverse: true },
  { id: 43, text: "我总是尽力将任务做到最好。", dimension: "C", reverse: false },
  { id: 44, text: "我经常忘记把东西放在哪里。", dimension: "C", reverse: true },
  { id: 45, text: "我喜欢把一切都整理得井井有条。", dimension: "C", reverse: false },
  { id: 46, text: "我对自己的工作很不认真。", dimension: "C", reverse: true },
  { id: 47, text: "我会按时完成任务，即使它不是很有趣。", dimension: "C", reverse: false },
  { id: 48, text: "我很少去清理或整理我的物品。", dimension: "C", reverse: true },
  { id: 49, text: "我总是尽力而为。", dimension: "C", reverse: false },
  { id: 50, text: "我经常不经过思考就做出决定。", dimension: "C", reverse: true },
  // O - 开放性 (10 题)
  { id: 51, text: "我对新体验很感兴趣。", dimension: "O", reverse: false },
  { id: 52, text: "我对艺术和音乐不怎么感兴趣。", dimension: "O", reverse: true },
  { id: 53, text: "我喜欢聊一些深奥的事物。", dimension: "O", reverse: false },
  { id: 54, text: "我不太关心我自己的情感。", dimension: "O", reverse: true },
  { id: 55, text: "我喜欢分析和评估事物。", dimension: "O", reverse: false },
  { id: 56, text: "我很难想象一些奇特的情景。", dimension: "O", reverse: true },
  { id: 57, text: "我对哲学和抽象概念很感兴趣。", dimension: "O", reverse: false },
  { id: 58, text: "我不喜欢在日常之外探索新的事物。", dimension: "O", reverse: true },
  { id: 59, text: "我觉得自己是一个有创造力的人。", dimension: "O", reverse: false },
  { id: 60, text: "我对新点子或创意没有兴趣。", dimension: "O", reverse: true },
];

export const HEXACO_DIMENSIONS: Record<
  HexacoDimension,
  {
    name: string;
    fullName: string;
    icon: string;
    description: string;
    high: string;
    low: string;
  }
> = {
  H: { name: "诚实-谦逊", fullName: "Honesty-Humility", icon: "🤝", description: "对于利用别人、获取财富或特权的欲望。", high: "诚实、谦逊、不贪图利益", low: "自私、自大、可能利用他人" },
  E: { name: "情绪性", fullName: "Emotionality", icon: "🌊", description: "对压力、恐惧和依赖的敏感度。", high: "敏感、多愁善感、易焦虑", low: "情绪稳定、从容、不易动情" },
  X: { name: "外向性", fullName: "Extraversion", icon: "✨", description: "对社交互动和活力的偏好。", high: "活泼、大胆、喜欢社交", low: "内向、羞怯、更喜欢独处" },
  A: { name: "宜人性", fullName: "Agreeableness", icon: "🌱", description: "对于他人需求和感受的理解与调适。", high: "温和、宽容、容忍", low: "冷淡、直率、可能刚愤" },
  C: { name: "尽责性", fullName: "Conscientiousness", icon: "🎯", description: "对组织、努力和认真的追求。", high: "认真、负责、有组织", low: "冗长、敷衍、缺乏计划" },
  O: { name: "开放性", fullName: "Openness to Experience", icon: "🎨", description: "对新想法、创意和新体验的好奇心。", high: "好奇、创意、有想象力", low: "传统、实际、不太喜欢变化" },
};

export const HEXACO_ORDER: HexacoDimension[] = ["H", "E", "X", "A", "C", "O"];
