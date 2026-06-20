<div align="center">

<!-- Logo: 用站点 nav-logo 同款"心"字徽，避免外部图依赖 -->
<a href="https://mindnest-six.vercel.app">
  <img src="https://img.shields.io/badge/%E5%BF%83-MindNest-6B8F71?style=for-the-badge&labelColor=4F7555&logoColor=white" alt="心栖 MindNest Logo" height="80" />
</a>

# 心栖 · MindNest

**温和而专业的人格心理测评平台**
_A warm, therapeutic personality assessment platform — built with care._

[![Live](https://img.shields.io/website?url=https%3A%2F%2Fmindnest-six.vercel.app&label=live&up_message=online&down_message=offline&style=flat-square&color=6B8F71)](https://mindnest-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-B8935A?style=flat-square)](#-license)

### [→ 立即体验线上版 / Try it live](https://mindnest-six.vercel.app)

</div>

---

## 📖 项目简介 · About

**心栖 MindNest** 是一个基于荣格类型学 (Jungian Type Theory) 的中文人格测评平台。它用 28 题 5 点 Likert 量表 + 反向计分 + 临界区提示，给出 16 种类型 (16 Types) 的精细解读，并把"温和、人文、可信"作为核心品牌气质。

> MindNest is a Chinese-first, professionally-styled personality test web app.
> Built on Next.js 16 (App Router) + TypeScript + Tailwind v4, deployed on Vercel.

---

## ✨ 产品亮点 · Highlights

| # | 亮点 Highlight | 说明 |
|---|---|---|
| 1️⃣ | **28 题 Likert 测评引擎** | 5 点同意度 + 反向题 + 缺答兜底，比常见 10 题二元测评信度更高 |
| 2️⃣ | **维度临界提示 (Ambiguous Zone)** | 落在 45–55 % 的字母会标注"游移"，避免巴纳姆效应误导用户 |
| 3️⃣ | **16 类型独立详情页** | `/types/[code]` 静态生成 (SSG)，含人格画像、关系、职业、成长建议 |
| 4️⃣ | **Warm-Therapeutic 设计语言** | Sage / Terracotta / Warm-Gold 三主色 + Cormorant + Noto Serif SC 双衬线 |
| 5️⃣ | **完全无障碍 (a11y first)** | Skip-to-content、`:focus-visible`、`prefers-reduced-motion`、ARIA 完整 |
| 6️⃣ | **SEO 全套** | `metadata` API、JSON-LD (Organization + WebSite)、sitemap、robots、OG 图 |
| 7️⃣ | **next/font 自动子集化** | 中文字体按需加载，无外部 `<link>` 拖慢 LCP |
| 8️⃣ | **零数据库部署** | 所有题目/类型/资源以 TS 数据模块呈现，结果存 `localStorage`，开箱即跑在 Vercel |

---

## 🚀 快速开始 · Quick Start

### 前置要求 Prerequisites

- Node.js **≥ 20.x**（推荐 LTS）
- npm ≥ 10 或 pnpm / yarn 任选其一

### 一条龙命令 One-shot

```bash
# 1. 克隆 Clone
git clone https://github.com/szwnba/mindnest.git
cd mindnest

# 2. 安装依赖 Install
npm install

# 3. 本地开发 Dev (http://localhost:3000)
npm run dev

# 4. 生产构建 Build
npm run build

# 5. 本地启动生产版 Start
npm run start

# 6. 代码检查 Lint
npm run lint
```

### ☁️ 部署到 Vercel · Deploy

```bash
# 已绑定 GitHub repo 后，push 即触发自动部署
git push origin main
```

或一键部署到自己的账号：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fszwnba%2Fmindnest)

> 📘 详细部署流程见 [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 🛠️ 技术栈 · Tech Stack

| 层级 Layer | 技术 Tech | 版本 Ver | 说明 |
|---|---|---|---|
| 框架 Framework | **Next.js** | `16.2.9` | App Router · RSC · SSG |
| UI 库 UI | **React** | `19.2.4` | 配合 Server Components |
| 语言 Language | **TypeScript** | `^5` | strict 模式，全量类型 |
| 样式 Styling | **Tailwind CSS** | `v4` | 通过 `@tailwindcss/postcss` 集成 |
| 字体 Fonts | **next/font/google** | — | Cormorant Garamond + Noto Serif SC + Noto Sans SC，自动子集化 + self-host |
| 路由 Routing | **App Router** | — | `/`, `/types`, `/types/[code]` |
| 数据 Data | TS 静态模块 | — | 题库 / 类型库 / 文案均为 `lib/data/*.ts` |
| 持久化 Storage | `localStorage` | — | `mindnest:quiz-result-v1` / `mindnest:quiz-answers-v1` |
| 检查 Lint | **ESLint** | `^9` | `eslint-config-next` |
| 部署 Hosting | **Vercel** | — | git push 自动构建 |

---

## 📁 项目结构 · Structure

```
mindnest/
├── app/                       # Next.js App Router
│   ├── layout.tsx             #   根布局 / next/font / JSON-LD / Skip link
│   ├── page.tsx               #   首页（Hero + Types + Quiz + Resources + FAQ）
│   ├── globals.css            #   设计令牌 + 全站样式（从原型迁移）
│   ├── robots.ts              #   /robots.txt
│   ├── sitemap.ts             #   /sitemap.xml（含 16 类型详情页）
│   └── types/                 #   类型详情路由
│       ├── page.tsx           #     /types — 16 类型索引页
│       └── [code]/            #     动态段：INTJ / INFP / ...
│
├── components/                # 客户端组件（一份 .tsx = 一个 section）
│   ├── Header.tsx             #   顶部导航 + Mobile Drawer
│   ├── Hero.tsx               #   首屏 Hero + 装饰光晕
│   ├── TrustBar.tsx           #   信任条
│   ├── Frameworks.tsx         #   六大测评体系卡片
│   ├── PersonalityTypes.tsx   #   16 类型卡（接 /types/[code]）
│   ├── HowItWorks.tsx         #   测评流程说明
│   ├── Quiz.tsx               #   ⭐ 测评引擎（28 题 + Likert + 结果面板）
│   ├── Resources.tsx          #   资料库
│   ├── FAQ.tsx                #   常见问题
│   ├── CtaBanner.tsx          #   结尾 CTA
│   └── Footer.tsx             #   页脚 + 合规声明
│
├── lib/                       # 业务逻辑 / 数据层
│   ├── scoring.ts             #   ⭐ 计分核心（Likert + 反向 + 临界区）
│   ├── site.ts                #   站点常量（SITE_URL / NAME / SEO）
│   └── data/
│       ├── quiz-questions.ts  #   28 题题库 + 维度标签
│       ├── personality-types.ts # 16 种类型画像（含 strengths/growth/career）
│       ├── frameworks.ts      #   六大测评体系
│       ├── faqs.ts            #   FAQ 文案
│       └── resources.ts       #   资料库文章
│
├── public/                    # 静态资源（favicon / svg）
├── next.config.ts             # Next 配置
├── tsconfig.json              # TS 配置（含 @/* 路径别名）
├── eslint.config.mjs          # ESLint v9 flat config
├── package.json
├── README.md                  # 你正在看的这份
└── DEPLOYMENT.md              # 部署 & 运维手册
```

---

## 🧠 核心功能详解 · Core Features

### 1. 测评引擎 (Quiz Engine) — `components/Quiz.tsx`

| 项目 Item | 实现 Implementation |
|---|---|
| 题量 | **28 题**（每维度 7 题）|
| 评分 | **5 点 Likert**：非常不同意 / 不同意 / 中立 / 同意 / 非常同意 |
| 反向题 | 每维度 3 道 reverse 题 (`q.reverse = true`)，平衡同意倾向偏差 |
| 维度交错 | 题序按 `EI → SN → TF → JP → EI ...` 循环，避免元认知作弊 |
| 进度条 | 实时显示 `已答 / 28` + 当前维度 (能量取向 / 信息加工 / 决策风格 / 生活节奏) |
| 持久化 | 每次答题写入 `localStorage` (`mindnest:quiz-answers-v1`)，刷新可续答 |
| 缺答兜底 | 未答题以中立分 3 计入，避免严重偏向 |

### 2. 计分逻辑 (Scoring) — `lib/scoring.ts`

```ts
// 单题增量
function scoreItem(q, raw) {
  if (q.reverse) return { primaryDelta: 6 - raw, oppositeDelta: raw };
  return { primaryDelta: raw, oppositeDelta: 6 - raw };
}
// 性质：primary + opposite ≡ 6（每题）→ 维度总分恒为 7×6 = 42
```

- **维度总分公式**：`letterScore + oppositeScore = 42`
- **百分比**：`letterPercent = round(letterScore / 42 × 100)`
- **临界区 (Ambiguous Zone)**：`letterPercent ≤ 55` → `ambiguous: true`，UI 弹出"你在 X / Y 之间游移"提示
- **平局处理**：`primary === opposite` 时落到 primary（E/S/T/J），保证稳定输出
- **类型代码**：四个 `letter` 拼接 → `INTJ` / `INFP` / `ESTP` …

### 3. 类型详情页 (Type Detail) — `app/types/[code]/page.tsx`

| 特性 Feature | 说明 |
|---|---|
| **SSG** | `generateStaticParams()` 在构建时为 16 种类型预渲染 16 张静态页 |
| **`dynamicParams = false`** | 未知 code → 自动 404，杜绝脏 URL |
| **per-type Metadata** | 每页独立 `<title>` / `description` / OG，SEO 友好 |
| **canonical** | `/types/INTJ` 唯一规范 URL |
| **回流 CTA** | 详情页底部固定按钮"我是这种人格吗？立刻测评 →" |

数据源：`lib/data/personality-types.ts`（440 行，每类型含 `nameZh / nameEn / shortDesc / longDesc / strengths[] / growth[] / careers[] / icon / accent`）

---

## 🎨 设计令牌 · Design Tokens

> 全部声明在 `app/globals.css` 的 `:root`（迁移自原型 HTML）

### 色板 Color Palette

| Token | Hex | 用途 |
|---|---|---|
| `--sage` | `#6B8F71` | 主品牌色（按钮 / Logo / 强调） |
| `--sage-dark` | `#4F7555` | 主色 hover / focus ring |
| `--sage-bg` | `#EFF5F0` | 主色背景块 |
| `--terracotta` | `#C4775B` | 暖色辅助（情感 CTA） |
| `--warm-gold` | `#B8935A` | 金色点缀（学术感） |
| `--sky` `--lavender` `--rose` | — | 类型卡多彩 accent |
| `--bg` | `#FBF7F1` | 全站米色底 |
| `--text-primary` | `#2C2417` | 主要文字（暖深棕） |

### 字体 Typography

| Token | Family |
|---|---|
| `--font-display` | `Cormorant Garamond, Noto Serif SC, Georgia, serif` |
| `--font-body` | `Noto Sans SC, -apple-system, sans-serif` |
| `--font-mono` | `DM Mono, Menlo, monospace` |

通过 `next/font/google` 自动 self-host + 子集化，CJK 字体 `preload: false` 按需加载。

### 圆角 Radius

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | 8 px | 输入框 / 小按钮 |
| `--radius-md` | 14 px | 卡片内嵌 |
| `--radius-lg` | 20 px | 主卡片 |
| `--radius-xl` | 28 px | 大型容器 |
| `--radius-full` | 100 px | 胶囊按钮 / Tag |

### 阴影 Shadow

| Token | 用途 |
|---|---|
| `--shadow-sm` | 默认卡片休眠态 |
| `--shadow-md` | 卡片 hover |
| `--shadow-lg` | 弹层 / 结果面板 |
| `--shadow-xl` | 关键 CTA |

### 缓动 Easing

`--ease-smooth` / `--ease-out-expo` / `--ease-spring` — 配合 `prefers-reduced-motion: reduce` 自动降级。

---

## ♿ 无障碍与 SEO · A11y & SEO

### Accessibility ✅

- **Skip to content**：`<a class="skip-to-content">` 键盘 Tab 第一站
- **Focus visible**：全局 `:focus-visible` 用 sage 色 ring，圆角跟随元素形态
- **Reduced motion**：`@media (prefers-reduced-motion: reduce)` 全量禁用动画
- **语义化结构**：`<main id="main">` / `<header>` / `<nav>` / `<footer>` 完整 landmark
- **aria-label / aria-current** 在导航与单选按钮上正确标注
- **键盘可达**：Likert 单选用 `<input type="radio">` 原生，Tab + Space 全功能

### SEO 🔍

| 项 | 来源 |
|---|---|
| `<title>` 模板 | `app/layout.tsx` 中 `metadata.title.template = "%s \| 心栖 MindNest"` |
| `description` / `keywords` | `lib/site.ts` 集中管理 |
| OG / Twitter card | `metadata.openGraph` / `metadata.twitter` |
| JSON-LD | `Organization` + `WebSite`（layout 内联） |
| robots.txt | `app/robots.ts` |
| sitemap.xml | `app/sitemap.ts`（含全部类型详情页 URL） |
| canonical | layout 默认 `/`，类型详情页覆盖为 `/types/[code]` |
| 静态生成 | 16 类型页 100 % SSG，TTFB 极低 |

---

## 🤝 贡献指南 · Contributing

欢迎提 PR / Issue。请遵守：

1. **新功能/Bug fix** → 从 `main` 拉新分支：`feat/xxx` 或 `fix/xxx`
2. **保持类型完整** — 不允许 `any`，新增数据请扩展 `lib/data/*.ts` 的类型定义
3. **题目改动需附心理学依据** — quiz-questions / personality-types 修改请在 PR 描述里说明参考文献
4. **运行 `npm run lint && npm run build`** — CI 通过才能合并
5. **遵循设计令牌** — 颜色 / 圆角 / 字体务必使用 CSS 变量，不直接写 hex

> 注意：`AGENTS.md` 提示本项目使用 **Next.js 16**，部分 API 与你的训练数据可能不同 — 改 App Router 行为前请查 `node_modules/next/dist/docs/`。

---

## 📄 License

[MIT License](./LICENSE) © 2026 MindNest Team

> 你可以自由地使用、修改、分发本项目代码，但请保留版权声明。

---

## 🙏 鸣谢 · Acknowledgements

- **设计灵感**：[16Personalities](https://www.16personalities.com)、[Truity](https://www.truity.com)、[Linear](https://linear.app) 的视觉节奏感
- **理论基础**：Carl G. Jung,《Psychological Types》(1921)；Isabel Briggs Myers,《Gifts Differing》
- **量表参考**：
  - Big Five Inventory (BFI-44) — Oliver P. John, UC Berkeley
  - International Personality Item Pool (IPIP) — Lewis R. Goldberg, public domain
  - Open Extended Jungian Type Scales (OEJTS) — Eric Jorgenson, public domain
- **字体**：Google Fonts — Cormorant Garamond / Noto Serif SC / Noto Sans SC
- **托管**：Vercel — 零配置 Next.js 部署
- **驱动文档**：项目内部 [`/root/workspace/research/ux-and-scales-report.md`](../../research/ux-and-scales-report.md)（UX & 量表调研报告）

> ⚠️ **合规声明**：本平台测评基于公开心理学研究独立研发，与 MBTI® 商标及 The Myers-Briggs Company 无关联。测评结果**不能替代任何医学或临床诊断**。

---

<div align="center">

**[🌐 访问线上 · Visit Live](https://mindnest-six.vercel.app)** ·
**[📘 部署文档 · Deployment](./DEPLOYMENT.md)** ·
**[🐛 提交 Issue](https://github.com/szwnba/mindnest/issues)**

_Made with 🌿 sage and a lot of care._

</div>
