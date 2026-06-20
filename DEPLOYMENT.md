# 🚀 心栖 MindNest · 部署 & 运维手册

> 受众：未来接手本项目的开发者 / 运维同学
> 最近更新：2026-06-20（V2 重构 + 上线后）
> 配套文档：[`README.md`](./README.md)（开发上手）· [`/root/workspace/research/ux-and-scales-report.md`](../../research/ux-and-scales-report.md)（产品/量表调研）

---

## 1. 线上环境信息 · Production Environment

| 项 Item | 值 Value |
|---|---|
| 🌐 **生产 URL** | <https://mindnest-six.vercel.app> |
| ☁️ **托管平台** | Vercel（Hobby / Pro，按账号配置） |
| 📦 **Vercel 项目名** | `mindnest`（slug 推断为 `mindnest-six`，对应分配域名 `mindnest-six.vercel.app`） |
| 🌳 **生产分支** | `main` |
| 📂 **GitHub 仓库** | <https://github.com/szwnba/mindnest> |
| 🔧 **构建命令** | `next build`（默认） |
| 📁 **输出目录** | `.next`（默认） |
| 🟢 **运行时** | Node.js 20.x（Vercel 默认 LTS） |
| 🔁 **自动部署** | `main` push → 生产；其他分支 push → Preview |

> 🛑 **如需更换自定义域名（如 `mindnest.app`）**：在 Vercel Project → Settings → Domains 添加，并同步修改 `lib/site.ts` 中的 `SITE_URL`，再 commit 触发重部署。

---

## 2. 环境变量 · Environment Variables

### 当前（V2）

> ✅ **当前阶段无任何环境变量** — 题库、类型、文案全部为 TypeScript 静态数据，结果存于客户端 `localStorage`。**无需在 Vercel 配置任何 secret 即可跑通生产。**

### 未来预留（V3 路线图）

| Key | 范围 Scope | 用途 | 何时引入 |
|---|---|---|---|
| `DATABASE_URL` | Production / Preview | 用户系统、结果云存（建议 Supabase / Neon） | V3 引入账户体系时 |
| `NEXTAUTH_SECRET` | Production / Preview | NextAuth.js JWT 签名 | V3 登录功能 |
| `NEXTAUTH_URL` | Production | OAuth 回调基址 | V3 登录功能 |
| `STRIPE_SECRET_KEY` | Production | 付费报告 / 会员 | V3 商业化 |
| `STRIPE_WEBHOOK_SECRET` | Production | 支付回调验签 | V3 商业化 |
| `WECHAT_PAY_*` | Production | 微信支付（中国大陆） | V3 商业化 |
| `RESEND_API_KEY` | Production | 邮件发送（结果保存 / 复测提醒） | V2 后期 |
| `NEXT_PUBLIC_GA_ID` | Production / Preview | Google Analytics 4 ID | V1 闭环数据时（建议尽快补） |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Production | Plausible 自托管分析 | 可选 |

> 🔐 添加环境变量后必须重新部署才生效。前缀 `NEXT_PUBLIC_*` 会暴露到浏览器，**严禁**给敏感 key 加该前缀。

---

## 3. 部署流程 · Deploy Pipeline

### 文字描述

```
开发者本地 → git commit → git push origin main
                              ↓
                  GitHub webhook 触发 Vercel
                              ↓
                  Vercel 拉取最新代码 → npm install → next build
                              ↓
              ┌──────────────┴──────────────┐
              ↓                              ↓
         构建失败 ❌                   构建成功 ✅
       (邮件 / Vercel Dashboard      → 生成新的 Immutable Deployment
        通知)                          → 别名 mindnest-six.vercel.app
                                         指向新 deployment（原子切换，零停机）
```

### ASCII 流程图

```
 ┌──────────────┐    git push    ┌──────────────┐    webhook    ┌──────────────┐
 │  Local dev   │ ─────────────▶ │   GitHub     │ ────────────▶ │   Vercel     │
 │  (your IDE)  │   main branch   │   szwnba/    │                │  Build & CDN │
 └──────────────┘                 │   mindnest   │                └──────┬───────┘
                                  └──────────────┘                       │
                                                                         │ next build
                                                                         ▼
                                                                 ┌──────────────┐
                                                                 │  .next/      │
                                                                 │  + edge fns  │
                                                                 └──────┬───────┘
                                                                        │ promote
                                                                        ▼
                                                          🌐 https://mindnest-six.vercel.app
                                                                (zero-downtime atomic swap)
```

### 触发规则

| 操作 | 结果 |
|---|---|
| `git push origin main` | 🚀 生产部署，更新 `mindnest-six.vercel.app` |
| `git push origin feat/xxx` | 🧪 自动 Preview 部署，PR 评论里贴出 preview URL |
| `git push --force` 到 main | ⚠️ 也会触发生产部署，但历史 deployments 仍可在 Vercel 后台「Promote」回滚 |
| 在 Vercel UI 「Promote to Production」点击旧版本 | ↩️ 即时回滚（30 秒内生效） |

---

## 4. 本地预览 · Local Dev

```bash
# 1. 拉代码
git clone https://github.com/szwnba/mindnest.git
cd mindnest

# 2. 装依赖（首次约 30s）
npm install

# 3. 启动 dev server
npm run dev
# ▲ Next.js 16.2.9
# - Local:        http://localhost:3000
# - Environments: .env.local (none yet)
# ✓ Ready in ~1.5s
```

打开 <http://localhost:3000> 即可，热重载默认开启。

> 💡 改 `lib/data/*.ts` 中的题库/文案后无需重启，HMR 会即时生效。改 `lib/site.ts` 中的 SITE_URL 后建议重启 dev server 让 `metadataBase` 重新计算。

---

## 5. 生产构建验证 · Build Verification

合并到 main 之前，**强烈建议本地至少跑过一次完整 build**，避免线上炸：

```bash
# 1. 清理旧构建（可选）
rm -rf .next

# 2. 全量构建
npm run build
```

成功输出形如：

```
   ▲ Next.js 16.2.9

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (20/20)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XX kB         XX kB
├ ○ /robots.txt                          0 B
├ ○ /sitemap.xml                         0 B
├ ○ /types                               XX kB         XX kB
└ ● /types/[code]                        XX kB         XX kB
    ├ /types/INTJ
    ├ /types/INFP
    ├ /types/ENFP
    └ [+13 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered with generateStaticParams
```

⚠️ **必须看到全部 16 种类型页都被预渲染**，缺一即说明 `lib/data/personality-types.ts` 的 `PERSONALITY_TYPES` 数组有问题。

```bash
# 3. 本地起生产服务（端口 3000）
npm run start
```

```bash
# 4. Lint（CI 同款）
npm run lint
```

---

## 6. 手动调用 Vercel API 重部署 · Manual Redeploy

某些场景需要不 push 代码就触发重部署（清缓存、依赖锁问题、外部数据失效等）。

### 方案 A：Deploy Hooks（最简单 ⭐推荐）

在 Vercel UI：`Project → Settings → Git → Deploy Hooks`，创建一个针对 `main` 分支的 hook，得到形如：

```
https://api.vercel.com/v1/integrations/deploy/prj_XXXXXXXX/YYYYYYYY
```

任意一行 `curl` 即触发：

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_XXXXXXXX/YYYYYYYY
```

> 🔐 这个 URL 自带 token，**视为机密**，不要 commit 进仓库。可以放进 GitHub Action / 定时任务 / 监控告警自动恢复。

### 方案 B：Vercel REST API（需要 personal token）

```bash
# 1. 生成 token: https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"
export VERCEL_TEAM_ID=""   # 个人账号留空；Team 则填 team_xxxxxxxx

# 2. 触发部署（拉最新 main 重建）
curl -X POST "https://api.vercel.com/v13/deployments?teamId=$VERCEL_TEAM_ID" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mindnest",
    "gitSource": {
      "type": "github",
      "repo": "szwnba/mindnest",
      "ref": "main"
    },
    "target": "production"
  }'
```

### 方案 C：示例脚本 `scripts/redeploy.sh`

```bash
#!/usr/bin/env bash
# scripts/redeploy.sh — 一键触发 MindNest 生产重部署
# 用法： VERCEL_DEPLOY_HOOK="..." ./scripts/redeploy.sh
set -euo pipefail

HOOK="${VERCEL_DEPLOY_HOOK:-}"
if [[ -z "$HOOK" ]]; then
  echo "❌ 请先设置 VERCEL_DEPLOY_HOOK 环境变量"
  echo "   导出方式：export VERCEL_DEPLOY_HOOK='https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy'"
  exit 1
fi

echo "🚀 触发 MindNest 生产重部署 ..."
RESP=$(curl -sS -X POST "$HOOK")
echo "✅ Vercel 响应：$RESP"
echo "🔗 1-2 分钟后访问 https://mindnest-six.vercel.app 验证"
```

```bash
chmod +x scripts/redeploy.sh
./scripts/redeploy.sh
```

---

## 7. 常见问题排查 · Troubleshooting

| # | 现象 Symptom | 可能原因 Cause | 解决 Fix |
|---|---|---|---|
| 1 | `next build` 报 `Cannot find module '@/lib/site'` | `tsconfig.json` 的 `paths` 别名未识别 | 确认 `"baseUrl": "."` 与 `"paths": { "@/*": ["./*"] }` 都在；删除 `.next/` 重 build |
| 2 | 线上字体异常（中文衬线变成 fallback） | `Noto_Serif_SC` 加载超时 / 被 CDN 拦 | 已设 `preload: false` 是正常按需；如要更稳，把 CJK 字体也 `preload: true`（代价是 LCP 增加 ~100KB） |
| 3 | `/types/[code]` 全部 404 | `dynamicParams = false` + `generateStaticParams` 没正确返回 | 在 `lib/data/personality-types.ts` 加新类型后必须重 build；本地 `npm run build` 检查日志中是否输出 16 条 |
| 4 | 部署后页面没更新（缓存） | Vercel Edge Cache + 浏览器缓存 | 强制刷新（⌘+Shift+R）；必要时 Vercel UI → Deployment → Redeploy with "Use existing build cache" 取消勾选 |
| 5 | `localStorage` 在 SSR 报 `ReferenceError: localStorage is not defined` | 在 Server Component 里直接访问了 `localStorage` | `Quiz.tsx` 等需要交互的组件顶部必须有 `"use client"`；新写组件请检查 |
| 6 | 测评结果代码错乱（如出现 `IIIE`） | `personality-types.ts` 的 `code` 字段写错或重复 | 用 `Set` 校验：`new Set(PERSONALITY_TYPES.map(t=>t.code)).size === 16` 必须为 true |
| 7 | Vercel 构建超时（>45 min Hobby） | 通常意味着死循环或 `node_modules` 下错代码进了 git | 检查仓库是否误 commit 了 `node_modules/` / `.next/`；`.gitignore` 应已忽略它们 |
| 8 | 上线后 SEO 抓取拿到 404 / noindex | `app/robots.ts` 误返回 disallow / `metadata.robots.index = false` | 确认 `robots.ts` 中 `allow: '/'`；layout 中 `robots.index = true` |

> 🔍 排查时优先看：① Vercel Dashboard → Deployments → 该次部署的 **Build Logs** ② 本地 `npm run build` 是否能复现。

---

## 8. 未来 Roadmap · Future Plan

> 提炼自 [`/root/workspace/research/ux-and-scales-report.md`](../../research/ux-and-scales-report.md) §6。

### ✅ V1（已完成）— Static Showcase

- 16 类型卡接静态详情页 + 死链清理
- a11y 基础：`focus-visible`、Skip-to-content、`prefers-reduced-motion`
- SEO：metadata、JSON-LD、sitemap、robots
- next/font 自托管，首屏 LCP 改善
- "六大测评体系"文案与卡片数量对齐
- 测评保留 10 题作为"快测"是 V1 占位 — V2 已替换

### ✅ V2（当前线上版本）— Real Assessment

- ⭐ **28 题 Likert 测评引擎**（每维度 7 题，含 3 反向）
- ⭐ **维度临界提示**（`letterPercent ≤ 55` 触发"游移"标签）
- ⭐ 16 类型详情页内容扩写（`personality-types.ts` 已扩到 440 行）
- 客户端 `localStorage` 持久化答题与结果
- 全站组件化拆分（11 个 section components）
- ESLint v9 flat config + 零 lint warning

### 🟡 V2.5（短期 1-2 个月内规划）

| 工作项 | 估时 | 备注 |
|---|---|---|
| 接入 GA4 + 基础埋点 | 0.5d | 数据基线，决策需要 |
| 结果分享：H5 短链 + 海报图（satori 服务端生成 1080×1350 PNG） | 1w | 增长核心 — 16Personalities K 因子来源 |
| 邮箱采集嵌入结果页（"输入邮箱解锁完整 PDF 报告"） | 2d | 引入 Resend |
| 引入第二量表 BFI-44（Big Five 大五人格） | 2w | 学术派用户的"重磅菜" |
| 内容运营：每周 2 篇资料库长文（聚焦"INTJ 怎样…"长尾词） | 持续 | SEO 主战场 |

### 🔮 V3（3-6 个月路线图）— User System & Premium

| 工作项 | 估时 | 备注 |
|---|---|---|
| 用户系统（手机号 / 微信 / 邮箱，建议 NextAuth.js + Supabase） | 3w | 引入 `DATABASE_URL` 等 env |
| 多量表组合（16型 + BFI + 九型 / 霍兰德） | 4-6w | 形成"人格全景图" |
| 免费 vs Premium 报告分级（1500 字 vs 8000+ 字 PDF） | 2w | 商业化核心 |
| 支付：微信 / 支付宝 / Stripe — 单次 ¥39 / 年度 ¥199 | 2w | 引入 `STRIPE_*` env |
| 关系适配（双人组合页：伴侣 / 同事） | 2w | 高传播，高留存 |
| B 端团队测评 | 4w | 邀请链接 + 团队画像聚合 |
| 心理咨询师入驻 / 1v1 解读 | 6-8w | 服务变现 |

### V3 商业指标目标

- 完成率 ≥ 65 %
- 分享率 ≥ 18 %
- 邮箱采集 ≥ 12 %
- 付费转化 ≥ 4 %
- ARPU ≥ ¥45
- 月流水 ≥ ¥10 万

---

## 📞 联系 · Contact

- **Repo Owner**: [@szwnba](https://github.com/szwnba)
- **Issues**: <https://github.com/szwnba/mindnest/issues>
- **线上**：<https://mindnest-six.vercel.app>

> 接手提示：所有"产品为什么这么设计"的疑问，先去 `research/ux-and-scales-report.md` 翻一遍 —— 那里有 320 行的决策依据，包含 V1 不足、V2 修复方案、量表选型、合规雷点。**强烈建议接手第一周精读一遍。**
