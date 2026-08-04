interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="max-w-[800px]">
      {items.map((item, i) => (
        <details key={i} className="border-b border-silver-pale group">
          <summary className="flex justify-between items-center py-5 cursor-pointer font-medium text-silver-dark hover:text-rose-text transition-colors list-none [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span className="ml-4 shrink-0 text-xl font-light text-rose-text group-open:hidden">+</span>
            <span className="ml-4 hidden shrink-0 text-xl font-light text-rose-text group-open:inline">&minus;</span>
          </summary>
          <div className="pb-6 text-silver text-[0.9375rem] leading-relaxed">
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
