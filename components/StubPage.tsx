import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * 占位页面（about / privacy / terms / contact 等）共用的"建设中"骨架。
 * 保留 Header / Footer 与全站一致；中央一个 hero 卡片，提示 + 返回首页按钮。
 */
export default function StubPage({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <>
      <Header />
      <main id="main">
        <section className="section">
          <div
            className="section-inner"
            style={{
              textAlign: "center",
              maxWidth: 720,
              paddingTop: "clamp(3rem, 8vw, 6rem)",
              paddingBottom: "clamp(3rem, 8vw, 6rem)",
            }}
          >
            <div
              className="section-eyebrow"
              style={{ justifyContent: "center" }}
            >
              <div className="section-eyebrow-dot" aria-hidden="true" />
              <span className="tag">{eyebrow}</span>
            </div>
            <h1
              className="section-title"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              {title}
            </h1>
            <p
              className="section-subtitle"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "1rem",
              }}
            >
              {body}
            </p>
            <div style={{ marginTop: "2.5rem" }}>
              <Link href="/" className="btn btn-primary btn-lg">
                返回首页
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
