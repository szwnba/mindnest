import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  /** true = 真正还没实现的功能（不同于 stub 页），用 aria-disabled 标记。 */
  placeholder?: boolean;
}

const COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: "测评工具",
    links: [
      { label: "MBTI 28 题测评", href: "/#quiz" },
      { label: "16 种人格图谱", href: "/types" },
      // 这些量表确实尚未实现，保留 placeholder 视觉态。
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
    // about / contact / privacy / terms 已在 app/ 下补齐 stub 页面（QA-V2 P1-NEW-4），
    // 不再用 placeholder。
    links: [
      { label: "关于心栖", href: "/about" },
      { label: "学术顾问", href: "/about#advisors" },
      { label: "投稿合作", href: "/contact" },
      { label: "隐私政策", href: "/privacy" },
      { label: "使用条款", href: "/terms" },
    ],
  },
];

function renderLink(l: FooterLink) {
  if (l.placeholder) {
    // 真正未实现的功能仍然保留 disabled 视觉态，但 href 不再是空 "#"，
    // 而是回到首页，避免点击造成困惑/404。
    return (
      <Link
        href="/"
        aria-disabled="true"
        title="敬请期待"
        tabIndex={-1}
      >
        {l.label}
      </Link>
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
            <Link href="/privacy">隐私政策</Link>
            <Link href="/terms">使用条款</Link>
            <Link href="/contact">联系我们</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
