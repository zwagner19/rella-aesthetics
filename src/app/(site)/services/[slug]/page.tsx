import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { servicePages } from "@/lib/service-data";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { getServiceMetadata } from "@/lib/service-metadata";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const clinicNames: Record<BookingLocation, string> = {
  vacaville: "Vacaville",
  napa: "Napa",
};
const RELLA_PHONE_HREF = "tel:+17073582928";

export async function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  return getServiceMetadata(slug);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) notFound();

  if (service.slug === "weight-loss") {
    return <WeightLossServicePage />;
  }

  const availableLocations: readonly BookingLocation[] =
    service.availableLocations ?? (["vacaville", "napa"] as const);
  const soleLocation =
    availableLocations.length === 1 ? availableLocations[0] : undefined;
  const isCallAssisted = service.slug === "iv-hydration";
  const primaryHref = isCallAssisted
    ? RELLA_PHONE_HREF
    : resolveBookingHref({
        location: soleLocation,
        service: service.slug,
      });
  const primaryLabel = isCallAssisted
    ? "Call About IV Hydration"
    : soleLocation
      ? `Book ${service.title} in ${clinicNames[soleLocation]}`
      : `Book ${service.title}`;

  return (
    <>
      <FaqSchema items={service.faq} />

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-5 text-sm font-medium italic tracking-[0.04em] text-ink">
              {service.heroEyebrow}
            </p>
            <h1 className="mb-6 break-words text-[clamp(1.9rem,9vw,2.25rem)] font-bold uppercase leading-[1.04] tracking-[0.04em] text-rose-text sm:text-4xl sm:tracking-[0.08em] md:text-6xl">
              {service.heroTitle}
            </h1>
            <p className="mb-9 max-w-[620px] text-lg font-light leading-relaxed text-ink/70">
              {service.heroDescription}
            </p>
            <Button
              href={primaryHref}
              data-cta={isCallAssisted ? "phone" : "service-booking"}
              disableHover
            >
              {primaryLabel}
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              loading="eager"
              className="object-cover object-center"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-rose/25 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-sm font-medium italic text-ink">Treatment overview</p>
          <h2 className="mb-6 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-rose-text sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {service.whatItIs.heading}
          </h2>
          <p className="text-lg font-light leading-relaxed text-ink/70">{service.whatItIs.body}</p>
        </div>
      </section>

      <section className="bg-rose-blush py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <h2 className="mb-5 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-rose-text sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {service.whoItsFor.heading}
          </h2>
          <p className="mb-9 max-w-[780px] text-lg font-light leading-relaxed text-ink/70">
            {service.whoItsFor.body}
          </p>
          <ul className="grid gap-px bg-rose/35 sm:grid-cols-2">
            {service.whoItsFor.bullets.map((item) => (
              <li key={item} className="flex gap-4 bg-white p-6 text-ink">
                <span aria-hidden="true" className="font-bold text-ink">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-rose py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <p className="mb-4 text-sm font-medium italic text-ink">Your visit</p>
          <h2 className="mb-6 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-ink sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {service.whatToExpect.heading}
          </h2>
          <p className="mb-10 max-w-[780px] text-lg font-light leading-relaxed text-ink">
            {service.whatToExpect.body}
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {service.whatToExpect.steps.map((step, index) => (
              <li key={step} className="flex gap-5 border border-ink/35 bg-rose p-6 text-ink">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-rose-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pt-2 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <h2 className="mb-6 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-rose-text sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {service.pricing.heading}
          </h2>
          <p className="text-lg font-light leading-relaxed text-ink/70">{service.pricing.body}</p>
          {service.pricing.note ? (
            <p className="mt-5 border-l-2 border-rose pl-5 text-sm leading-relaxed text-ink/70">
              {service.pricing.note}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-rose py-20 md:py-24">
        <div className="mx-auto max-w-[1000px] px-6 text-center md:px-8">
          <p className="mb-4 text-sm font-medium italic text-ink">
            {isCallAssisted
              ? "Call-assisted booking"
              : soleLocation
                ? clinicNames[soleLocation]
                : "Vacaville + Napa"}
          </p>
          <h2 className="mb-8 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-ink sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {isCallAssisted
              ? "Call Rella for IV availability"
              : soleLocation
                ? `${service.title} is bookable in ${clinicNames[soleLocation]}`
                : "Choose your Rella clinic"}
          </h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isCallAssisted ? (
              <Button
                href={RELLA_PHONE_HREF}
                data-cta="phone"
                variant="light"
                disableHover
              >
                Call 707.358.2928
              </Button>
            ) : availableLocations.map((location) => (
              <Button
                key={location}
                href={resolveBookingHref({ location, service: service.slug })}
                data-cta="service-booking"
                data-location={location}
                variant="light"
                disableHover
              >
                Book in {clinicNames[location]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <h2 className="mb-10 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-rose-text sm:text-3xl sm:tracking-[0.06em] md:text-5xl">
            {service.title} FAQ
          </h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      <section className="bg-rose py-16 text-center md:py-20">
        <div className="mx-auto max-w-[700px] px-6">
          <h2 className="mb-4 break-words text-[clamp(1.75rem,8.5vw,1.875rem)] font-bold uppercase tracking-[0.035em] text-ink sm:text-3xl sm:tracking-[0.06em] md:text-4xl">
            Ready for a clear next step?
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-ink">
            {isCallAssisted
              ? "Call Rella, name your preferred clinic, and ask about IV hydration availability and next steps."
              : `Schedule a consultation to learn whether ${service.title.toLowerCase()} is appropriate for your goals.`}
          </p>
          <Button
            href={primaryHref}
            data-cta={isCallAssisted ? "phone" : "service-booking"}
            variant="light"
            disableHover
          >
            {primaryLabel}
          </Button>
        </div>
      </section>
    </>
  );
}
