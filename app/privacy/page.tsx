import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `隐私政策 · ${SITE_NAME}`,
  description: `${SITE_NAME} 的隐私政策。我们承诺：所有数据仅存储在浏览器本地，无账号系统，无服务端存储，无第三方追踪。`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `隐私政策 · ${SITE_NAME}`,
            "description": `${SITE_NAME} 的隐私政策。所有数据仅存储在浏览器本地，无账号系统，无服务端存储。`,
            "url": SITE_URL,
          })
        }}
      />
      <Header />
      <main id="main" className="container narrow" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <article className="prose">
          <h1>隐私政策</h1>
          <p className="lead">
            在心栖 MindNest，我们相信隐私是基本人权。本政策详细说明我们如何（以及为何不）处理你的数据。
          </p>

          <h2>核心原则：你的数据只属于你</h2>
          <p>
            心栖 MindNest 的所有测评结果<strong>仅保存在你当前浏览器的本地存储中</strong>（sessionStorage 和 localStorage）。
            我们不会将你的任何数据上传到服务器，也不会与第三方分享。
          </p>

          <h2>我们不收集的信息</h2>
          <ul>
            <li>❌ 不需要注册账号</li>
            <li>❌ 不需要提供邮箱地址</li>
            <li>❌ 不需要提供姓名或任何个人身份信息</li>
            <li>❌ 不使用任何第三方分析或追踪工具（如 Google Analytics、Mixpanel 等）</li>
            <li>❌ 不使用任何第三方广告网络</li>
            <li>❌ 不使用跨站追踪 Cookie</li>
          </ul>

          <h2>我们存储的信息</h2>
          <p>以下数据仅保存在你的浏览器本地：</p>
          <ul>
            <li><strong>sessionStorage</strong>：当前测评的答案和结果（关闭标签页后自动清除）</li>
            <li><strong>localStorage</strong>：测评历史记录（最多保存 50 条，仅你本人可见）</li>
          </ul>
          <p>
            你可以随时通过浏览器的「清除网站数据」功能删除这些数据。
          </p>

          <h2>Cookie 使用</h2>
          <p>
            心栖 MindNest 不使用任何 Cookie。我们不需要 Cookie 来维持登录状态或追踪用户行为。
          </p>

          <h2>第三方服务</h2>
          <p>
            本网站托管在 Vercel 平台上。Vercel 可能会收集基本的访问日志（如 IP 地址、访问时间、User-Agent），
            但这些数据由 Vercel 根据其自身的隐私政策处理，与心栖 MindNest 无关。
          </p>

          <h2>开源透明</h2>
          <p>
            我们的全部源代码在 GitHub 上以 MIT 协议开源。如果你对本隐私政策有任何疑问，
            可以直接查看源码验证我们的数据处理方式。
          </p>

          <h2>政策更新</h2>
          <p>
            我们可能会不时更新本隐私政策。任何重大变更将在本站点发布公告。
            继续使用本网站即表示你接受更新后的政策。
          </p>

          <h2>联系我们</h2>
          <p>
            如果你对本隐私政策有任何疑问，请通过 GitHub Issue 或邮件联系我们。
          </p>

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            最后更新：2026 年 7 月 3 日
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
