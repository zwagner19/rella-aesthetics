const principles = [
  {
    title: "Personalized",
    body: "Your history, goals, and comfort level shape every recommendation.",
  },
  {
    title: "Intentional",
    body: "We choose the right treatment — and the right timing — instead of doing more.",
  },
  {
    title: "Long-term",
    body: "Plans are built to age well with you, visit after visit.",
  },
] as const;

export function RellaStandard() {
  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-10 md:py-16"
      aria-labelledby="standard-heading"
    >
      <div className="mx-auto max-w-[960px] px-6 md:px-8">
        <p className="rella-editorial-eyebrow mb-4 text-center">The Rella Standard</p>
        <h2
          id="standard-heading"
          className="text-center text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
        >
          Your face isn&apos;t a trend
        </h2>

        <ul className="mt-8 space-y-0 border-t border-rule">
          {principles.map((principle) => (
            <li
              key={principle.title}
              className="grid gap-2 border-b border-rule py-5 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-8"
            >
              <span className="text-lg font-medium uppercase tracking-[0.12em] text-ink">
                {principle.title}
              </span>
              <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
