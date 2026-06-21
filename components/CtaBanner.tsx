"use client";

import { useState, type FormEvent } from "react";

export default function CtaBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    // 暂未对接邮件服务：仅做本地反馈，避免给用户假成功的错觉。
    console.log("[MindNest] newsletter subscribe (mock):", email);
    setSubmitted(true);
  }

  return (
    <section className="section" aria-labelledby="newsletter-title">
      <div className="section-inner">
        <div className="cta-banner reveal">
          <div className="cta-banner-content">
            <h2 id="newsletter-title" className="cta-banner-title">让理解成为一种习惯</h2>
            <p className="cta-banner-desc">
              订阅我们的月度通讯，接收最新的人格心理学研究、深度解读文章与实用成长建议。
            </p>
            <form className="cta-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="newsletter-email" className="cta-form-label">
                邮箱地址
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                className="cta-input"
                placeholder="输入你的邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby="newsletter-feedback"
              />
              <button type="submit" className="btn btn-primary">
                {submitted ? "已记录 ✓" : "订阅通讯"}
              </button>
            </form>
            <div
              id="newsletter-feedback"
              className={`cta-feedback${submitted ? " cta-feedback--ok" : ""}`}
              role="status"
              aria-live="polite"
            >
              {submitted
                ? "感谢你的关注！邮件订阅服务正在搭建中，正式开放后我们会优先通知你。"
                : "暂未对接邮件服务，敬请期待 — 提交后只会保存在你本地的浏览器中。"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
