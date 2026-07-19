import { Suspense } from "react";
import CompareSection from "@/components/CompareSection";
import CtaBanner from "@/components/CtaBanner";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Frameworks from "@/components/Frameworks";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PersonalityTypes from "@/components/PersonalityTypes";
import Quiz from "@/components/Quiz";
import QuizBFI10 from "@/components/QuizBFI10";
import QuizHexaco from "@/components/QuizHexaco";
import QuizHistory from "@/components/QuizHistory";
import { RevealObserver } from "@/components/RevealObserver";
import Resources from "@/components/Resources";
import SharedResultBanner from "@/components/SharedResultBanner";
import TrustBar from "@/components/TrustBar";

export const metadata = {
  title: "专业人格心理测评平台 — MBTI、大五人格、九型人格",
  description: "心栖 MindNest 提供基于 MBTI、大五人格、九型人格等经典科学量表的人格分析、自我探索与成长建议。免费开始测评，深入了解自己。",
};

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Header />
      <main id="main">
        <Suspense fallback={null}>
          <SharedResultBanner />
        </Suspense>
        <Hero />
        <TrustBar />
        <Frameworks />
        <div className="divider" aria-hidden="true" />
        <PersonalityTypes />
        <div className="divider" aria-hidden="true" />
        <Quiz />
        <div className="divider" aria-hidden="true" />
        <QuizBFI10 />
        <div className="divider" aria-hidden="true" />
        <QuizHexaco />
        <div className="divider" aria-hidden="true" />
        <QuizHistory />
        <HowItWorks />
        <div className="divider" aria-hidden="true" />
        <CompareSection />
        <div className="divider" aria-hidden="true" />
        <Resources />
        <div className="divider" aria-hidden="true" />
        <FAQ />
        <div className="divider" aria-hidden="true" />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
