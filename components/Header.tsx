"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLink {
  href: string;
  label: string;
  cta?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/#frameworks", label: "理论基础" },
  { href: "/#types", label: "人格类型" },
  { href: "/#quiz", label: "开始测评" },
  { href: "/#resources", label: "资料库" },
  { href: "/#faq", label: "常见问题" },
  { href: "/#quiz", label: "免费测评", cta: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 桌面端 resize 后重置 mobile 菜单状态，避免关闭后样式残留（修复 QA §2.3）
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <header>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="主导航">
        <Link href="/" className="nav-brand" aria-label="心栖 MindNest 首页">
          <div className="nav-logo" aria-hidden="true" />
          <div className="nav-title">
            心栖 <small>MindNest</small>
          </div>
        </Link>

        <ul
          id="primaryNav"
          className={`nav-links${open ? " nav-links--mobile-open" : ""}`}
        >
          {NAV_LINKS.map((l) => (
            <li key={`${l.href}-${l.label}`}>
              <Link
                href={l.href}
                className={l.cta ? "nav-cta" : ""}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-mobile-btn"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          aria-controls="primaryNav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </nav>
    </header>
  );
}
