import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations, services } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Rella Aesthetics Napa | Hours, Address & Booking",
  description:
    "Find Rella Aesthetics Napa at 1541 3rd St. View hours, directions, services, and city-pinned booking.",
  alternates: { canonical: "/locations/napa" },
};

const loc = locations.napa;
const featuredSlugs = new Set([
  "botox",
  "dermal-fillers",
  "facials",
  "hydrafacial",
  "laser-treatments",
  "weight-loss",
]);
const featuredServices = services.filter((service) => featuredSlugs.has(service.slug));
const localServiceHrefs: Readonly<Record<string, string>> = {
  botox: "/napa/botox",
  facials: "/napa/facials",
};

export default function NapaPage() {
  const bookingHref = resolveBookingHref({ location: "napa" });
  const fullAddress = `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(loc)).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="mb-5 text-sm font-medium italic text-ink">
              Consultation-led care · Downtown Napa
            </p>
            <h1 className="mb-6 text-4xl font-bold uppercase leading-[1.08] tracking-[0.08em] text-rose-text md:text-6xl">
              Med spa care in Napa, California.
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-ink/70">
              Consultation-led aesthetic and wellness care, honest guidance, and a plan built
              around your goals—right in downtown Napa.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={bookingHref} disableHover>Book at Napa</Button>
              <Button href={loc.mapUrl} variant="ghost" disableHover>Get Directions</Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-rose-blush">
            <Image
              src="/images/clinic/napa-reception.webp"
              alt="The welcoming reception area inside the Rella Aesthetics Napa clinic"
              fill
              priority
              className="object-cover object-center"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel="Why patients choose Rella Aesthetics Napa"
        items={["Clear guidance", "Personalized plans", "Downtown Napa", "Two local clinics"]}
      />

      <section className="bg-rose py-16 md:py-20">
        <div className="mx-auto grid max-w-[1000px] gap-10 px-6 md:grid-cols-2 md:items-start md:px-8">
          <div>
            <p className="mb-3 text-sm font-medium italic text-ink">Visit us</p>
            <h2 className="mb-5 text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-4xl">
              Rella Napa
            </h2>
            <address className="not-italic text-ink">
              <p className="text-xl font-semibold">{loc.address}</p>
              <p className="mt-2">{loc.city}, {loc.state} {loc.zip}</p>
              <a
                href={`tel:+1${loc.phone.replace(/\D/g, "")}`}
                className="mt-5 inline-flex min-h-11 items-center font-bold underline underline-offset-4"
              >
                {loc.phone}
              </a>
            </address>
          </div>
          <div className="border-t border-ink/30 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h3 className="mb-4 text-xl font-bold uppercase tracking-[0.06em] text-ink">Hours</h3>
            {loc.hours.map((line) => (
              <p key={line} className="text-sm leading-7 text-ink">{line}</p>
            ))}
            <a
              href={loc.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-white bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink"
            >
              Leave a Google review
              <span className="sr-only"> for Rella Napa (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1160px] px-6 md:px-8">
          <div className="mb-12 max-w-[760px]">
            <p className="mb-4 text-sm font-medium italic text-ink">Explore care</p>
            <h2 className="mb-5 text-3xl font-bold uppercase leading-[1.15] tracking-[0.06em] text-rose-text md:text-5xl">
              Start with the service that matches your goal.
            </h2>
            <p className="text-lg font-light leading-relaxed text-ink/70">
              Not sure what to choose? Book a consultation and the Rella team can help you identify
              the appropriate next step.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {featuredServices.map((service, index) => (
              <Link
                key={service.slug}
                href={localServiceHrefs[service.slug] ?? `/services/${service.slug}`}
                className="group border-t border-rose bg-white p-6 transition-colors hover:bg-rose focus-visible:bg-rose md:p-8"
              >
                <div className="mb-8 flex items-start justify-between gap-4 text-ink">
                  <span className="text-xs font-bold tracking-[0.18em]">0{index + 1}</span>
                  <span aria-hidden="true" className="text-2xl font-light">→</span>
                </div>
                <h3 className="mb-3 text-xl font-bold uppercase leading-tight tracking-[0.06em] text-rose-text group-hover:text-ink group-focus-visible:text-ink md:text-2xl">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/70 group-hover:text-ink group-focus-visible:text-ink">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href="/services" variant="ghost" disableHover>View All Services</Button>
          </div>
        </div>
      </section>

      <section className="bg-rose py-16 md:py-20">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <p className="mb-3 text-sm font-medium italic text-ink">Plan your visit</p>
            <h2 className="mb-3 text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              {fullAddress}
            </h2>
            <p className="text-ink">Choose a time online, call the team, or open directions before you leave.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button href={bookingHref} variant="light" disableHover>See Available Times</Button>
            <Button href={loc.mapUrl} variant="light" disableHover>Get Directions</Button>
          </div>
        </div>
      </section>
    </>
  );
}
