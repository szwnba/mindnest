import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-deco hero-deco-1" aria-hidden="true" />
      <div className="hero-deco hero-deco-2" aria-hidden="true" />
      <div className="hero-deco hero-deco-3" aria-hidden="true" />

      <div className="hero-grid">
        <div className="hero-text">
          <div className="hero-greeting">
            <span className="hero-greeting-line" aria-hidden="true" />
            专业人格心理测评平台
          </div>
          <h1 id="hero-title" className="hero-title">
            认识你自己，
            <br />
            是一切<em>成长</em>的起点
          </h1>
          <p className="hero-desc">
            基于荣格心理类型理论、大五人格模型等经典框架，
            用科学的方法帮你理解思维偏好、情感模式与行为倾向。
            不是给你贴标签，而是为你打开一扇理解自己的窗。
          </p>
          <div className="hero-actions">
            <Link href="/#quiz" className="btn btn-primary btn-lg">
              开始免费测评
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#frameworks" className="btn btn-ghost btn-lg">
              了解科学依据
            </Link>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars" aria-hidden="true">
              <div className="hero-trust-avatar">🌿</div>
              <div className="hero-trust-avatar">🧠</div>
              <div className="hero-trust-avatar">📖</div>
              <div className="hero-trust-avatar">💡</div>
              <div className="hero-trust-avatar">🎯</div>
            </div>
            <div className="hero-trust-text">
              <strong>28 题 Likert 测评</strong>
              <br />
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                整合 6 大权威心理学框架·尊重每一种独特
              </span>
            </div>
          </div>
        </div>

        <aside className="hero-visual" aria-label="示例结果预览">
          <div className="hero-card-stack">
            {/* 主卡：明确标注「示例」 */}
            <div className="hero-floating-card hfc-main" aria-hidden="true">
              <div className="hfc-header">
                <div className="hfc-icon" style={{ background: "var(--sage-bg)" }}>
                  🦋
                </div>
                <div>
                  <div className="hfc-type-code">示例 · INFP</div>
                  <div className="hfc-type-name">调停者</div>
                </div>
              </div>
              <div className="hfc-traits">
                <span className="hfc-trait">理想主义</span>
                <span className="hfc-trait">共情力强</span>
                <span className="hfc-trait">富有创意</span>
                <span className="hfc-trait">内省</span>
              </div>
              <div className="hfc-bar-group">
                <div className="hfc-bar-item">
                  <span className="hfc-bar-label">E / I</span>
                  <div className="hfc-bar-track">
                    <div className="hfc-bar-fill sage" style={{ width: "78%" }} />
                  </div>
                </div>
                <div className="hfc-bar-item">
                  <span className="hfc-bar-label">S / N</span>
                  <div className="hfc-bar-track">
                    <div
                      className="hfc-bar-fill terracotta"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div className="hfc-bar-item">
                  <span className="hfc-bar-label">T / F</span>
                  <div className="hfc-bar-track">
                    <div className="hfc-bar-fill gold" style={{ width: "82%" }} />
                  </div>
                </div>
                <div className="hfc-bar-item">
                  <span className="hfc-bar-label">J / P</span>
                  <div className="hfc-bar-track">
                    <div className="hfc-bar-fill sky" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-floating-card hfc-mini-1" aria-hidden="true">
              <div className="hfc-mini-stat">
                <div
                  className="hfc-mini-stat-value"
                  style={{ color: "var(--sage)" }}
                >
                  4
                </div>
                <div className="hfc-mini-stat-label">核心维度</div>
              </div>
            </div>
            <div className="hero-floating-card hfc-mini-2" aria-hidden="true">
              <div className="hfc-mini-stat">
                <div
                  className="hfc-mini-stat-value"
                  style={{ color: "var(--terracotta)" }}
                >
                  16
                </div>
                <div className="hfc-mini-stat-label">人格类型</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
