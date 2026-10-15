import { treatmentCategories } from "./treatment-categories";

export function TreatmentDiscovery() {
  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-10 md:py-16"
      aria-labelledby="treatments-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-4">Explore by treatment</p>
        <h2
          id="treatments-heading"
          className="mb-6 max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:mb-8"
        >
          Find the care that fits
        </h2>

        <ul className="border-t border-rule" role="list">
          {treatmentCategories.map((category) => (
            <li key={category.id} className="border-b border-rule">
              <div className="grid gap-1 py-4 md:grid-cols-[minmax(12rem,16rem)_1fr] md:items-baseline md:gap-10 md:py-5">
                <span className="text-xl font-medium tracking-[-0.01em] text-ink md:text-2xl">
                  {category.label}
                </span>
                <span className="text-sm font-light leading-relaxed text-silver md:text-base">
                  {category.services.join(" · ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
