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
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/"
  }
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
