import Image from "next/image";
import Link from "next/link";
import { approvedPatientResultImages } from "@/content/results";

export function TransformHouse() {
  const results = approvedPatientResultImages("main-gallery").slice(0, 3);
  const hasResults = results.length > 0;

  return (
    <section
      className="rella-site-reveal bg-charcoal py-20 text-white md:py-28"
      aria-labelledby="transform-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-rose">
              The Transform House
            </p>
            <h2
              id="transform-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em]"
            >
              A plan, not a quick fix.
            </h2>
          </div>
          <p className="max-w-[36rem] text-base font-light leading-relaxed text-white/75 md:text-lg">
            Real results take intention. We map treatments over time so changes stay subtle,
            balanced, and unmistakably you.
          </p>
        </div>

        {hasResults ? (
          <div className="grid gap-4 md:grid-cols-3">
            {results.map((result) => (
              <figure key={result.id} className="group relative aspect-[4/5] overflow-hidden bg-ink">
                <Image
                  src={result.src}
                  alt={result.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5 text-sm text-white/90">
                  <span className="font-medium">{result.treatment}</span>
                  <span className="mt-1 block text-xs font-light text-white/65">
                    Shared with permission. Individual results vary.
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center border border-white/20 bg-white/5 px-8 py-16 text-center">
            <p className="max-w-md text-sm font-light leading-relaxed text-white/70">
              Reserved for verified before-and-after photography. Approved patient result assets
              are required before this gallery can publish.
            </p>
          </div>
        )}

        <div className="mt-10">
          <Link href="/gallery" className="rella-cta-rect rella-cta-rect--ghost-light">
            Explore real results
          </Link>
        </div>
      </div>
    </section>
  );
}
