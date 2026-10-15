import Image from "next/image";
import { approvedPatientResultImages } from "@/content/results";

export function TransformHouse() {
  const results = approvedPatientResultImages("main-gallery").slice(0, 4);
  const hasResults = results.length > 0;

  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-10 text-ink md:py-16"
      aria-labelledby="transform-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="rella-editorial-eyebrow mb-4">The Transform House</p>
            <h2
              id="transform-heading"
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em]"
            >
              A plan, not a quick fix
            </h2>
          </div>
          <p className="max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Real results take intention. We map treatments over time so changes stay subtle,
            balanced, and unmistakably you.
          </p>
        </div>

        {hasResults ? (
          <div className="mx-auto grid max-w-[680px] grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
            {results.map((result) => (
              <figure key={result.id} className="w-full max-w-[280px] sm:max-w-none">
                <Image
                  src={result.src}
                  alt={result.alt}
                  width={1024}
                  height={1280}
                  className="h-auto w-full"
                  sizes="(min-width: 640px) 320px, 280px"
                />
                <figcaption className="mt-3">
                  <span className="block text-sm font-medium text-ink">{result.treatment}</span>
                  <span className="mt-1 block text-xs font-light leading-relaxed text-silver">
                    Shared with permission. Individual results vary.
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center border border-rule px-8 py-10 text-center">
            <p className="max-w-md text-sm font-light leading-relaxed text-silver">
              Reserved for verified before-and-after photography. Approved patient result assets
              are required before this gallery can publish.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
