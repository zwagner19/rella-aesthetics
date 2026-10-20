import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { ClinicLocationPhoto } from "@/components/home/ClinicLocationPhoto";
import { HOME_LOCATION_VISUALS } from "@/components/home/home-location-visuals";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref } from "@/lib/booking-routes";
import { locations } from "@/lib/data";
import { servicePages } from "@/lib/service-data";

const service = servicePages.find((item) => item.slug === "dermal-fillers")!;

const bookingHref = resolveBookingHref({ service: "dermal-fillers" });
const vacavilleBookingHref = resolveBookingHref({
  location: "vacaville",
  service: "dermal-fillers",
});
const napaBookingHref = resolveBookingHref({
  location: "napa",
  service: "dermal-fillers",
});

/** Verified treatment-area framing from service-data — presentation only. */
const featuredAreas = [
  {
    title: "Lips",
    body: "Enhancement and definition shaped to the mouth you already have.",
  },
  {
    title: "Cheeks & midface",
    body: "Volume support where structure has softened — never a one-syringe default.",
  },
  {
    title: "Facial balancing",
    body: "Whole-face proportion when clinically appropriate — not one feature treated in isolation.",
  },
] as const;

const supportingAreas = [
  "Nasolabial folds",
  "Marionette lines",
] as const;

const visitSteps = [
  {
    title: "Consult",
    body: "Anatomy, history, goals, and product options — before anything is injected.",
  },
  {
    title: "Plan",
    body: "Comfort measures, product, and technique chosen for the proposed area.",
  },
  {
    title: "Treat",
    body: "Injection technique selected for the plan. Sensation varies by person and area.",
  },
  {
    title: "Settle",
    body: "Aftercare for swelling and tenderness, plus product-specific follow-up timing.",
  },
] as const;

/** Native pixel size of approved filler B/A JPEGs in /public (no larger source on disk). */
const FILLER_RESULT_NATIVE = { width: 1024, height: 1280 } as const;

function fillerResultImages() {
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /filler|lips|lip|under.?eye/i.test(result.treatment),
  );
}

export function DermalFillersServicePage() {
  const results = fillerResultImages();
  const [primaryResult, ...secondaryResults] = results;
  const vacavilleVisual = HOME_LOCATION_VISUALS.find((l) => l.slug === "vacaville")!;
  const napaVisual = HOME_LOCATION_VISUALS.find((l) => l.slug === "napa")!;

  return (
    <>
      <FaqSchema items={service.faq} />

      {/* 01 Hero — landscape editorial crop with breathing room */}
      <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src="/images/service-fillers.jpg"
          alt={service.imageAlt}
          fill
          priority
          className="object-cover object-[38%_42%] md:object-[32%_38%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/92 via-charcoal/45 to-charcoal/20"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 md:px-8 md:pb-28 lg:px-12 lg:pb-32">
          <p className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            {service.heroEyebrow}
          </p>
          <h1 className="max-w-[13ch] text-[clamp(2.5rem,6.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            {service.heroTitle}
          </h1>
          <p className="mt-8 max-w-[26rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
            {service.heroDescription}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <a
              href="#filler-areas"
              className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Explore areas
            </a>
          </div>
        </div>
      </section>

      {/* 02 Quiet type — one philosophy line */}
      <section
        className="rella-site-reveal bg-ivory py-28 md:py-36"
        aria-labelledby="filler-intro-heading"
      >
        <div className="mx-auto max-w-[820px] px-6 md:px-8">
          <h2
            id="filler-intro-heading"
            className="text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink"
          >
            More isn&apos;t the goal. Better balance is.
          </h2>
          <div className="rella-editorial-rule mt-12 mb-12 max-w-[4rem]" />
          <p className="max-w-[38rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.whatItIs.body}
          </p>
        </div>
      </section>

      {/* Treatment areas — typography-led editorial (no image, no numbering) */}
      <section
        id="filler-areas"
        className="rella-site-reveal scroll-mt-28 bg-ivory pb-24 md:pb-32"
        aria-labelledby="filler-areas-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[40rem] border-t border-rule pt-16 lg:pt-20">
            <p className="rella-editorial-eyebrow mb-6">Areas of focus</p>
            <h2
              id="filler-areas-heading"
              className="max-w-[12ch] text-[clamp(2.1rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
            >
              Lips. Cheeks. Balance.
            </h2>
            <p className="mt-8 max-w-[30rem] text-base font-light leading-relaxed text-silver md:text-lg">
              {service.whoItsFor.body}
            </p>
          </div>

          <div className="mt-16 grid gap-0 border-t border-rule lg:mt-24 lg:grid-cols-12">
            {featuredAreas.map((area, index) => (
              <article
                key={area.title}
                className={`border-b border-rule py-10 lg:border-b-0 lg:border-r lg:py-14 lg:pr-10 ${
                  index === 0
                    ? "lg:col-span-5 lg:pl-0"
                    : index === 1
                      ? "lg:col-span-4 lg:pl-10"
                      : "lg:col-span-3 lg:border-r-0 lg:pl-10 lg:pt-20"
                }`}
              >
                <h3
                  className={`font-medium tracking-[-0.02em] text-ink ${
                    index === 0
                      ? "text-[clamp(1.75rem,3vw,2.5rem)]"
                      : index === 1
                        ? "text-[clamp(1.45rem,2.4vw,2rem)]"
                        : "text-[clamp(1.25rem,2vw,1.65rem)]"
                  }`}
                >
                  {area.title}
                </h3>
                <p className="mt-5 max-w-[22rem] text-base font-light leading-relaxed text-silver">
                  {area.body}
                </p>
              </article>
            ))}
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3 border-t border-rule pt-8 lg:mt-0 lg:border-t-0 lg:pt-10">
            {supportingAreas.map((area) => (
              <li
                key={area}
                className="text-[0.95rem] font-medium tracking-[-0.01em] text-ink/80 md:text-lg"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 Education — quiet practical beat */}
      <section
        className="rella-site-reveal bg-oat/30 py-24 md:py-28"
        aria-labelledby="filler-education-heading"
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20 lg:px-12">
          <h2
            id="filler-education-heading"
            className="max-w-[12ch] text-[clamp(1.85rem,4vw,3rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Product follows the plan.
          </h2>
          <p className="max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.whatToExpect.body}
          </p>
        </div>
      </section>

      {/* 05 Approach — whole face, no founder portrait */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="filler-approach-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[40rem]">
            <p className="rella-editorial-eyebrow mb-6">Why at Rella?</p>
            <h2
              id="filler-approach-heading"
              className="max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
            >
              We treat the whole face.
            </h2>
            <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
              We don&apos;t treat trends. We treat you.
            </p>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Filler decisions start with anatomy, history, and the look you want to keep — not a
              syringe count. Your provider explains product, area, and amount plainly, and chooses
              restraint when that is the better plan.
            </p>
          </div>
        </div>
      </section>

      {/* 06 Transform House — attributed filler B/A as hero moment */}
      <section
        className="rella-site-reveal bg-charcoal py-20 text-white md:py-28"
        aria-labelledby="filler-results-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="mb-14 max-w-[40rem] lg:mb-20">
            <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-rose">
              The Transform House
            </p>
            <h2
              id="filler-results-heading"
              className="text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em]"
            >
              Honest proportions. Real patients.
            </h2>
            <p className="mt-7 max-w-[34rem] text-base font-light leading-relaxed text-white/75 md:text-lg">
              Approved before-and-after photography for filler treatments, shared with permission.
              Individual results vary.
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {primaryResult ? (
                <figure className="relative w-full max-w-[32rem] overflow-hidden bg-ink lg:col-span-7 lg:max-w-none lg:pr-4">
                  <Image
                    src={primaryResult.src}
                    alt={primaryResult.alt}
                    width={FILLER_RESULT_NATIVE.width}
                    height={FILLER_RESULT_NATIVE.height}
              unoptimized
                    className="h-auto w-full max-w-[32rem] object-contain"
                    sizes="(min-width: 1024px) 512px, min(100vw, 512px)"
                  />
                  <figcaption className="mt-5 text-sm text-white/90 md:mt-6">
                    <span className="text-base font-medium md:text-lg">
                      {primaryResult.treatment}
                    </span>
                    <span className="mt-2 block text-xs font-light text-white/65 md:text-sm">
                      {primaryResult.caption}
                    </span>
                  </figcaption>
                </figure>
              ) : null}
              {secondaryResults.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-10">
                  {secondaryResults.map((result) => (
                    <figure key={result.id} className="relative w-full max-w-[20rem] overflow-hidden bg-ink sm:max-w-none">
                      <Image
                        src={result.src}
                        alt={result.alt}
                        width={FILLER_RESULT_NATIVE.width}
                        height={FILLER_RESULT_NATIVE.height}
              unoptimized
                        className="h-auto w-full max-w-[20rem] object-contain lg:max-w-[18rem]"
                        sizes="(min-width: 1024px) 288px, (min-width: 640px) 320px, min(100vw, 320px)"
                      />
                      <figcaption className="mt-4 text-sm text-white/90">
                        <span className="font-medium">{result.treatment}</span>
                        <span className="mt-1 block text-xs font-light text-white/65">
                          {result.caption}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center border border-white/20 bg-white/5 px-8 py-16 text-center">
              <p className="max-w-md text-sm font-light leading-relaxed text-white/70">
                Layout reserved for verified filler before-and-after photography. Approved patient
                assets are required before this gallery can publish.
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

      {/* 07 Visit — tightened steps */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="filler-visit-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Your visit</p>
          <h2
            id="filler-visit-heading"
            className="max-w-[14ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Consult. Plan. Treat. Settle.
          </h2>
          <ol className="mt-14 space-y-0 border-t border-rule">
            {visitSteps.map((step) => (
              <li
                key={step.title}
                className="grid gap-2 border-b border-rule py-8 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-10"
              >
                <span className="text-base font-medium uppercase tracking-[0.14em] text-ink">
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

      {/* 08 Plan framing — no public filler prices */}
      <section
        id="plan"
        className="rella-site-reveal scroll-mt-28 border-t border-rule/50 bg-ivory py-28 md:py-36"
        aria-labelledby="filler-plan-heading"
      >
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Investment</p>
          <h2
            id="filler-plan-heading"
            className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            {service.pricing.heading}
          </h2>
          <p className="mt-10 max-w-[40rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {service.pricing.body}
          </p>
          {service.pricing.note ? (
            <p className="mt-6 max-w-[40rem] text-sm font-light leading-relaxed text-silver">
              {service.pricing.note}
            </p>
          ) : null}
          <Link
            href={bookingHref}
            className="rella-cta-rect rella-cta-rect--ghost mt-12"
            data-cta="service-booking"
          >
            Book a consultation
          </Link>
        </div>
      </section>

      {/* 09 Locations */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="filler-locations-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <p className="rella-editorial-eyebrow mb-5">Two houses. One standard of care.</p>
          <h2
            id="filler-locations-heading"
            className="mb-6 max-w-[18ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Vacaville · Napa House
          </h2>
          <p className="mb-16 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Quiet rooms, familiar faces, and the same thoughtful consult wherever you book.
          </p>

          <div className="grid gap-16 lg:grid-cols-2 lg:gap-0">
            <article className="lg:border-r lg:border-rule lg:pr-12">
              <ClinicLocationPhoto visual={vacavilleVisual} />
              <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink"><Link href="/vacaville/filler">Vacaville</Link></h3>
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
              <ClinicLocationPhoto visual={napaVisual} />
              <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink"><a href="/napa/filler/">Napa House</a></h3>
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
        aria-labelledby="filler-faq-heading"
      >
        <div className="mx-auto max-w-[1000px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Questions</p>
          <h2
            id="filler-faq-heading"
            className="mb-12 text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Dermal Fillers FAQ
          </h2>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      {/* 11 Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
        aria-labelledby="filler-final-cta-heading"
      >
        <Image
          src="/images/clinic/napa-reception.jpg"
          alt=""
          fill
          unoptimized
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="filler-final-cta-heading"
            className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
          >
            Start with the plan — not the syringe.
          </h2>
          <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book a consultation to learn whether dermal filler is appropriate for your goals — and
            leave with a clear next step.
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
