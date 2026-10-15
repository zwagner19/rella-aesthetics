import { testimonials } from "@/lib/data";

/** Single real Google review — never invent quotes. */
const featured = testimonials[1];

export function PatientWords() {
  return (
    <section
      className="rella-site-reveal bg-ivory py-10 md:py-16"
      aria-labelledby="patient-words-heading"
    >
      <div className="mx-auto max-w-[880px] px-6 text-center md:px-8">
        <p className="rella-editorial-eyebrow mb-6">Patient words</p>
        <blockquote>
          <p
            id="patient-words-heading"
            className="text-[clamp(1.35rem,3.2vw,2.15rem)] font-light leading-[1.45] tracking-[-0.01em] text-ink"
          >
            &ldquo;{featured.quote}&rdquo;
          </p>
          <footer className="mt-6">
            <cite className="not-italic">
              <span className="block text-sm font-medium uppercase tracking-[0.16em] text-ink">
                {featured.name}
              </span>
              <span className="mt-2 block text-xs font-light uppercase tracking-[0.14em] text-silver">
                {featured.source}
              </span>
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
