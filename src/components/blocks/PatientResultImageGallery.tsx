import Image from "next/image";
import type { PatientResultImage } from "@/content/results";

export function PatientResultImageGallery({
  results,
}: {
  results: readonly PatientResultImage[];
}) {
  if (results.length === 0) return null;

  return (
    <section className="bg-rose py-20 text-white md:py-24" aria-labelledby="patient-results-heading">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="mb-10 max-w-[760px]">
          <p className="mb-4 text-sm font-normal italic text-white">Patient results</p>
          <h2 id="patient-results-heading" className="mb-4 text-3xl font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
            Real examples. Shared with permission.
          </h2>
          <p className="text-base font-light leading-relaxed text-white md:text-lg">
            These patient-submitted images are shown as shared. Visible areas are labeled when they can be described without inferring a service; treatment details and timing were not provided with these files.
          </p>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <figure key={result.id} className="overflow-hidden border border-ink/10 bg-white">
              <div className="relative aspect-square overflow-hidden bg-silver-pale">
                <Image src={result.src} alt={result.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="p-5">
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
                  Visible area: <span className="text-ink">{result.treatmentArea}</span>
                </p>
                <p className="text-sm leading-relaxed text-ink/70">{result.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-7 text-sm leading-relaxed text-white">Individual results vary. Images are not a promise or guarantee of outcome.</p>
      </div>
    </section>
  );
}
