import Image from "next/image";
import Link from "next/link";
import type { PatientResultImage } from "@/content/results";

interface TreatmentResultsProps {
  id: string;
  heading: string;
  body: string;
  results: readonly PatientResultImage[];
  /** Shown when no approved matching assets exist. */
  assetNeededNote: string;
}

export function TreatmentResults({
  id,
  heading,
  body,
  results,
  assetNeededNote,
}: TreatmentResultsProps) {
  return (
    <section
      className="rella-site-reveal bg-charcoal py-20 text-white md:py-28"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-rose">
              The Transform House
            </p>
            <h2
              id={id}
              className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em]"
            >
              {heading}
            </h2>
          </div>
          <p className="max-w-[36rem] text-base font-light leading-relaxed text-white/75 md:text-lg">
            {body}
          </p>
        </div>

        {results.length > 0 ? (
          <div
            className={`grid gap-5 ${results.length > 1 ? "md:grid-cols-2" : "md:max-w-xl md:grid-cols-1"}`}
          >
            {results.map((result) => (
              <figure key={result.id} className="relative aspect-[4/5] overflow-hidden bg-ink">
                <Image
                  src={result.src}
                  alt={result.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-6 text-sm text-white/90">
                  <span className="font-medium">{result.treatment}</span>
                  <span className="mt-1 block text-xs font-light text-white/65">
                    {result.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center border border-white/20 bg-white/5 px-8 py-16 text-center">
            <p className="max-w-md text-sm font-light leading-relaxed text-white/70">
              {assetNeededNote}
            </p>
          </div>
        )}

        <div className="mt-12">
          <Link href="/gallery" className="rella-cta-rect rella-cta-rect--ghost-light">
            Explore real results
          </Link>
        </div>
      </div>
    </section>
  );
}
