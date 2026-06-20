interface TrustItem {
  icon: string;
  bgVar?: string; // CSS var name for icon background tint
  title: string;
  desc: string;
}

/**
 * QA §1: 删除"50,000+ 用户"假数据，改为可证伪/可独立验证的 4 条信息。
 */
const ITEMS: TrustItem[] = [
  {
    icon: "🏛️",
    title: "学术理论支撑",
    desc: "基于荣格心理类型理论",
  },
  {
    icon: "📊",
    bgVar: "--terracotta-bg",
    title: "多维度评估",
    desc: "整合多种专业测评体系",
  },
  {
    icon: "📚",
    bgVar: "--warm-gold-bg",
    title: "持续更新内容",
    desc: "定期收录最新研究文献",
  },
  {
    icon: "🔒",
    bgVar: "--sky-bg",
    title: "隐私优先",
    desc: "测评数据仅用于个人分析",
  },
];

export default function TrustBar() {
  return (
    <div className="trust-bar" role="region" aria-label="平台特点">
      <div className="trust-bar-inner">
        {ITEMS.map((it, i) => (
          <div
            key={it.title}
            className={`trust-item reveal${i > 0 ? ` reveal-d${i}` : ""}`}
          >
            <div
              className="trust-icon"
              style={it.bgVar ? { background: `var(${it.bgVar})` } : undefined}
              aria-hidden="true"
            >
              {it.icon}
            </div>
            <div className="trust-label">
              <strong>{it.title}</strong>
              {it.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
