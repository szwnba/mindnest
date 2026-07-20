import type { Metadata } from "next";
import QuizHexaco from "@/components/QuizHexaco";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "六大人格维度测试 · HEXACO-60",
  description:
    "HEXACO-60 六大人格维度测评：诚实-谦逊、情绪性、外向性、宜人性、尽责性、开放性。学界认可度最高的六维人格量表之一。",
  alternates: {
    canonical: "/hexaco",
  },
};

export default function HexacoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": "HEXACO 六大人格维度测试",
            "description": "HEXACO-60 六大人格维度测评：诚实-谦逊、情绪性、外向性、宜人性、尽责性、开放性。",
            "mainEntity": {
              "@type": "Question",
              "name": "什么是 HEXACO 测试？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "HEXACO 是当今学界认可度最高的人格模型之一，在大五人格基础上增加了「诚实-谦逊」维度，并对「宜人性」进行了更精确的重构。"
              }
            }
          })
        }}
      />
      <Header />
      <main id="main">
        <QuizHexaco />
      </main>
      <Footer />
    </>
  );
}
