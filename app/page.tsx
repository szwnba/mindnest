import { Suspense } from "react";
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
import QuizHistory from "@/components/QuizHistory";
import { RevealObserver } from "@/components/RevealObserver";
import Resources from "@/components/Resources";
import SharedResultBanner from "@/components/SharedResultBanner";
import TrustBar from "@/components/TrustBar";

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
        <QuizHistory />
        <HowItWorks />
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
