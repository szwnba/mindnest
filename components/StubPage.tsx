"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface StubPageProps {
  eyebrow: string;
  title: string;
  body: string;
}

export default function StubPage({ eyebrow, title, body }: StubPageProps) {
  const t = useTranslations("stubPage");

  return (
    <>
      <Header />
      <main id="main">
        <section className="section" aria-labelledby="stub-title">
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
              id="stub-title"
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
                {t("homeBtn")}
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
