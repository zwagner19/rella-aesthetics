const principles = [
  {
    number: "01",
    title: "Personalized",
    body: "Your history, goals, and comfort level shape every recommendation.",
  },
  {
    number: "02",
    title: "Intentional",
    body: "We choose the right treatment — and the right timing — instead of doing more.",
  },
  {
    number: "03",
    title: "Long-term",
    body: "Plans are built to age well with you, visit after visit.",
  },
] as const;

export function RellaStandard() {
  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-24 md:py-32"
      aria-labelledby="standard-heading"
    >
      <div className="mx-auto max-w-[960px] px-6 md:px-8">
        <p className="rella-editorial-eyebrow mb-6 text-center">The Rella Standard</p>
        <h2
          id="standard-heading"
          className="text-center text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
        >
          Your face isn&apos;t a trend.
        </h2>

        <ol className="mt-16 space-y-0 border-t border-rule">
          {principles.map((principle) => (
            <li
              key={principle.number}
              className="grid gap-3 border-b border-rule py-8 md:grid-cols-[5rem_12rem_1fr] md:items-baseline md:gap-8"
            >
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-silver">
                {principle.number}
              </span>
              <span className="text-lg font-medium uppercase tracking-[0.12em] text-ink">
                {principle.title}
              </span>
              <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                {principle.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
