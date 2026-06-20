import { FAQS } from "@/lib/data/faqs";

export default function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="section-inner">
        <div className="section-header center reveal">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            <div className="section-eyebrow-dot" aria-hidden="true" />
            <span className="tag">常见问题</span>
          </div>
          <h2 className="section-title" id="faq-title">
            关于人格测评，你可能想了解
          </h2>
        </div>

        <div className="faq-list" style={{ maxWidth: 820, margin: "0 auto" }}>
          {FAQS.map((f, i) => (
            <details
              key={f.question}
              className={`faq-native reveal${i > 0 ? ` reveal-d${Math.min(i, 4)}` : ""}`}
            >
              <summary className="faq-native-summary">
                <span>{f.question}</span>
                <span className="faq-native-icon" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-native-body">{f.answer}</div>
            </details>
          ))}
        </div>
      </div>

      {/* FAQPage JSON-LD（结构化数据） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
