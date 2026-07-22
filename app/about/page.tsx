import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: `关于${SITE_NAME}`,
  description: `${SITE_NAME} 是一个专业人格心理测评平台，整合 MBTI、大五人格、HEXACO 等 6 大权威框架，用科学且温和的方式帮助每个人更好地理解自己。`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": `关于${SITE_NAME}`,
            "description": `${SITE_NAME} 是一个专业人格心理测评平台，整合 MBTI、大五人格、HEXACO 等 6 大权威框架。`,
            "url": SITE_URL,
          })
        }}
      />
      <Header />
      <main id="main" className="container narrow" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <article className="prose">
          <h1>关于{SITE_NAME}</h1>
          <p className="lead">
            心栖 MindNest 是一个专业人格心理测评平台，致力于用科学且温和的方式，帮助每个人更好地理解自己与他人。
          </p>

          <h2>我们的理念</h2>
          <p>
            我们相信，认识自己是所有成长的起点。人格测评不是给你贴标签，而是为你打开一扇理解自己的窗——看到自己的优势与盲点，理解自己与他人的差异，从而在人际关系、职业发展和内心成长上做出更明智的选择。
          </p>

          <h2>权威框架</h2>
          <p>我们整合了心理学领域最受认可的 6 大人格评估框架：</p>
          <ul>
            <li><strong>MBTI 人格类型</strong> — 基于荣格心理类型理论，通过 4 个维度划分 16 种人格类型</li>
            <li><strong>大五人格模型（Big Five / BFI-10）</strong> — 学术界最受认可的人格框架，5 维度连续谱系</li>
            <li><strong>HEXACO 六维模型</strong> — 在大五基础上增加「诚实-谦逊」维度，学界认可度最高</li>
            <li><strong>九型人格</strong> — 从核心动机与恐惧出发，识别 9 种基本类型</li>
            <li><strong>DISC 行为风格</strong> — 聚焦可观察的行为模式，广泛应用于职场</li>
            <li><strong>霍兰德职业兴趣</strong> — 帮助找到与人格最匹配的职业方向</li>
          </ul>

          <h2>隐私优先</h2>
          <p>
            所有测评结果仅保存在你浏览器的本地存储（sessionStorage / localStorage），不会上传到任何服务器。
            我们不需要你注册账号，不需要你提供邮箱，也不会追踪你的行为。你的数据，只属于你。
          </p>

          <h2>开源透明</h2>
          <p>
            心栖 MindNest 的全部源代码以 MIT 协议开源在 GitHub。题库、算法、UI 均可审阅。
            如果你对计分逻辑有疑问，可以直接查看源码验证。
          </p>

          <h2 id="advisors">学术顾问</h2>
          <p>
            心栖 MindNest 的内容与量表设计参考了以下学者与机构的研究成果：
          </p>
          <ul>
            <li><strong>Rammstedt & John (2007)</strong> — BFI-10 短量表开发者，其量表为本平台大五测评的基础</li>
            <li><strong>Ashton & Lee (2009)</strong> — HEXACO 六维人格模型提出者，其 HEXACO-60 量表为本平台 HEXACO 测评的基础</li>
            <li><strong>王登峰、崔红</strong> — 中国人大格心理学研究者，其本土化 Big Five 研究为中文语境下的维度描述提供参考</li>
            <li><strong>Isabel Briggs Myers & Katharine Cook Briggs</strong> — MBTI 量表开发者，其类型学框架为本平台 MBTI 测评的基础</li>
          </ul>

          <h2>联系我们</h2>
          <p>
            如果你有任何问题、建议或反馈，欢迎通过以下方式联系我们：
          </p>
          <ul>
            <li>GitHub: <a href="https://github.com/szwnba/mindnest" target="_blank" rel="noopener noreferrer">szwnba/mindnest</a></li>
            <li>邮箱: <Link href="mailto:hello@mindnest.app">hello@mindnest.app</Link></li>
          </ul>

          <h2>致谢</h2>
          <p>
            心栖 MindNest 的测评量表基于公开的学术研究文献，包括 Rammstedt & John (2007) 的 BFI-10 量表、
            Ashton & Lee (2009) 的 HEXACO-60 量表等。我们感谢这些学者为人格心理学做出的贡献。
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
