import type { TreatmentExperienceStep } from "@/lib/treatment-editorial";

interface TreatmentExperienceProps {
  id: string;
  heading: string;
  steps: readonly TreatmentExperienceStep[];
}

export function TreatmentExperience({
  id,
  heading,
  steps,
}: TreatmentExperienceProps) {
  return (
    <section
      className="rella-site-reveal bg-ivory py-24 md:py-32"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[960px] px-6 md:px-8">
        <p className="rella-editorial-eyebrow mb-6">Your visit</p>
        <h2
          id={id}
          className="max-w-[16ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          {heading}
        </h2>
        <ol className="mt-16 space-y-0 border-t border-rule">
          {steps.map((step) => (
            <li
              key={step.number}
              className="grid gap-3 border-b border-rule py-10 md:grid-cols-[5rem_11rem_1fr] md:items-baseline md:gap-10"
            >
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
                {step.number}
              </span>
              <span className="text-lg font-medium uppercase tracking-[0.14em] text-ink">
                {step.title}
              </span>
              <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
