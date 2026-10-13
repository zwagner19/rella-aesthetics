import Link from "next/link";
import { locations } from "@/lib/data";
import { ClinicLocationPhoto } from "./ClinicLocationPhoto";
import { HOME_LOCATION_VISUALS } from "./home-location-visuals";

export function HomeLocations() {
  const vacaville = HOME_LOCATION_VISUALS.find((l) => l.slug === "vacaville")!;
  const napa = HOME_LOCATION_VISUALS.find((l) => l.slug === "napa")!;

  return (
    <section
      id="locations"
      className="rella-site-reveal scroll-mt-28 bg-ivory py-20 md:py-28"
      aria-labelledby="locations-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-4">Two locations. One Rella.</p>
        <h2
          id="locations-heading"
          className="mb-14 max-w-[20ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          Hospitality in every visit.
        </h2>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
          <article className="lg:pr-10 lg:border-r lg:border-rule">
            <ClinicLocationPhoto visual={vacaville} className="relative mb-7 aspect-[4/5] overflow-hidden bg-oat" />
            <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">
              Vacaville
            </h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-silver">
              {locations.vacaville.address}
              <br />
              {locations.vacaville.city}, {locations.vacaville.state} {locations.vacaville.zip}
            </p>
            <Link
              href="/locations/vacaville"
              className="mt-6 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              Vacaville details
            </Link>
          </article>

          <article className="lg:pl-10">
            <ClinicLocationPhoto visual={napa} className="relative mb-7 aspect-[4/5] overflow-hidden bg-oat" />
            <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">Napa House</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-silver">
              {locations.napa.address}
              <br />
              {locations.napa.city}, {locations.napa.state} {locations.napa.zip}
            </p>
            <Link
              href="/locations/napa"
              className="mt-6 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
            >
              Napa details
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
