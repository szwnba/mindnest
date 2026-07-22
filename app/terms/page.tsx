import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `使用条款 · ${SITE_NAME}`,
  description: `${SITE_NAME} 的使用条款。使用本网站即表示你同意以下条款。`,
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `使用条款 · ${SITE_NAME}`,
            "description": `${SITE_NAME} 的使用条款。`,
            "url": SITE_URL,
          })
        }}
      />
      <Header />
      <main id="main" className="container narrow" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <article className="prose">
          <h1>使用条款</h1>
          <p className="lead">
            欢迎使用心栖 MindNest。使用本网站即表示你同意以下条款。请仔细阅读。
          </p>

          <h2>1. 服务说明</h2>
          <p>
            心栖 MindNest 提供免费的人格心理测评服务，包括 MBTI、大五人格（BFI-10）、HEXACO 等测评工具。
            本网站提供的所有测评结果仅供参考和自我探索之用，不构成专业心理诊断或治疗建议。
          </p>

          <h2>2. 测评结果的局限性</h2>
          <p>
            人格心理学是一个仍在发展中的科学领域。尽管我们使用的量表基于公开发表的学术研究，
            测评结果并不能完全定义一个人。每个人都是独特的，人格测评只是理解自我的工具之一，
            不应作为职业选择、人际关系决策或其他重大人生决定的唯一依据。
          </p>
          <p>
            如果你正在经历心理健康困扰，请咨询专业的心理咨询师或医疗机构。
            心栖 MindNest 不提供心理健康诊断或治疗服务。
          </p>

          <h2>3. 用户行为</h2>
          <p>使用本网站时，你同意：</p>
          <ul>
            <li>仅将测评结果用于个人自我探索目的</li>
            <li>不将测评结果用于歧视、骚扰或伤害他人</li>
            <li>不尝试破坏、攻击或干扰本网站的正常运行</li>
            <li>不利用自动化工具（爬虫、脚本等）大量抓取网站内容</li>
          </ul>

          <h2>4. 知识产权</h2>
          <p>
            心栖 MindNest 的源代码以 MIT 协议开源。网站上的文本内容、设计和图形受版权保护。
            如果你希望使用本站内容，请遵循相应的开源协议或联系我们获取授权。
          </p>

          <h2>5. 免责声明</h2>
          <p>
            本网站按「现状」提供，不附带任何明示或暗示的担保。我们不保证测评结果的准确性、
            完整性或适用性。使用本网站所产生的任何风险由你自行承担。
          </p>

          <h2>6. 责任限制</h2>
          <p>
            在任何情况下，心栖 MindNest 的作者或贡献者不对因使用本网站而产生的任何直接、
            间接、附带或后果性损害承担责任。
          </p>

          <h2>7. 条款修改</h2>
          <p>
            我们保留随时修改这些条款的权利。修改后的条款将在本网站公布。
            继续使用本网站即表示你接受修改后的条款。
          </p>

          <h2>8. 适用法律</h2>
          <p>
            本条款受中华人民共和国法律管辖。任何争议应首先通过友好协商解决。
          </p>

          <h2>联系我们</h2>
          <p>
            如果你对本使用条款有任何疑问，请通过 GitHub Issue 或邮件联系我们。
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
