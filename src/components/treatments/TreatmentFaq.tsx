import { FaqAccordion } from "@/components/blocks/FaqAccordion";

interface TreatmentFaqProps {
  id: string;
  title: string;
  items: readonly { question: string; answer: string }[];
}

export function TreatmentFaq({ id, title, items }: TreatmentFaqProps) {
  return (
    <section
      className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-28"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[1000px] px-6 md:px-8">
        <p className="rella-editorial-eyebrow mb-6">Questions</p>
        <h2
          id={id}
          className="mb-12 text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          {title}
        </h2>
        <FaqAccordion items={[...items]} />
      </div>
    </section>
  );
}
