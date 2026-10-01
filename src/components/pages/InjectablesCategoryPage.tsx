import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { InjectablesGoalExplorer } from "@/components/injectables/InjectablesGoalExplorer";
import { TreatmentResults } from "@/components/treatments/TreatmentResults";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  BOTOX_HREF,
  FILLERS_HREF,
  INJECTABLES_FAQ,
  INJECTABLES_TOOLS,
} from "@/lib/injectables-category";

function injectableResultImages() {
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /botox|filler|lips|lip|under.?eye/i.test(result.treatment),
  );
}

export function InjectablesCategoryPage() {
  const bookingHref = resolveBookingHref({ category: "injectables" });
  const results = injectableResultImages();

  return (
    <>
      <FaqSchema items={INJECTABLES_FAQ} />

      {/* 01 Image-led hero */}
      <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src="/images/treatments/botox-dysport.webp"
          alt="A Rella Aesthetics team member holding Botox and Dysport vials"
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
          <h1 className="max-w-[14ch] text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            Start with the face. Not the syringe.
          </h1>
          <p className="mt-8 max-w-[28rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
            Soften what moves. Support what needs volume. Leave the rest alone.
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
              href="#explore-by-goal"
              className="rella-cta-rect rella-cta-rect--ghost-light"
            >
              Explore by goal
            </a>
          </div>
        </div>
      </section>

      {/* 02 Quiet intro */}
      <section
        className="rella-site-reveal bg-ivory py-28 md:py-36"
        aria-labelledby="injectables-intro-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="injectables-intro-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Not every line needs treating.
          </h2>
          <div className="rella-editorial-rule mx-auto mt-12 mb-12 max-w-[4rem]" />
          <p className="text-base font-light leading-relaxed text-silver md:text-lg">
            Some lines are expression. Some volume tells your story. Injectables at Rella start
            with what you want to keep — then name the options that fit your anatomy, history, and
            goals.
          </p>
        </div>
      </section>

      {/* 03 Explore by goal */}
      <InjectablesGoalExplorer />

      {/* 04 Different tools / intentions */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="injectables-tools-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Different tools</p>
          <h2
            id="injectables-tools-heading"
            className="max-w-[18ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Different intentions. Different products.
          </h2>
          <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Neuromodulators and fillers solve different problems. Read the details — then decide in
            consult.
          </p>
          <ul className="mt-16 space-y-0 border-t border-rule">
            {INJECTABLES_TOOLS.map((tool) => (
              <li
                key={tool.id}
                className="grid gap-3 border-b border-rule py-10 md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-10"
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

      {/* 05 Approach */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="injectables-approach-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[40rem]">
            <p className="rella-editorial-eyebrow mb-6">The Rella approach</p>
            <h2
              id="injectables-approach-heading"
              className="max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Your face isn&apos;t a formula.
            </h2>
            <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
              Restraint is part of the plan.
            </p>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Anatomy, movement, history, and the look you want to keep shape the recommendation —
              not a syringe count. We explain product, area, and amount plainly, and choose less
              when that is the better next step.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href={BOTOX_HREF}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
              >
                Botox &amp; Dysport details
              </Link>
              <Link
                href={FILLERS_HREF}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
              >
                Filler details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 06 Transform House */}
      <TreatmentResults
        id="injectables-results-heading"
        heading="Real injectable results. Shared with permission."
        body="Approved Botox and filler before-and-after photography from Rella patients. Individual results vary — your plan is built in consult."
        results={results}
        assetNeededNote="ASSET NEEDED — approved injectable before-and-after photography is required before this gallery can publish."
      />

      {/* 07 You don't need to choose the syringe */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="injectables-reassure-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="injectables-reassure-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            You don&apos;t need to choose the syringe.
          </h2>
          <p className="mx-auto mt-8 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Bring the goal — softer movement, more support, lips, contour, or simply clarity. We
            translate that into options in plain language.
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

      {/* 08 Category FAQ */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-28"
        aria-labelledby="injectables-faq-heading"
      >
        <div className="mx-auto max-w-[860px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Questions</p>
          <h2
            id="injectables-faq-heading"
            className="mb-10 max-w-[16ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Injectables FAQ
          </h2>
          <FaqAccordion items={INJECTABLES_FAQ} />
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
        aria-labelledby="injectables-final-cta-heading"
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
            id="injectables-final-cta-heading"
            className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
          >
            Start with what you want to keep.
          </h2>
          <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book an injectables consultation in Vacaville or Napa — or open treatment details when
            you already know which conversation you want.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <Link href={BOTOX_HREF} className="rella-cta-rect rella-cta-rect--ghost-light">
              Botox &amp; Dysport
            </Link>
            <Link href={FILLERS_HREF} className="rella-cta-rect rella-cta-rect--ghost-light">
              Fillers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
