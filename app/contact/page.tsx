import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `投稿合作 · ${SITE_NAME}`,
  description:
    `${SITE_NAME} 欢迎投稿与合作。如果你在人格心理学领域有研究、见解或创作，期待与你共建内容。`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `投稿合作 · ${SITE_NAME}`,
            description:
              `${SITE_NAME} 欢迎投稿与合作。如果你在人格心理学领域有研究、见解或创作，期待与你共建内容。`,
            url: SITE_URL,
          }),
        }}
      />
      <Header />
      <main id="main" className="container narrow" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <article className="prose">
          <h1>投稿与合作</h1>
          <p className="lead">
            心栖 MindNest 欢迎人格心理学领域的投稿、合作与共建。无论你是研究者、咨询师、内容创作者，还是深度用户，都欢迎与我们联系。
          </p>

          <h2>投稿内容</h2>
          <p>我们欢迎以下方向的原创内容：</p>
          <ul>
            <li><strong>学术科普</strong> — 人格心理学最新研究解读、经典理论新视角</li>
            <li><strong>测评工具</strong> — 量表介绍、信效度分析、跨文化比较</li>
            <li><strong>实践应用</strong> — 人格理论在职业规划、团队建设、自我成长中的应用</li>
            <li><strong>批判反思</strong> — 对流行人格测评的理性审视与建设性批评</li>
          </ul>

          <h2>合作方式</h2>
          <ul>
            <li><strong>内容合作</strong> — 长文、专栏、翻译、书评</li>
            <li><strong>学术顾问</strong> — 为量表设计与内容质量提供专业建议</li>
            <li><strong>开源共建</strong> — 代码贡献、题库翻译、UI 改进</li>
            <li><strong>品牌合作</strong> — 心理学相关的产品、活动、社群联动</li>
          </ul>

          <h2>联系方式</h2>
          <ul>
            <li>GitHub: <a href="https://github.com/szwnba/mindnest" target="_blank" rel="noopener noreferrer">szwnba/mindnest</a> — 欢迎提 Issue 或 PR</li>
            <li>邮箱: <a href="mailto:hello@mindnest.app">hello@mindnest.app</a></li>
          </ul>

          <h2>注意事项</h2>
          <ul>
            <li>投稿内容需为原创，引用需注明出处</li>
            <li>我们保留编辑与排版调整的权利</li>
            <li>审稿周期通常为 1-2 周，未采用稿件不另行通知</li>
            <li>合作不涉及商业推广，不接受付费排名或软文</li>
          </ul>
        </article>
      </main>
      <Footer />
    </>
  );
}
