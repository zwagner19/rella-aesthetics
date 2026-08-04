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
                : service.slug === "chemical-peels"
                  ? "/vacaville/chemical-peels"
                  : service.slug === "microneedling"
                    ? "/vacaville/microneedling"
            : "/locations/vacaville",
      detailsLabel:
        service.slug === "microneedling"
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
            : "/locations/napa",
      detailsLabel:
        service.slug === "botox" || service.slug === "dermal-fillers"
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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#FDF7F5_58%,#FBE7E3_100%)] py-16 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12">
          <div className="relative z-10">
            <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-rose-dark">
              {service.heroEyebrow} · {locationLabel}
            </p>
            <h1 className="mb-6 text-[clamp(2.75rem,6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.055em] text-ink">
              {service.heroTitle}
            </h1>
            <p className="mb-8 max-w-[650px] text-lg font-light leading-relaxed text-silver-dark md:text-xl">
              {service.heroDescription}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="#book-service" data-cta="booking-flow-start" className="rounded-full">
                {hasMultipleLocations ? "Choose Your Clinic" : `Book in ${locationLabel}`}
              </Button>
              <Button href="#what-to-expect" variant="ghost" className="rounded-full bg-white/70">
                What to Expect
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(90,94,98,0.18)] md:min-h-[520px]">
              <Image
                src={service.image}
                alt={`${service.title} consultation and treatment at Rella Aesthetics`}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] bg-white/94 p-5 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
                <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Start with a consultation</p>
                <p className="text-lg font-medium leading-snug text-ink">Understand the plan and price before treatment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        ariaLabel={`Rella ${service.title} care principles`}
        items={[
          "Physician-owned",
          hasMultipleLocations ? "Two local clinics" : `${locationLabel} booking`,
          "Personalized consultation",
          "Clear next steps",
        ]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
          <div className="rounded-[1.75rem] bg-white p-1 lg:pr-10">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">About the treatment</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">{service.whatItIs.heading}</h2>
            <p className="text-lg font-light leading-relaxed text-silver">{service.whatItIs.body}</p>
          </div>
          <div className="rounded-[1.75rem] bg-rose-blush p-7 md:p-9">
            <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Common goals</p>
            <h2 className="mb-4 text-2xl font-medium tracking-[-0.025em] text-ink">{service.whoItsFor.heading}</h2>
            <p className="mb-6 text-sm leading-relaxed text-silver">{service.whoItsFor.body}</p>
            <ul className="space-y-4">
              {service.whoItsFor.bullets.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-silver-dark">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="what-to-expect" className="scroll-mt-24 bg-ink py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose">Your visit</p>
            <h2 className="mb-5 text-3xl font-medium tracking-[-0.035em] md:text-5xl">{service.whatToExpect.heading}</h2>
            <p className="text-lg font-light leading-relaxed text-white/70">{service.whatToExpect.body}</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {service.whatToExpect.steps.map((step, index) => (
              <li key={step} className="rounded-[1.25rem] border border-white/15 bg-white/[0.04] p-5">
                <span className="mb-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose text-xs font-bold text-white">{index + 1}</span>
                <p className="text-sm leading-relaxed text-white/75">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1000px] gap-8 px-6 md:grid-cols-[0.8fr_1.2fr] md:items-start md:px-8">
          <div>
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Clear pricing</p>
            <h2 className="text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">{service.pricing.heading}</h2>
          </div>
          <div className="rounded-[1.5rem] border border-rose-light/70 bg-white p-7 md:p-9">
            <p className="mb-4 text-lg leading-relaxed text-silver-dark">{service.pricing.body}</p>
            {service.pricing.note && <p className="mb-7 text-sm leading-relaxed text-silver">{service.pricing.note}</p>}
            <Button href="#book-service" data-cta="booking-flow-start" className="rounded-full">
              {hasMultipleLocations ? "Choose a Clinic" : `Book in ${locationLabel}`}
            </Button>
          </div>
        </div>
      </section>

      <section
        id="book-service"
        aria-labelledby="book-service-heading"
        className="scroll-mt-24 bg-rose-blush py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <div className="mb-10 max-w-[720px]">
            <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">
              {hasMultipleLocations ? "Two locations" : "Current booking location"}
            </p>
            <h2 id="book-service-heading" className="mb-4 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">
              {hasMultipleLocations ? "Choose your clinic before you book." : `Book ${service.title} in ${locationLabel}.`}
            </h2>
            <p className="text-lg font-light leading-relaxed text-silver">
              {hasMultipleLocations
                ? "Select Vacaville or Napa here so your booking journey opens with the correct clinic context."
                : `${service.title} are currently listed in the ${locationLabel} booking menu. Contact Rella before planning around another clinic.`}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {bookingOptions.map((location, index) => (
              <div key={location.name} className="rounded-[1.5rem] border border-rose-light/70 bg-white p-6 md:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Rella Aesthetics</p>
                  <span aria-hidden="true" className="text-2xl font-light text-rose">0{index + 1}</span>
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-[-0.025em] text-ink">{location.name}</h3>
                <p className="mb-6 text-sm text-silver">{location.address}</p>
                <div className="flex flex-col items-start gap-4">
                  <Button
                    href={location.bookingHref}
                    data-cta="service-booking"
                    className="w-full rounded-full px-5"
                  >
                    Book in {location.name}
                  </Button>
                  <Link
                    href={location.detailsHref}
                    className="text-sm font-medium text-rose-text underline decoration-rose-light underline-offset-4 hover:text-rose-dark"
                  >
                    {location.detailsLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[900px] px-6 md:px-8">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-rose-dark">Questions, answered</p>
          <h2 className="mb-8 text-3xl font-medium tracking-[-0.035em] text-ink md:text-5xl">{service.title} FAQ</h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      <section className="bg-rose py-20 text-center text-white">
        <div className="mx-auto max-w-[680px] px-6">
          <h2 className="mb-4 text-3xl font-medium tracking-[-0.035em] md:text-5xl">Ready for a clear next step?</h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-white/85">Book a consultation to review your goals, the appropriate plan, and the current total before treatment.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {bookingOptions.map((location) => (
              <Button
                key={location.name}
                href={location.bookingHref}
                data-cta="service-booking"
                className="rounded-full bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
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
