import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPARISON } from "@/lib/data/site-comparison";

export const metadata: Metadata = {
  title: "我们与 16Personalities 的不同 · 完整对比 · 心栖 MindNest",
  description:
    "10 个维度逐项对照：理论框架、量表诚信、商业模式、隐私、开源透明……一份诚实的自我定位。",
};

const HIGHLIGHT_BADGE: Record<string, { text: string; cls: string }> = {
  win: { text: "MindNest 占优", cls: "compare-badge-win" },
  tie: { text: "平分秋色", cls: "compare-badge-tie" },
  behind: { text: "我们在路上", cls: "compare-badge-behind" },
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main id="main" className="compare-page">
        <nav className="compare-page-breadcrumb" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span aria-hidden="true"> · </span>
          <span>我们与 16Personalities 的不同</span>
        </nav>

        <h1>我们与 16Personalities 的不同</h1>
        <p className="compare-page-lede">
          16Personalities 是过去十年里全球最大的人格测评入口之一，它的存在
          让「了解自己的人格」变成了一个流行词。MindNest（心栖）不是它的替代品，
          也不打算成为。这页所做的，是把 11 个维度上的差异一项一项摊开来 ——
          有我们更好的地方，有我们暂时还不如的地方，都明说。
          你不需要选边站，只需要知道哪一种工具适合你现在的问题。
        </p>

        <div className="compare-legend" aria-label="对比标记说明">
          <span className="compare-legend-item compare-legend-win">🟢 占优</span>
          <span className="compare-legend-item compare-legend-tie">🟡 平分</span>
          <span className="compare-legend-item compare-legend-behind">⚪ 在路上</span>
        </div>

        <ol className="compare-page-list">
          {COMPARISON.map((row, i) => {
            const badge = HIGHLIGHT_BADGE[row.highlight];
            return (
              <li
                key={row.dimension}
                className={`compare-page-item compare-${row.highlight}`}
                aria-label={`第 ${i + 1} 项：${row.dimension}`}
              >
                <div className="compare-page-item-head">
                  <h2 className="compare-page-item-dim">{row.dimension}</h2>
                  <span className={`compare-badge ${badge.cls}`} aria-label={badge.text}>
                    {row.highlight === "win" ? "✓" : badge.text}
                  </span>
                </div>

                <div className="compare-page-row compare-page-row-us">
                  <div className="compare-page-row-label">MindNest</div>
                  <div className="compare-page-row-text">{row.mindNest}</div>
                </div>
                <div className="compare-page-row">
                  <div className="compare-page-row-label">
                    16Personalities
                    {row.highlight === "win" && (
                      <span className="compare-badge-lose" aria-label="对方"> ✗</span>
                    )}
                    {row.highlight === "tie" && (
                      <span className="compare-badge-tie-them"> 平分</span>
                    )}
                    {row.highlight === "behind" && (
                      <span className="compare-badge-win-them" aria-label="对方占优"> ✓</span>
                    )}
                  </div>
                  <div className="compare-page-row-text">{row.sixteenP}</div>
                </div>

                <details className="compare-page-detail">
                  <summary>展开 · 我们为什么这样设计</summary>
                  <div className="compare-page-detail-body">{row.detail}</div>
                </details>
              </li>
            );
          })}
        </ol>

        <div className="compare-page-coda">
          比较不是为了赢，是为了说清楚我们是什么、不是什么。
          <br />
          —— 然后你可以自己决定要把哪一份关于自己的报告带回家。
        </div>
      </main>
      <Footer />
    </>
  );
}
