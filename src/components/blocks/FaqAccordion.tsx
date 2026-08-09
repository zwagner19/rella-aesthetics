interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="max-w-[860px] border-t border-ink/10">
      {items.map((item, i) => (
        <details key={i} className="group border-b border-ink/10">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium text-ink transition-colors hover:text-silver [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span className="ml-4 shrink-0 text-xl font-light text-rose-text group-open:hidden">+</span>
            <span className="ml-4 hidden shrink-0 text-xl font-light text-rose-text group-open:inline">&minus;</span>
          </summary>
          <div className="pb-6 text-[0.9375rem] font-light leading-relaxed text-ink/70">
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
