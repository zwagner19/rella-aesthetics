import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { HOME_LOCATION_VISUALS } from "@/components/home/home-location-visuals";
import { approvedPatientResultImages } from "@/content/results";
import { leadershipMember } from "@/content/team";
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

/** Verified glance values only — labels per refinement brief. */
const glance = [
  { label: "Treatment", value: VISIT.durationCopy },
  { label: "Results begin", value: "Botox 4–7 days · Dysport 2–5 days" },
  { label: "Full effect", value: "Assessed around two weeks" },
  { label: "Typical duration", value: RESULTS.duration },
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

      {/* 01 Hero — editorial hierarchy, one CTA */}
      <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 md:px-8 md:pb-28 lg:px-12 lg:pb-32">
          <p className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            Injectables
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            Botox + Dysport
          </h1>
          <p className="mt-8 max-w-[28rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
            Thoughtful placement. Natural movement. A plan built around your face.
          </p>
          <Link
            href={bookingHref}
            className="rella-cta-rect rella-cta-rect--filled mt-12"
            data-cta="service-booking"
          >
            Book a consultation
          </Link>
        </div>
      </section>

      {/* 02 Editorial intro */}
      <section
        className="rella-site-reveal bg-ivory py-28 md:py-36"
        aria-labelledby="botox-intro-heading"
      >
        <div className="mx-auto max-w-[820px] px-6 md:px-8">
          <h2
            id="botox-intro-heading"
            className="text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink"
          >
            Movement is good. Looking rested is, too.
          </h2>
          <div className="rella-editorial-rule mt-12 mb-12 max-w-[4rem]" />
          <p className="max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.whatItIs.body}
          </p>
        </div>
      </section>

      {/* 03 At a glance — TREATMENT / RESULTS BEGIN / FULL EFFECT / TYPICAL DURATION */}
      <section
        className="rella-site-reveal bg-ivory pb-8 md:pb-12"
        aria-labelledby="botox-glance-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <h2 id="botox-glance-heading" className="sr-only">
            At a glance
          </h2>
          <dl className="grid border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
            {glance.map((item) => (
              <div
                key={item.label}
                className="border-rule px-0 py-9 sm:border-r sm:px-7 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <dt className="rella-editorial-eyebrow mb-4">{item.label}</dt>
                <dd className="text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-lg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 04 Treatment areas — editorial list + injectable image */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="botox-areas-heading"
      >
        <div className="mx-auto grid max-w-[1440px] items-start gap-14 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-6">Areas of focus</p>
            <h2
              id="botox-areas-heading"
              className="max-w-[14ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              What we can address
            </h2>
            <p className="mt-7 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
              {service.whoItsFor.body}
            </p>
            <ul className="mt-12 space-y-0 border-t border-rule">
              {areas.map((area) => (
                <li
                  key={area}
                  className="border-b border-rule py-5 text-[1.05rem] font-medium tracking-[-0.01em] text-ink md:text-xl"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden bg-oat lg:mt-10">
            <Image
              src="/images/treatments/dermal-fillers.webp"
              alt="A Rella provider performing a careful injectable treatment"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* 05 The Rella Approach */}
      <section
        className="rella-site-reveal bg-oat/35 py-24 md:py-32"
        aria-labelledby="botox-approach-heading"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12">
          <div>
            <p className="rella-editorial-eyebrow mb-6">The Rella approach</p>
            <h2
              id="botox-approach-heading"
              className="max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Your face isn&apos;t a formula.
            </h2>
            <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
              We don&apos;t treat trends. We treat you.
            </p>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Care starts with anatomy, movement, history, and goals — not more treatment. Your
              provider listens first, explains product and placement plainly, and chooses restraint
              when that is the better plan.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-oat">
            <Image
              src={leadershipMember.image}
              alt={`${leadershipMember.name}, ${leadershipMember.role}`}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* 06 Experience — 01 Consult → 04 Maintain */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="botox-experience-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Your visit</p>
          <h2
            id="botox-experience-heading"
            className="max-w-[16ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            How the experience unfolds
          </h2>
          <ol className="mt-16 space-y-0 border-t border-rule">
            {experience.map((step) => (
              <li
                key={step.number}
                className="grid gap-3 border-b border-rule py-10 md:grid-cols-[5rem_11rem_1fr] md:items-baseline md:gap-10"
              >
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
                  {step.number}
                </span>
                <span className="text-lg font-medium uppercase tracking-[0.14em] text-ink">
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

      {/* 07 Transform House — real Botox B/A only */}
      <section
        className="rella-site-reveal bg-charcoal py-20 text-white md:py-28"
        aria-labelledby="botox-results-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
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
              Approved before-and-after photography for Botox, shared with permission. Individual
              results vary.
            </p>
          </div>

          {results.length > 0 ? (
            <div
              className={`grid gap-5 ${results.length > 1 ? "md:grid-cols-2" : "md:max-w-xl md:grid-cols-1"}`}
            >
              {results.map((result) => (
                <figure key={result.id} className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <Image
                    src={result.src}
                    alt={result.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-6 text-sm text-white/90">
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

          <div className="mt-12">
            <Link href="/gallery" className="rella-cta-rect rella-cta-rect--ghost-light">
              Explore real results
            </Link>
          </div>
        </div>
      </section>

      {/* 08 Pricing — typographic elevation */}
      <section
        id="pricing"
        className="rella-site-reveal scroll-mt-28 bg-ivory py-28 md:py-36"
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

          <div className="mt-14 space-y-0 border-t border-rule">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule py-8">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
                Botox
              </span>
              <span className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink">
                {PRICING.botoxPerUnit}
                <span className="ml-1 text-base font-light tracking-normal text-silver">/unit</span>
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule py-8">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
                Dysport
              </span>
              <span className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink">
                {PRICING.dysportPerUnit}
                <span className="ml-1 text-base font-light tracking-normal text-silver">/unit</span>
              </span>
            </div>
          </div>

          <p className="mt-10 max-w-[40rem] text-base font-light leading-relaxed text-silver md:text-lg">
            The 2026 Tox Membership is {PRICING.membershipMonthly}/month with a{" "}
            {PRICING.membershipCommitment} commitment — members pay {PRICING.memberBotoxPerUnit}
            /unit for Botox and {PRICING.memberDysportPerUnit}/unit for Dysport.
          </p>
          <p className="mt-6 max-w-[40rem] text-sm font-light leading-relaxed text-silver">
            {service.pricing.note}
          </p>
          <p className="mt-4 max-w-[40rem] text-sm font-light leading-relaxed text-silver">
            Units are product-specific and not interchangeable.
          </p>
          <Link href="/membership" className="rella-cta-rect rella-cta-rect--ghost mt-12">
            Explore membership
          </Link>
        </div>
      </section>

      {/* 09 Locations */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="botox-locations-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <p className="rella-editorial-eyebrow mb-5">Two houses. One standard of care.</p>
          <h2
            id="botox-locations-heading"
            className="mb-6 max-w-[18ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Vacaville · Napa House
          </h2>
          <p className="mb-16 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Quiet rooms, familiar faces, and the same thoughtful consult wherever you book.
          </p>

          <div className="grid gap-16 lg:grid-cols-2 lg:gap-0">
            <article className="lg:border-r lg:border-rule lg:pr-12">
              <div className="relative mb-8 aspect-[4/5] overflow-hidden bg-oat">
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
                className="mt-7 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
                data-cta="service-booking"
                data-location="vacaville"
              >
                Book in Vacaville
              </Link>
            </article>

            <article className="lg:pl-12">
              <div className="relative mb-8 aspect-[4/5] overflow-hidden bg-oat">
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
                className="mt-7 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
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
            className="mb-12 text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Botox + Dysport FAQ
          </h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      {/* 11 Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
        aria-labelledby="botox-final-cta-heading"
      >
        <Image
          src="/images/clinic/napa-reception.webp"
          alt=""
          fill
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="botox-final-cta-heading"
            className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
          >
            Start with a conversation.
          </h2>
          <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book a consultation to learn whether Botox or Dysport is appropriate for your goals —
            and leave with a clear next step.
          </p>
          <Link
            href={bookingHref}
            className="rella-cta-rect rella-cta-rect--filled mt-12"
            data-cta="service-booking"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
