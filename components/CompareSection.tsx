import Link from "next/link";
import { COMPARISON } from "@/lib/data/site-comparison";

/**
 * 「我们 vs 16Personalities」对比表
 * 桌面端：标准 <table> 渲染
 * 移动端（≤768px）：CSS 切换为卡片堆叠，避免横向滚动
 */
export default function CompareSection() {
  return (
    <section
      className="section compare-section"
      id="compare"
      aria-labelledby="compare-title"
    >
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-eyebrow">
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">坦诚对照</span>
          </div>
          <h2 className="section-title" id="compare-title">
            我们与 16Personalities 的不同
          </h2>
          <p className="section-subtitle">
            不是跳战书，是一场诚实的自我定位 —— 说清楚我们是什么、不是什么。
          </p>
        </div>

        <div className="compare-legend reveal" aria-label="对比标记说明">
          <span className="compare-legend-item compare-legend-win">🟢 占优</span>
          <span className="compare-legend-item compare-legend-tie">🟡 平分</span>
          <span className="compare-legend-item compare-legend-behind">⚪ 在路上</span>
        </div>

        {/* 桌面端表格 */}
        <div className="compare-table-wrap reveal" role="region" aria-labelledby="compare-title">
          <table className="compare-table">
            <caption className="sr-only">
              MindNest 与 16Personalities 在 11 个维度上的对比
            </caption>
            <thead>
              <tr>
                <th scope="col" className="compare-col-dim">维度</th>
                <th scope="col" className="compare-col-us">MindNest（心栖）</th>
                <th scope="col" className="compare-col-them">16Personalities</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.dimension} className={`compare-row compare-${row.highlight}`}>
                  <th scope="row" className="compare-dim">{row.dimension}</th>
                  <td className="compare-us">
                    <span className="compare-us-inner">
                      {row.highlight === "win" && (
                        <span className="compare-badge compare-badge-win" aria-label="占优">✓</span>
                      )}
                      {row.highlight === "behind" && (
                        <span className="compare-badge compare-badge-behind" aria-label="在路上">
                          在路上
                        </span>
                      )}
                      <span>{row.mindNest}</span>
                    </span>
                  </td>
                  <td className="compare-them">
                    <span className="compare-them-inner">
                      {row.highlight === "win" && (
                        <span className="compare-badge-lose" aria-label="对方">✗</span>
                      )}
                      {row.highlight === "tie" && (
                        <span className="compare-badge-tie-them">平分</span>
                      )}
                      {row.highlight === "behind" && (
                        <span className="compare-badge-win-them" aria-label="对方占优">✓</span>
                      )}
                      <span>{row.sixteenP}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 移动端卡片堆叠 */}
        <ul className="compare-cards reveal" aria-label="对比维度列表">
          {COMPARISON.map((row, i) => (
            <li
              key={row.dimension}
              className={`compare-card compare-${row.highlight}`}
            >
              <div className="compare-card-head">
                <span className="compare-card-idx">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="compare-card-dim">{row.dimension}</h3>
                {row.highlight === "win" && (
                  <span className="compare-badge compare-badge-win" aria-label="占优">✓</span>
                )}
                {row.highlight === "behind" && (
                  <span className="compare-badge compare-badge-behind">在路上</span>
                )}
                {row.highlight === "tie" && (
                  <span className="compare-badge compare-badge-tie">平分</span>
                )}
              </div>
              <div className="compare-card-row">
                <div className="compare-card-label">MindNest</div>
                <div className="compare-card-text">{row.mindNest}</div>
              </div>
              <div className="compare-card-row compare-card-row-them">
                <div className="compare-card-label">
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
                <div className="compare-card-text">{row.sixteenP}</div>
              </div>
            </li>
          ))}
        </ul>

        <p className="compare-coda reveal">
          比较不是为了赢，是为了说清楚我们是什么、不是什么。
        </p>
        <div className="compare-cta reveal">
          <Link href="/compare" className="btn-secondary">
            查看完整对比与逐项详解 →
          </Link>
        </div>
      </div>
    </section>
  );
}
