import Link from "next/link";
import { locations } from "@/lib/data";

const clinics = [
  {
    name: "Vacaville",
    href: "/locations/vacaville",
    linkLabel: "Vacaville details",
    location: locations.vacaville,
  },
  {
    name: "Napa House",
    href: "/locations/napa",
    linkLabel: "Napa details",
    location: locations.napa,
  },
] as const;

export function HomeLocations() {
  return (
    <section
      id="locations"
      className="rella-site-reveal scroll-mt-28 bg-ivory py-10 md:py-16"
      aria-labelledby="locations-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-4">Two locations. One Rella</p>
        <h2
          id="locations-heading"
          className="mb-8 max-w-[20ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          Hospitality in every visit
        </h2>

        <div className="grid border border-rule sm:grid-cols-2">
          {clinics.map((clinic, index) => (
            <article
              key={clinic.href}
              className={`px-6 py-7 sm:px-8 sm:py-8 ${
                index === 0 ? "border-b border-rule sm:border-b-0 sm:border-r" : ""
              }`}
            >
              <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">{clinic.name}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-silver">
                {clinic.location.address}
                <br />
                {clinic.location.city}, {clinic.location.state} {clinic.location.zip}
              </p>
              <Link
                href={clinic.href}
                className="mt-5 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
              >
                {clinic.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
