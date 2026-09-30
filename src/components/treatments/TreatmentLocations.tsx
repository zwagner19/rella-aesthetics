import Image from "next/image";
import Link from "next/link";
import { HOME_LOCATION_VISUALS } from "@/components/home/home-location-visuals";
import type { BookingLocation } from "@/lib/booking-routes";
import { locations } from "@/lib/data";

interface TreatmentLocationsProps {
  id: string;
  availableLocations: readonly BookingLocation[];
  bookingHrefFor: (location: BookingLocation) => string;
  callAssisted?: boolean;
  phoneHref?: string;
}

export function TreatmentLocations({
  id,
  availableLocations,
  bookingHrefFor,
  callAssisted = false,
  phoneHref = "tel:+17073582928",
}: TreatmentLocationsProps) {
  const visuals = HOME_LOCATION_VISUALS.filter((visual) =>
    availableLocations.includes(visual.slug),
  );

  const dual = availableLocations.length > 1;

  return (
    <section
      className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-5">
          {dual ? "Two houses. One standard of care." : "Where we see you."}
        </p>
        <h2
          id={id}
          className="mb-6 max-w-[18ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          {dual
            ? "Vacaville · Napa House"
            : availableLocations[0] === "napa"
              ? "Napa House"
              : "Vacaville"}
        </h2>
        <p className="mb-16 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
          {callAssisted
            ? "Call to confirm IV availability at your preferred house — quiet rooms, familiar faces, the same standard of care."
            : dual
              ? "Quiet rooms, familiar faces, and the same thoughtful consult wherever you book."
              : "Quiet rooms, familiar faces, and a thoughtful consult at this house."}
        </p>

        <div
          className={`grid gap-16 ${dual ? "lg:grid-cols-2 lg:gap-0" : "max-w-xl"}`}
        >
          {visuals.map((visual, index) => {
            const location = locations[visual.slug];
            return (
              <article
                key={visual.slug}
                className={
                  dual
                    ? index === 0
                      ? "lg:border-r lg:border-rule lg:pr-12"
                      : "lg:pl-12"
                    : undefined
                }
              >
                <div className="relative mb-8 aspect-[4/5] overflow-hidden bg-oat">
                  <Image
                    src={visual.image}
                    alt={visual.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes={dual ? "(min-width: 1024px) 45vw, 100vw" : "100vw"}
                  />
                </div>
                <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">
                  {visual.slug === "napa" ? "Napa House" : "Vacaville"}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-silver">
                  {location.address}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>
                {callAssisted ? (
                  <Link
                    href={phoneHref}
                    className="mt-7 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
                    data-cta="phone"
                  >
                    Call about availability
                  </Link>
                ) : (
                  <Link
                    href={bookingHrefFor(visual.slug)}
                    className="mt-7 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
                    data-cta="service-booking"
                    data-location={visual.slug}
                  >
                    Book in {visual.slug === "napa" ? "Napa" : "Vacaville"}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
