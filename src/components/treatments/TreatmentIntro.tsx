interface TreatmentIntroProps {
  id: string;
  headline: string;
  body: string;
}

export function TreatmentIntro({ id, headline, body }: TreatmentIntroProps) {
  return (
    <section
      className="rella-site-reveal bg-ivory py-28 md:py-36"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[820px] px-6 md:px-8">
        <h2
          id={id}
          className="text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink"
        >
          {headline}
        </h2>
        <div className="rella-editorial-rule mt-12 mb-12 max-w-[4rem]" />
        <p className="max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
          {body}
        </p>
      </div>
    </section>
  );
}
