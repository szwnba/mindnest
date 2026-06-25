// MindNest vs 16Personalities 对比数据
// 用于首页 CompareSection 与 /compare 独立页面
// 立场：诚实、克制、不贬低对手，但坚定说明 MindNest 的差异化定位

export type ComparisonHighlight = "win" | "tie" | "behind";

export interface ComparisonRow {
  /** 评估维度名 */
  dimension: string;
  /** MindNest 的表现描述（用于表格主行） */
  mindNest: string;
  /** 16Personalities 的表现描述（用于表格主行） */
  sixteenP: string;
  /** 颜色提示 */
  highlight: ComparisonHighlight;
  /** 在 /compare 独立页面展开的 200-400 字深度说明 */
  detail: string;
}

export const COMPARISON: ComparisonRow[] = [
  {
    dimension: "理论框架",
    mindNest:
      "整合 6 大权威框架：MBTI、Big Five、HEXACO、Enneagram、荣格认知功能与 Holland 职业兴趣，互相印证。",
    sixteenP:
      "仅 MBTI 一种，且为公司自创的 NERIS 变体（在 MBTI 之上加了 -A / -T 维度）。",
    highlight: "win",
    detail:
      "人格是多维的，单一框架天然有盲点。MBTI 擅长描述偏好与认知风格，Big Five 提供跨文化最稳定的实证基础，HEXACO 补足了诚信—谦逊这条 MBTI 完全忽略的维度，Enneagram 切入动机与防御，Holland 则把视角拉回职业现实。MindNest 把这 6 个框架并列呈现，让用户看到同一个自我的不同切面，而不是被一个四字母代码定义。16Personalities 选择只走 MBTI 这一条路，并在其上叠加自创变体 NERIS，外观更易传播，但失去了交叉验证的可能。",
  },
  {
    dimension: "量表诚信",
    mindNest:
      "BFI-10 国际公认短量表 + 28 题本土化 Likert 量表，计分逻辑完全公开可查。",
    sixteenP:
      "NERIS 算法闭源、未经学术同行评审，外界无法验证其测量效度。",
    highlight: "win",
    detail:
      "BFI-10（Rammstedt & John, 2007）是 Big Five 领域被引用最多的短量表之一，发表于 Journal of Research in Personality，跨语种心理测量学性质良好。MindNest 把它原样接入，加上一套针对中文语境的 28 题 Likert 量表，所有题目反向计分、维度归属、阈值划分都开源在 GitHub 上。16Personalities 的 NERIS 模型是公司自有产权，从未公开发表过同行评审论文，用户得到一个看起来很精确的百分比，却没有任何外部方式去验证这个数字是怎么算出来的。诚信不是更准确，而是把不确定性也一并交给用户。",
  },
  {
    dimension: "中文语言",
    mindNest:
      "全部题目与类型描述由中文母语者原创撰写，行文诗化但术语严谨。",
    sixteenP:
      "官方页面脚注自认翻译可能由机器生成，不少题目读起来像直译，文化语境错位。",
    highlight: "win",
    detail:
      "心理测评的有效性高度依赖语言。一个被翻译得别扭的题目，会让用户回答的是「我听懂了什么」而不是「我是谁」。MindNest 的所有题面都是中文母语视角下重写的，避免了「assertive / turbulent」这类生造词的硬译。类型描述也按照中文阅读节奏排版，6 个板块各自有独立的语气。这不是文采问题，是测量学问题：题面歧义会直接污染结果。",
  },
  {
    dimension: "商业模式",
    mindNest:
      "完全免费、无广告、无付费墙、无邮件订阅强制。",
    sixteenP:
      "免费版只看一部分结果，完整高阶报告 ¥169 起，另有黑桌面订阅与广告。",
    highlight: "win",
    detail:
      "16Personalities 在用户最想看到完整结果的那一刻设置付费门——这是非常合理的商业模式，但也意味着「测评」本身被设计成了销售漏斗的一部分。MindNest 没有付费墙的原因很朴素：作者把它当作一份长期作业而不是一门生意，托管在 Vercel 免费额度内，源码完全公开。这不是道德优越，是定位差异——我们不需要你的钱，所以也不需要为留住你而设计焦虑。",
  },
  {
    dimension: "数据可视化",
    mindNest:
      "原生 SVG 雷达图 + 双向条形图：4 维 MBTI 偏好强度 + 5 维 Big Five 百分位同屏对照。",
    sixteenP:
      "以文字描述为主，辅以单维度百分比条，缺乏整体结构感。",
    highlight: "win",
    detail:
      "看到自己「是什么」比读到「是什么」更有冲击力。MindNest 在结果页同时给出两张图：一张雷达图把 Big Five 五个维度的相对结构画在同一个轮廓里，一张双向条形图把 MBTI 四个偏好的强度可视化。这套设计让用户能一眼判断「我的 E/I 是边缘型还是非常明显」，而不是只看一个标签。可视化的目的不是炫技，是把抽象的统计结果变成可以指着说话的图。",
  },
  {
    dimension: "类型描述深度",
    mindNest:
      "每个类型约 1500 字，分为描述 / 优势 / 成长方向 / 关系模式 / 职业建议 / 盲点 6 个板块。",
    sixteenP:
      "约 1900 字，分类更细，但中文版整体为机器翻译，可读性下降。",
    highlight: "tie",
    detail:
      "纯字数上 16Personalities 更厚——这是它多年积累的内容资产，必须承认。MindNest 的差异在于结构化：6 个板块各自独立、各自有目的，特别加入了「盲点」一栏——大多数测评只讲优势，但盲点才是真正能用上的部分。在中文阅读体验上 MindNest 占优，在内容广度上对方占优，所以这一行我们标 tie 而不是 win。",
  },
  {
    dimension: "资料库",
    mindNest:
      "随站附 20 篇人格心理学长文，包含学术参考与批判性反思。",
    sixteenP:
      "官方站点没有独立的资料库板块，知识沉淀分散在博客与营销页中。",
    highlight: "win",
    detail:
      "测评只是入口，理解才是目的。MindNest 把人格心理学相关的长文当作站点的第二个支柱：从 Big Five 的跨文化研究、到 MBTI 的科学争议、到 Enneagram 的临床应用，每篇都标注主要参考文献，并明确指出该框架的局限。我们希望用户看完测评之后能继续往深处读，而不是停在那个四字母代码上。",
  },
  {
    dimension: "隐私与数据",
    mindNest:
      "所有结果只存在浏览器 localStorage，无账号系统、无服务端存储、无第三方追踪。",
    sixteenP:
      "需要邮箱注册以保存结果，包含广告与分析追踪脚本，付费功能锁定在账号下。",
    highlight: "win",
    detail:
      "人格数据是高度敏感的——它能被反向用于广告画像、招聘筛选、甚至社交工程。MindNest 的设计选择是把所有结果留在用户自己的浏览器里：没有数据库、没有用户表、没有 cookie 追踪、没有 Google Analytics。你可以清缓存随时让它「失忆」。代价是换设备无法同步，但这个代价我们认为值得。",
  },
  {
    dimension: "开源透明",
    mindNest:
      "全部源代码以 MIT 协议开源在 GitHub（szwnba/mindnest），题库、算法、UI 均可审阅。",
    sixteenP:
      "完全闭源，技术栈、量表、算法均不公开。",
    highlight: "win",
    detail:
      "对一个声称要帮你认识自己的工具来说，开源是最低限度的诚意。MindNest 的所有量表题目、计分函数、类型映射逻辑都在 GitHub 仓库里可以一行一行查。任何研究者、心理学专业学生、或者好奇的用户都可以审阅或 fork。这不是营销话术，是验证机制：当代码可见时，谎言成本会变得很高。",
  },
  {
    dimension: "多语言",
    mindNest:
      "目前仅中文（简体）。i18n 架构已预留，但其他语种暂未上线。",
    sixteenP:
      "支持 30+ 种语言，覆盖面远超 MindNest。",
    highlight: "behind",
    detail:
      "这一项必须诚实承认：16Personalities 多年积累的本地化资源 MindNest 短期内无法追上。我们目前的策略是把中文这一种语言做到极致——题目原创、描述原创、配色与排版都为中文阅读优化——而不是急着铺英文版。未来如果引入英文，会以同样的「原创撰写」标准而非翻译输出。多语言会出现在 roadmap 上，但不会是 v1 的承诺。",
  },
  {
    dimension: "题目数量与信度",
    mindNest:
      "BFI-10 仅 10 题（+ MBTI 28 题），短量表信度系数低于长量表。",
    sixteenP:
      "NERIS 量表 60 题，题量更大，测量误差理论上更小。",
    highlight: "behind",
    detail:
      "这是 MindNest 刻意做的 trade-off：BFI-10 是国际学术界验证过的短量表，优点是 2 分钟就能完成，缺点是 Cronbach α 系数天然低于 60 题版本。我们目前的策略是「先让你进来，再邀请你深入」——如果你愿意，可以连续做 MBTI 28 题 + BFI-10 两套量表，用交叉验证弥补单套题量不足。",
  },
  {
    dimension: "品牌知名度",
    mindNest:
      "2026 年创建，无营销投放，几乎零自然流量。",
    sixteenP:
      "全球最大人格测评平台，月活跃用户以亿计，品牌印象深入人心。",
    highlight: "behind",
    detail:
      "这是 MindNest 目前最难短期追上的项目。品牌是时间的函数，16Personalities 用十年做到了全球知名度，我们才刚刚开始。但我们相信：如果产品真的好，时间会站在这边。",
  },
  {
    dimension: "社区与用户生态",
    mindNest:
      "暂无社区、论坛或用户讨论区，测评是单次体验，缺少持续的互动与归属感。",
    sixteenP:
      "拥有活跃的全球用户社区、类型讨论区、meme 文化、以及丰富的二次创作内容。",
    highlight: "behind",
    detail:
      "16Personalities 不只是一个测评工具，它还是一个文化现象。用户在 Reddit、Discord、微博、小红书自发形成讨论圈层，围绕人格类型创造梗图、同人小说、穿搭建议、职业经验分享。这种社区生态让「了解人格」变成了一种持续的社交语言。MindNest 目前专注于测评本身的准确性与深度，尚未搭建任何社区功能。我们承认：一个孤立的结果页，很难比得过一个能让你找到同类、持续讨论的生态系统。社区会在未来的 roadmap 上出现，但不是现在。",
  },
];
