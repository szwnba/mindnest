import type { Metadata } from "next";
import QuizHexaco from "@/components/QuizHexaco";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "六大人格维度测试 · HEXACO-60",
  description:
    "HEXACO-60 六大人格维度测评：诚实-谦逊、情绪性、外向性、宜人性、尽责性、开放性。学界认可度最高的六维人格量表之一。",
};

export default function HexacoPage() {
  return (
    <>
      <Header />
      <main id="main">
        <QuizHexaco />
      </main>
      <Footer />
    </>
  );
}
