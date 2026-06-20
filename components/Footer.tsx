import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  /** true = 占位链接，加 aria-disabled */
  placeholder?: boolean;
}

const COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: "测评工具",
    links: [
      { label: "MBTI 28 题测评", href: "/#quiz" },
      { label: "16 种人格图谱", href: "/types" },
      { label: "大五人格量表", href: "#", placeholder: true },
      { label: "九型人格测评", href: "#", placeholder: true },
      { label: "DISC 行为风格", href: "#", placeholder: true },
    ],
  },
  {
    title: "学习资源",
    links: [
      { label: "权威测评体系", href: "/#frameworks" },
      { label: "精选资料库", href: "/#resources" },
      { label: "认知功能指南", href: "#", placeholder: true },
      { label: "推荐书单", href: "#", placeholder: true },
      { label: "常见问题", href: "/#faq" },
    ],
  },
  {
    title: "关于",
    links: [
      { label: "关于心栖", href: "/about", placeholder: true },
      { label: "学术顾问", href: "/about#advisors", placeholder: true },
      { label: "投稿合作", href: "/contact", placeholder: true },
      { label: "隐私政策", href: "/privacy", placeholder: true },
      { label: "使用条款", href: "/terms", placeholder: true },
    ],
  },
];

function renderLink(l: FooterLink) {
  // 内部锚点（# 开头）也允许 — 但绝不输出空 href="#"。
  if (l.placeholder) {
    return (
      <a
        href={l.href === "#" ? "/" : l.href}
        aria-disabled="true"
        title="敬请期待"
        tabIndex={-1}
      >
        {l.label}
      </a>
    );
  }
  return <Link href={l.href}>{l.label}</Link>;
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="nav-brand"
              style={{ marginBottom: 0 }}
              aria-label="心栖 MindNest 首页"
            >
              <div className="nav-logo" aria-hidden="true" />
              <div className="nav-title">
                心栖 <small>MindNest</small>
              </div>
            </Link>
            <p className="footer-brand-text">
              致力于用科学且温和的方式，帮助每个人更好地理解自己与他人。认识自己，是所有成长的起点。
            </p>
          </div>
          {COLS.map((col) => (
            <div className="footer-col" key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul>
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>{renderLink(l)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2025 心栖 MindNest · 人格探索实验室</span>
          <div className="footer-bottom-links">
            <a href="/privacy" aria-disabled="true" tabIndex={-1}>
              隐私政策
            </a>
            <a href="/terms" aria-disabled="true" tabIndex={-1}>
              使用条款
            </a>
            <a href="/contact" aria-disabled="true" tabIndex={-1}>
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
