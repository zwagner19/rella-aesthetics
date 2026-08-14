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
          <p className="mb-4 text-sm font-normal italic text-ink/70">
            {eyebrow}
          </p>
          <h2 id="before-after-heading" className="mb-4 text-3xl font-bold uppercase leading-tight tracking-[0.08em] text-ink md:text-5xl">
            {title}
          </h2>
          <p className="text-base font-light leading-relaxed text-ink/70 md:text-lg">{introduction}</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          {results.map((result) => (
            <figure key={result.id} className="overflow-hidden border border-ink/10 bg-white">
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
                    <span className="absolute left-3 top-3 bg-ink/85 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white">
                      {image.label}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold uppercase tracking-[0.08em] text-ink">{result.treatment}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/70">{result.timeframe}</p>
                </div>
                <p className="text-sm font-light leading-relaxed text-ink/70">{result.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-7 text-sm leading-relaxed text-ink/70">
          Individual results vary. Images are not a promise or guarantee of outcome.
        </p>
      </div>
    </section>
  );
}
