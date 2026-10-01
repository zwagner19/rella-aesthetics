import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { LasersConcernExplorer } from "@/components/lasers/LasersConcernExplorer";
import { TreatmentResults } from "@/components/treatments/TreatmentResults";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  LASERS_DETAIL_HREF,
  LASERS_DOWNTIME,
  LASERS_FAQ,
  LASERS_TOOLS,
} from "@/lib/lasers-category";

function laserResultImages() {
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /coolpeel|laser|ipl/i.test(result.treatment),
  );
}

export function LasersCategoryPage() {
  const bookingHref = resolveBookingHref({ category: "laser" });
  const results = laserResultImages();

  return (
    <>
      <FaqSchema items={LASERS_FAQ} />

      {/* 01 Image-led hero */}
      <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src="/images/treatments/laser-treatment.webp"
          alt="A Rella provider performing a device-based skin treatment"
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
            Lasers
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            Your skin tells us where to start.
          </h1>
          <p className="mt-8 max-w-[28rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
            Light and energy matched to your concern — after we meet the skin, not before.
          </p>
          <div className="mt-12 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <a
              href="#explore-by-concern"
              className="rella-cta-rect rella-cta-rect--ghost-light"
            >
              Explore by concern
            </a>
          </div>
        </div>
      </section>

      {/* 02 Quiet intro */}
      <section
        className="rella-site-reveal bg-ivory py-28 md:py-36"
        aria-labelledby="lasers-intro-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="lasers-intro-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            The machine isn&apos;t the treatment plan. Your skin is.
          </h2>
          <div className="rella-editorial-rule mx-auto mt-12 mb-12 max-w-[4rem]" />
          <p className="text-base font-light leading-relaxed text-silver md:text-lg">
            IPL, hair removal, vein care, Erbium, and CO2 CoolPeel are different tools. The right
            one depends on what we see — skin type, history, medications, recent sun, and the
            recovery you can plan for.
          </p>
        </div>
      </section>

      {/* 03 Explore by concern */}
      <LasersConcernExplorer />

      {/* 04 Different tools / different jobs */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="lasers-tools-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Modalities</p>
          <h2
            id="lasers-tools-heading"
            className="max-w-[16ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Different tools. Different jobs.
          </h2>
          <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Each row links to Rella&apos;s laser treatment detail page — modality-specific detail
            routes are not separate yet.
          </p>
          <ul className="mt-16 space-y-0 border-t border-rule">
            {LASERS_TOOLS.map((tool) => (
              <li
                key={tool.id}
                className="grid gap-3 border-b border-rule py-10 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <Link
                  href={tool.href}
                  className="text-lg font-medium tracking-[-0.015em] text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-rule"
                >
                  {tool.name}
                </Link>
                <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                  {tool.job}
                </p>
                <Link
                  href={tool.href}
                  className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink"
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 Downtime education */}
      <section
        className="rella-site-reveal bg-oat/35 py-24 md:py-32"
        aria-labelledby="lasers-downtime-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">{LASERS_DOWNTIME.eyebrow}</p>
          <h2
            id="lasers-downtime-heading"
            className="max-w-[18ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            {LASERS_DOWNTIME.headline}
          </h2>
          <p className="mt-8 text-base font-light leading-relaxed text-silver md:text-lg">
            {LASERS_DOWNTIME.body}
          </p>
        </div>
      </section>

      {/* 06 Rella Approach — category level */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="lasers-approach-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[40rem]">
            <p className="rella-editorial-eyebrow mb-6">The Rella approach</p>
            <h2
              id="lasers-approach-heading"
              className="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
            >
              We choose the treatment after we meet the skin.
            </h2>
            <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
              Settings follow assessment — not the other way around.
            </p>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Skin type, medications, recent sun, event timing, and the recovery you can support
              shape the recommendation. Restraint is part of the plan when a laser is not the right
              next step.
            </p>
            <Link
              href={LASERS_DETAIL_HREF}
              className="mt-10 inline-block text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
            >
              Read laser treatment details
            </Link>
          </div>
        </div>
      </section>

      {/* 07 Transform House — real laser B/A only */}
      <TreatmentResults
        id="lasers-results-heading"
        heading="Real laser results. Shared with permission."
        body="Approved CoolPeel and related laser before-and-after photography from Rella patients. Individual results vary — your plan is built in consult."
        results={results}
        assetNeededNote="ASSET NEEDED — approved laser before-and-after photography is required before this gallery can publish."
      />

      {/* 08 You don't need to know */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="lasers-reassure-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="lasers-reassure-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            You don&apos;t need to know the device name.
          </h2>
          <p className="mx-auto mt-8 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Bring the concern. We&apos;ll explain the options in plain language — including
            recovery — and only recommend what fits.
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

      {/* 09 Category FAQ */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-28"
        aria-labelledby="lasers-faq-heading"
      >
        <div className="mx-auto max-w-[860px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Questions</p>
          <h2
            id="lasers-faq-heading"
            className="mb-10 max-w-[14ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Lasers FAQ
          </h2>
          <FaqAccordion items={LASERS_FAQ} />
        </div>
      </section>

      {/* 10 Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
        aria-labelledby="lasers-final-cta-heading"
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
            id="lasers-final-cta-heading"
            className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
          >
            Start with your skin. We&apos;ll figure out the rest.
          </h2>
          <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book a laser consultation in Vacaville or Napa — or explore treatment details when you
            already know which modality you want to discuss.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <Link
              href={LASERS_DETAIL_HREF}
              className="rella-cta-rect rella-cta-rect--ghost-light"
            >
              Laser treatment details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
