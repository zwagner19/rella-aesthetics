import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { HOME_LOCATION_VISUALS } from "@/components/home/home-location-visuals";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { PRICING, RESULTS, VISIT } from "@/lib/napa-botox-facts";
import { servicePages } from "@/lib/service-data";

const service = servicePages.find((item) => item.slug === "botox")!;

const bookingHref = resolveBookingHref({ service: "botox" });
const vacavilleBookingHref = resolveBookingHref({
  location: "vacaville",
  service: "botox",
});
const napaBookingHref = resolveBookingHref({
  location: "napa",
  service: "botox",
});

const glance = [
  { label: "Treatment time", value: VISIT.durationCopy },
  { label: "Downtime", value: "Most patients return to their day after treatment" },
  { label: "Results begin", value: "Botox 4–7 days · Dysport 2–5 days" },
  { label: "Maintenance", value: RESULTS.duration },
] as const;

const areas = service.whoItsFor.bullets;

const experience = [
  {
    number: "01",
    title: "Consult",
    body: "A conversation about your facial movement, goals, and treatment history — before any product is chosen.",
  },
  {
    number: "02",
    title: "Treat",
    body: "Targeted injections with fine needles. Sensation varies by person and area; your provider reviews comfort needs first.",
  },
  {
    number: "03",
    title: "Settle",
    body: "Softening begins on a product-specific timeline. Full effect is assessed around two weeks.",
  },
  {
    number: "04",
    title: "Maintain",
    body: "Repeat-treatment timing is individualized. Many plans return around three to four months.",
  },
] as const;

function botoxResultImages() {
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /botox|dysport/i.test(result.treatment),
  );
}

export function BotoxDysportServicePage() {
  const results = botoxResultImages();
  const vacavilleVisual = HOME_LOCATION_VISUALS.find((l) => l.slug === "vacaville")!;
  const napaVisual = HOME_LOCATION_VISUALS.find((l) => l.slug === "napa")!;

  return (
    <>
      <FaqSchema items={service.faq} />

      {/* 01 Hero */}
      <section className="relative -mt-[72px] flex min-h-[88svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/30"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-36 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
          <p className="mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            Injectables
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2.35rem,6.2vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
            Botox + Dysport
          </h1>
          <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            Soften dynamic lines while keeping the expression that still looks like you —
            planned around your face, not a trend.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <a href="#pricing" className="rella-cta-rect rella-cta-rect--ghost-light">
              View pricing
            </a>
          </div>
        </div>
      </section>

      {/* 02 Editorial intro */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="botox-intro-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 text-center md:px-8">
          <p className="rella-editorial-eyebrow mb-8">The treatment</p>
          <h2
            id="botox-intro-heading"
            className="text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Individualized neuromodulator care.
          </h2>
          <p className="mx-auto mt-8 max-w-[40rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.whatItIs.body}
          </p>
        </div>
      </section>

      {/* 03 At a glance — thin rules, not cards */}
      <section
        className="rella-site-reveal border-y border-rule/60 bg-ivory py-16 md:py-20"
        aria-labelledby="botox-glance-heading"
      >
        <div className="mx-auto max-w-[1100px] px-6 md:px-8">
          <h2 id="botox-glance-heading" className="sr-only">
            At a glance
          </h2>
          <dl className="grid gap-0 border-t border-rule/60 sm:grid-cols-2 lg:grid-cols-4">
            {glance.map((item) => (
              <div
                key={item.label}
                className="border-b border-rule/60 py-7 sm:border-r sm:px-6 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <dt className="rella-editorial-eyebrow mb-3">{item.label}</dt>
                <dd className="text-base font-medium leading-snug tracking-[-0.01em] text-ink md:text-lg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 04 What we can address */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-28"
        aria-labelledby="botox-areas-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Areas of focus</p>
          <h2
            id="botox-areas-heading"
            className="max-w-[18ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            What we can address
          </h2>
          <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.whoItsFor.body}
          </p>
          <ul className="mt-12 space-y-0 border-t border-rule">
            {areas.map((area) => (
              <li
                key={area}
                className="border-b border-rule py-5 text-lg font-medium tracking-[-0.01em] text-ink md:text-xl"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 Rella approach */}
      <section
        className="rella-site-reveal bg-oat/40 py-24 md:py-32"
        aria-labelledby="botox-approach-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 text-center md:px-8">
          <p className="rella-editorial-eyebrow mb-8">The Rella approach</p>
          <h2
            id="botox-approach-heading"
            className="text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            We don&apos;t treat trends. We treat you.
          </h2>
          <p className="mx-auto mt-8 max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Care starts with assessment and conversation — not a syringe. Your provider maps facial
            movement, explains product and placement plainly, and chooses restraint when that is
            the better plan.
          </p>
        </div>
      </section>

      {/* 06 Experience */}
      <section
        className="rella-site-reveal border-y border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="botox-experience-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6 text-center">Your visit</p>
          <h2
            id="botox-experience-heading"
            className="text-center text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            How the experience unfolds
          </h2>
          <ol className="mt-16 space-y-0 border-t border-rule">
            {experience.map((step) => (
              <li
                key={step.number}
                className="grid gap-3 border-b border-rule py-8 md:grid-cols-[5rem_10rem_1fr] md:items-baseline md:gap-8"
              >
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-silver">
                  {step.number}
                </span>
                <span className="text-lg font-medium uppercase tracking-[0.12em] text-ink">
                  {step.title}
                </span>
                <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 Real results */}
      <section
        className="rella-site-reveal bg-charcoal py-20 text-white md:py-28"
        aria-labelledby="botox-results-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-rose">
                The Transform House
              </p>
              <h2
                id="botox-results-heading"
                className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em]"
              >
                Real results, natural movement.
              </h2>
            </div>
            <p className="max-w-[36rem] text-base font-light leading-relaxed text-white/75 md:text-lg">
              Approved before-and-after photography for Botox and Dysport, shared with permission.
              Individual results vary.
            </p>
          </div>

          {results.length > 0 ? (
            <div className={`grid gap-4 ${results.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1 md:max-w-xl"}`}>
              {results.map((result) => (
                <figure key={result.id} className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <Image
                    src={result.src}
                    alt={result.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5 text-sm text-white/90">
                    <span className="font-medium">{result.treatment}</span>
                    <span className="mt-1 block text-xs font-light text-white/65">
                      {result.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center border border-white/20 bg-white/5 px-8 py-16 text-center">
              <p className="max-w-md text-sm font-light leading-relaxed text-white/70">
                Layout reserved for verified Botox and Dysport before-and-after photography.
                Approved patient assets are required before this gallery can publish.
              </p>
            </div>
          )}

          <div className="mt-10">
            <Link href="/gallery" className="rella-cta-rect rella-cta-rect--ghost-light">
              Explore real results
            </Link>
          </div>
        </div>
      </section>

      {/* 08 Pricing */}
      <section
        id="pricing"
        className="rella-site-reveal scroll-mt-28 bg-ivory py-24 md:py-32"
        aria-labelledby="botox-pricing-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Investment</p>
          <h2
            id="botox-pricing-heading"
            className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Pricing
          </h2>
          <p className="mt-8 max-w-[40rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Standard pricing is {PRICING.botoxPerUnit}/unit for Botox and {PRICING.dysportPerUnit}
            /unit for Dysport. The 2026 Tox Membership is {PRICING.membershipMonthly}/month with a{" "}
            {PRICING.membershipCommitment} commitment; members pay {PRICING.memberBotoxPerUnit}/unit
            for Botox and {PRICING.memberDysportPerUnit}/unit for Dysport.
          </p>
          <div className="rella-editorial-rule mt-10 mb-10" />
          <p className="max-w-[40rem] text-sm font-light leading-relaxed text-silver">
            {service.pricing.note}
          </p>
          <p className="mt-4 max-w-[40rem] text-sm font-light leading-relaxed text-silver">
            Units are product-specific and not interchangeable.
          </p>
          <Link href="/membership" className="rella-cta-rect rella-cta-rect--ghost mt-10">
            Explore membership
          </Link>
        </div>
      </section>

      {/* 09 Locations */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-20 md:py-28"
        aria-labelledby="botox-locations-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <p className="rella-editorial-eyebrow mb-4">Vacaville · Napa House</p>
          <h2
            id="botox-locations-heading"
            className="mb-14 max-w-[22ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Hospitality in every visit.
          </h2>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <article className="lg:border-r lg:border-rule lg:pr-10">
              <div className="relative mb-7 aspect-[4/5] overflow-hidden bg-oat">
                <Image
                  src={vacavilleVisual.image}
                  alt={vacavilleVisual.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">Vacaville</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-silver">
                {locations.vacaville.address}
                <br />
                {locations.vacaville.city}, {locations.vacaville.state} {locations.vacaville.zip}
              </p>
              <Link
                href={vacavilleBookingHref}
                className="mt-6 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
                data-cta="service-booking"
                data-location="vacaville"
              >
                Book in Vacaville
              </Link>
            </article>

            <article className="lg:pl-10">
              <div className="relative mb-7 aspect-[4/5] overflow-hidden bg-oat">
                <Image
                  src={napaVisual.image}
                  alt={napaVisual.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">Napa House</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-silver">
                {locations.napa.address}
                <br />
                {locations.napa.city}, {locations.napa.state} {locations.napa.zip}
              </p>
              <Link
                href={napaBookingHref}
                className="mt-6 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
                data-cta="service-booking"
                data-location="napa"
              >
                Book in Napa
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 10 FAQ */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-28"
        aria-labelledby="botox-faq-heading"
      >
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Questions</p>
          <h2
            id="botox-faq-heading"
            className="mb-10 text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Botox + Dysport FAQ
          </h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      {/* 11 Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-28 text-white md:py-36"
        aria-labelledby="botox-final-cta-heading"
      >
        <Image
          src="/images/clinic/napa-reception.webp"
          alt=""
          fill
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="botox-final-cta-heading"
            className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
          >
            Start with a conversation.
          </h2>
          <p className="mx-auto mt-6 max-w-[32rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Schedule a consultation to learn whether Botox or Dysport is appropriate for your
            goals — and leave with a clear next step.
          </p>
          <Link
            href={bookingHref}
            className="rella-cta-rect rella-cta-rect--filled mt-10"
            data-cta="service-booking"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
