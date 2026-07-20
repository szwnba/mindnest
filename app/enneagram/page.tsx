import type { Metadata } from "next";
import QuizEnneagram from "@/components/QuizEnneagram";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "九型人格测试 · Enneagram · 心栖 MindNest",
  description:
    "九型人格测评（Enneagram）：探索你的核心动机、恐惧与欲望，找到属于你的9种类型之一，理解行为背后的「为什么」。",
  alternates: {
    canonical: "/enneagram",
  },
};

export default function EnneagramPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": "九型人格测试 · Enneagram",
            "description": "九型人格测评（Enneagram）：探索你的核心动机、恐惧与欲望，找到属于你的9种类型之一。",
            "mainEntity": {
              "@type": "Question",
              "name": "什么是九型人格测试？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "九型人格（Enneagram）是一种古老的人格心理学理论，将人格分为9种核心类型，每种类型由特定的核心恐惧、核心欲望和核心动机驱动。与关注行为表面的测评不同，九型人格深入探索你为什么这样做——你的内在驱动力是什么。"
              }
            }
          })
        }}
      />
      <Header />
      <main id="main">
        <QuizEnneagram />
      </main>
      <Footer />
    </>
  );
}
