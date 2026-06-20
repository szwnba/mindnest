import { RESOURCES } from "@/lib/data/resources";

export default function Resources() {
  const featured = RESOURCES.find((r) => r.featured);
  const small = RESOURCES.filter((r) => !r.featured);

  return (
    <section className="section" id="resources" aria-labelledby="resources-title">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-eyebrow">
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">精选资料</span>
          </div>
          <h2 className="section-title" id="resources-title">
            人格研究资料库
          </h2>
          <p className="section-subtitle">
            定期收录全球最新、最专业的人格心理学研究与实践应用，帮你持续深化对人格的理解。
          </p>
        </div>

        <div className="resources-layout">
          {featured && (
            <article className="resource-featured reveal">
              {featured.featuredTag && (
                <span className="tag resource-featured-tag">
                  {featured.featuredTag}
                </span>
              )}
              <h3 className="resource-featured-title">{featured.title}</h3>
              <p className="resource-featured-excerpt">{featured.excerpt}</p>
              <div className="resource-featured-meta">
                <div className="resource-author-avatar" aria-hidden="true">
                  {featured.icon ?? "📖"}
                </div>
                <div>
                  <div className="resource-author-name">
                    {featured.author ?? "MindNest 编辑组"}
                  </div>
                  <div className="resource-author-date">
                    {featured.date ?? "敬请期待"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                ✦ 完整版即将发布，敬请期待
              </div>
            </article>
          )}

          {small.map((r, i) => (
            <article
              key={r.slug}
              className={`resource-small-card reveal reveal-d${(i % 4) + 1}`}
            >
              <div className="resource-small-cat">{r.category}</div>
              <h3 className="resource-small-title">{r.title}</h3>
              <p className="resource-small-excerpt">{r.excerpt}</p>
              {r.tags && r.tags.length > 0 && (
                <div className="resource-tags-row">
                  {r.tags.map((t) => (
                    <span key={t} className="resource-mini-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                敬请期待
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
