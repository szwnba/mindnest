import { FRAMEWORKS } from "@/lib/data/frameworks";

export default function Frameworks() {
  return (
    <section className="section" id="frameworks" aria-labelledby="frameworks-title">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-eyebrow">
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">理论基础</span>
          </div>
          <h2 className="section-title" id="frameworks-title">
            权威测评体系
          </h2>
          <p className="section-subtitle">
            我们整合了心理学领域最受认可的人格评估框架，从不同角度帮你构建完整的自我认知地图。
          </p>
        </div>

        <div className="methods-grid">
          {FRAMEWORKS.map((f, i) => (
            <article
              key={f.code}
              className={`method-card reveal${i > 0 ? ` reveal-d${i}` : ""}`}
              style={
                {
                  ["--method-color" as string]: `var(${f.color})`,
                  ["--method-bg" as string]: `var(${f.bg})`,
                } as React.CSSProperties
              }
            >
              <div className="method-icon" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="method-name">{f.name}</h3>
              <div className="method-full-name">{f.fullName}</div>
              <p className="method-desc">{f.description}</p>
              <ul className="method-features">
                {f.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
