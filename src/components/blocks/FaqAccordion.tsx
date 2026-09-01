interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
  tone?: "default" | "light";
}

export function FaqAccordion({ items, tone = "default" }: FaqAccordionProps) {
  const isLight = tone === "light";
  const borderColor = isLight ? "border-white/35" : "border-ink/10";
  const questionColor = isLight ? "text-white" : "text-ink";
  const iconColor = isLight ? "text-white" : "text-ink";
  const answerColor = isLight ? "text-white/80" : "text-ink/70";

  return (
    <div className={`max-w-[860px] border-t ${borderColor}`}>
      {items.map((item, i) => (
        <details key={i} className={`group border-b ${borderColor}`}>
          <summary className={`flex cursor-pointer list-none items-center justify-between py-5 font-medium ${questionColor} transition-colors hover:opacity-75 [&::-webkit-details-marker]:hidden`}>
            <span>{item.question}</span>
            <span className={`ml-4 shrink-0 text-xl font-light ${iconColor} group-open:hidden`}>+</span>
            <span className={`ml-4 hidden shrink-0 text-xl font-light ${iconColor} group-open:inline`}>&minus;</span>
          </summary>
          <div className={`pb-6 text-[0.9375rem] font-light leading-relaxed ${answerColor}`}>
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function FaqSchema({ items }: FaqAccordionProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Next.js recommends escaping `<` in JSON-LD so CMS-provided strings
        // cannot terminate the script element.
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
