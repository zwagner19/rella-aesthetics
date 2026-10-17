interface TreatmentApproachProps {
  id: string;
  headline: string;
  lead: string;
  body: string;
}

export function TreatmentApproach({
  id,
  headline,
  lead,
  body,
}: TreatmentApproachProps) {
  return (
    <section
      className="rella-site-reveal bg-oat/35 py-24 md:py-32"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="max-w-[40rem]">
          <p className="rella-editorial-eyebrow mb-6">Why at Rella?</p>
          <h2
            id={id}
            className="max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
          >
            {headline}
          </h2>
          <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
            {lead}
          </p>
          <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
