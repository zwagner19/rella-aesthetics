import Image from "next/image";
import type { BeforeAfterResult } from "@/content/results";

interface BeforeAfterGalleryProps {
  eyebrow?: string;
  title?: string;
  introduction?: string;
  results: readonly BeforeAfterResult[];
  tone?: "light" | "blush";
}
export function BeforeAfterGallery({
  eyebrow = "Before & after",
  title = "Real patient results.",
  introduction = "Treatment plans and outcomes are individual. Photography is published only with permission.",
  results,
  tone = "light",
}: BeforeAfterGalleryProps) {
  if (results.length === 0) return null;

  return (
    <section
      aria-labelledby="before-after-heading"
      className={tone === "blush" ? "bg-rose-blush py-20 md:py-24" : "bg-white py-20 md:py-24"}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="mb-10 max-w-[760px]">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
            {eyebrow}
          </p>
          <h2 id="before-after-heading" className="mb-4 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
            {title}
          </h2>
          <p className="text-base font-light leading-relaxed text-silver md:text-lg">{introduction}</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          {results.map((result) => (
            <figure key={result.id} className="overflow-hidden rounded-[1.5rem] border border-silver-pale bg-white shadow-[0_14px_45px_rgba(90,94,98,0.08)]">
              <div className="grid grid-cols-2">
                {([
                  { label: "Before", src: result.beforeSrc, alt: result.beforeAlt },
                  { label: "After", src: result.afterSrc, alt: result.afterAlt },
                ] as const).map((image) => (
                  <div key={image.label} className="relative aspect-[4/5] overflow-hidden bg-silver-pale">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white">
                      {image.label}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-ink">{result.treatment}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-dark">{result.timeframe}</p>
                </div>
                <p className="text-sm leading-relaxed text-silver">{result.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-7 text-sm leading-relaxed text-silver-dark">
          Individual results vary. Images are not a promise or guarantee of outcome.
        </p>
      </div>
    </section>
  );
}
