import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { resolveBookingHref } from "@/lib/booking-routes";
import type { ServicePageData } from "@/lib/service-data";

interface TreatmentServicePageProps {
  service: ServicePageData;
}

export function TreatmentServicePage({ service }: TreatmentServicePageProps) {
  const availableLocations = service.availableLocations ?? ["vacaville", "napa"];
  const bookingOptions = [
    {
      location: "vacaville" as const,
      name: "Vacaville",
      address: "542 Main St",
      detailsHref:
        service.slug === "botox"
          ? "/vacaville/botox"
          : service.slug === "dermal-fillers"
            ? "/vacaville/filler"
            : service.slug === "laser-treatments"
              ? "/vacaville/laser"
              : service.slug === "hydrafacial"
                ? "/vacaville/hydrafacial"
                : service.slug === "facials"
                  ? "/vacaville/facials"
                  : service.slug === "chemical-peels"
                    ? "/vacaville/chemical-peels"
                    : service.slug === "microneedling"
                      ? "/vacaville/microneedling"
                      : "/locations/vacaville",
      detailsLabel:
        service.slug === "microneedling" || service.slug === "facials"
          ? "View Vacaville options & visit guide"
          : service.slug === "botox" ||
              service.slug === "dermal-fillers" ||
              service.slug === "laser-treatments" ||
              service.slug === "hydrafacial" ||
              service.slug === "chemical-peels"
            ? "View Vacaville pricing & visit guide"
            : "View Vacaville clinic details",
    },
    {
      location: "napa" as const,
      name: "Napa",
      address: "1541 3rd St",
      detailsHref:
        service.slug === "botox"
          ? "/napa/botox"
          : service.slug === "dermal-fillers"
            ? "/napa/filler"
            : service.slug === "laser-treatments"
              ? "/napa/laser"
              : service.slug === "hydrafacial"
                ? "/napa/hydrafacial"
                : service.slug === "facials"
                  ? "/napa/facials"
                  : "/locations/napa",
      detailsLabel:
        service.slug === "facials"
          ? "View Napa options & visit guide"
          : service.slug === "botox" ||
              service.slug === "dermal-fillers" ||
              service.slug === "laser-treatments" ||
              service.slug === "hydrafacial"
            ? "View Napa pricing & visit guide"
            : "View Napa clinic details",
    },
  ]
    .filter((option) => availableLocations.includes(option.location))
    .map((option) => ({
      ...option,
      bookingHref: resolveBookingHref({
        location: option.location,
        service: service.slug,
      }),
    }));
  const locationLabel = bookingOptions.map((option) => option.name).join(" & ");
  const hasMultipleLocations = bookingOptions.length > 1;

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1160px] items-stretch lg:grid-cols-2">
          <div className="relative z-10">
            <div className="flex h-full flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:px-14 lg:py-28">
            <p className="mb-5 text-sm font-normal italic tracking-normal text-rose">
              {service.heroEyebrow} · {locationLabel}
            </p>
            <h1 className="mb-6 text-[clamp(2.5rem,5vw,4.25rem)] font-bold uppercase leading-[1.08] tracking-[0.08em] text-white">
              {service.heroTitle}
            </h1>
            <p className="mb-8 max-w-[620px] text-base font-light leading-[1.75] text-white/75 md:text-lg">
              {service.heroDescription}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="#book-service" data-cta="booking-flow-start">
                {hasMultipleLocations ? "Choose Your Clinic" : `Book in ${locationLabel}`}
              </Button>
              <Button
                href="#what-to-expect"
                variant="ghost"
                className="!border-white !text-white hover:!bg-white hover:!text-ink"
              >
                What to Expect
              </Button>
            </div>
            </div>
          </div>

          <div className="relative min-h-[390px] w-full md:min-h-[520px]">
              <Image
                src={service.image}
                alt={`${service.title} consultation and treatment at Rella Aesthetics`}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-ink/80 p-5 md:p-6">
                <p className="mb-2 text-sm font-normal italic text-rose">Start with a consultation</p>
                <p className="text-lg font-semibold leading-snug text-white">Understand the plan and price before treatment.</p>
              </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel={`Rella ${service.title} care principles`}
        items={[
          "Consultation-led care",
          hasMultipleLocations ? "Two local clinics" : `${locationLabel} booking`,
          "Personalized consultation",
          "Clear next steps",
        ]}
      />

      <section className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="lg:pr-10">
            <p className="mb-4 text-sm font-normal italic text-rose-text">About the treatment</p>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-ink">{service.whatItIs.heading}</h2>
            <p className="text-base font-light leading-[1.75] text-ink/70 md:text-lg">{service.whatItIs.body}</p>
          </div>
          <div className="border-l-4 border-rose bg-rose-blush p-7 md:p-10">
            <p className="mb-3 text-sm font-normal italic text-ink/70">Common goals</p>
            <h2 className="mb-4 text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-ink">{service.whoItsFor.heading}</h2>
            <p className="mb-6 text-sm leading-[1.75] text-ink/70">{service.whoItsFor.body}</p>
            <ul className="space-y-4">
              {service.whoItsFor.bullets.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-[1.75] text-ink/75">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="what-to-expect" className="scroll-mt-24 bg-ink py-[clamp(4rem,8vw,7rem)] text-white">
        <div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-4 text-sm font-normal italic text-rose">Your visit</p>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em]">{service.whatToExpect.heading}</h2>
            <p className="text-base font-light leading-[1.75] text-white/70 md:text-lg">{service.whatToExpect.body}</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {service.whatToExpect.steps.map((step, index) => (
              <li key={step} className="border-t border-white/20 p-5">
                <span className="mb-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose text-xs font-bold text-ink">{index + 1}</span>
                <p className="text-sm leading-[1.75] text-white/75">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-[1000px] gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:items-start md:px-8">
          <div>
            <p className="mb-4 text-sm font-normal italic text-rose-text">Clear pricing</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-ink">{service.pricing.heading}</h2>
          </div>
          <div className="border-t border-ink/15 bg-white py-7 md:p-9">
            <p className="mb-4 text-lg leading-[1.75] text-ink/80">{service.pricing.body}</p>
            {service.pricing.note && <p className="mb-7 text-sm leading-[1.75] text-ink/60">{service.pricing.note}</p>}
            <Button href="#book-service" data-cta="booking-flow-start">
              {hasMultipleLocations ? "Choose a Clinic" : `Book in ${locationLabel}`}
            </Button>
          </div>
        </div>
      </section>

      <section
        id="book-service"
        aria-labelledby="book-service-heading"
        className="scroll-mt-24 bg-rose py-[clamp(4rem,8vw,6rem)]"
      >
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <div className="mb-10 max-w-[720px]">
            <p className="mb-4 text-sm font-normal italic text-ink/70">
              {hasMultipleLocations ? "Two locations" : "Current booking location"}
            </p>
            <h2 id="book-service-heading" className="mb-4 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-ink">
              {hasMultipleLocations ? "Choose your clinic before you book." : `Book ${service.title} in ${locationLabel}.`}
            </h2>
            <p className="text-lg font-light leading-[1.75] text-ink/75">
              {hasMultipleLocations
                ? "Select Vacaville or Napa here so your booking journey opens with the correct clinic context."
                : `This service is currently listed in the ${locationLabel} booking menu. Contact Rella before planning around another clinic.`}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {bookingOptions.map((location, index) => (
              <div key={location.name} className="border border-ink/15 bg-white p-6 md:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <p className="text-sm font-normal italic text-ink/65">Rella Aesthetics</p>
                  <span aria-hidden="true" className="text-2xl font-light text-ink/45">0{index + 1}</span>
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-[-0.025em] text-ink">{location.name}</h3>
                <p className="mb-6 text-sm text-silver">{location.address}</p>
                <div className="flex flex-col items-start gap-4">
                  <Button
                    href={location.bookingHref}
                    data-cta="service-booking"
                    className="w-full px-5"
                  >
                    Book in {location.name}
                  </Button>
                  <Link
                    href={location.detailsHref}
                    className="text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                  >
                    {location.detailsLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[900px] px-5 md:px-8">
          <p className="mb-4 text-sm font-normal italic text-rose-text">Questions, answered</p>
          <h2 className="mb-8 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em] text-ink">{service.title} FAQ</h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      <section className="bg-ink py-[clamp(4rem,8vw,6rem)] text-center text-white">
        <div className="mx-auto max-w-[680px] px-6">
          <h2 className="mb-4 text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.06em]">Ready for a clear next step?</h2>
          <p className="mb-8 text-lg font-light leading-[1.75] text-white/75">Book a consultation to review your goals, the appropriate plan, and the current total before treatment.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {bookingOptions.map((location) => (
              <Button
                key={location.name}
                href={location.bookingHref}
                data-cta="service-booking"
                variant="ghost"
                className="!border-white !bg-white !text-ink hover:!bg-rose"
              >
                Book in {location.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
