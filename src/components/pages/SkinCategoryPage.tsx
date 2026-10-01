import Image from "next/image";
import Link from "next/link";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { SkinConcernExplorer } from "@/components/skin/SkinConcernExplorer";
import { TreatmentResults } from "@/components/treatments/TreatmentResults";
import { approvedPatientResultImages } from "@/content/results";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  FACIALS_HREF,
  HYDRAFACIAL_HREF,
  LASERS_CATEGORY_HREF,
  SKIN_FAQ,
  SKIN_MAINTENANCE_VS_CORRECTION,
  SKIN_PATHS,
} from "@/lib/skin-category";

function skinResultImages() {
  // Match attributed skin treatments only — avoid bare CoolPeel / laser-only labels
  // that contain the substring "peel".
  return approvedPatientResultImages("main-gallery").filter((result) =>
    /hydrafacial|microneedling/i.test(result.treatment),
  );
}

export function SkinCategoryPage() {
  // Skin spans facials, peels, and microneedling choosers — open the booking
  // chooser without forcing a single subcategory.
  const bookingHref = resolveBookingHref({});
  const results = skinResultImages();

  return (
    <>
      <FaqSchema items={SKIN_FAQ} />

      {/* 01 Image-led hero */}
      <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src="/images/treatments/hydrafacial.webp"
          alt="A Rella provider using a facial-treatment handpiece on a patient's cheek"
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
            Skin
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            Good skin isn&apos;t one treatment.
          </h1>
          <p className="mt-8 max-w-[28rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
            Face the concern first. Choose the visit that matches it — maintenance or a deeper
            reset.
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
        aria-labelledby="skin-intro-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="skin-intro-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Your skin doesn&apos;t need everything.
          </h2>
          <div className="rella-editorial-rule mx-auto mt-12 mb-12 max-w-[4rem]" />
          <p className="text-base font-light leading-relaxed text-silver md:text-lg">
            It needs the right next step for the concern in front of you — hydration, congestion,
            pigment, texture, or simply a maintenance visit that respects timing and recovery.
          </p>
        </div>
      </section>

      {/* 03 Explore by concern */}
      <SkinConcernExplorer />

      {/* 04 Treatment paths */}
      <section
        className="rella-site-reveal border-t border-rule/50 bg-ivory py-24 md:py-32"
        aria-labelledby="skin-paths-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Treatment paths</p>
          <h2
            id="skin-paths-heading"
            className="max-w-[18ch] text-[clamp(1.85rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Maintenance visits. Deeper resets. Light when needed.
          </h2>
          <p className="mt-6 max-w-[36rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Each path links to real treatment details — or to Lasers when pigment and texture
            overlap with light-based care.
          </p>
          <ul className="mt-16 space-y-0 border-t border-rule">
            {SKIN_PATHS.map((path) => (
              <li
                key={path.id}
                className="grid gap-3 border-b border-rule py-10 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <Link
                  href={path.href}
                  className="text-lg font-medium tracking-[-0.015em] text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-rule"
                >
                  {path.name}
                </Link>
                <p className="text-base font-light leading-relaxed text-silver md:text-lg">
                  {path.job}
                </p>
                <Link
                  href={path.href}
                  className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink"
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 Maintenance vs correction */}
      <section
        className="rella-site-reveal bg-oat/35 py-24 md:py-32"
        aria-labelledby="skin-framing-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">
            {SKIN_MAINTENANCE_VS_CORRECTION.eyebrow}
          </p>
          <h2
            id="skin-framing-heading"
            className="max-w-[18ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            {SKIN_MAINTENANCE_VS_CORRECTION.headline}
          </h2>
          <p className="mt-8 text-base font-light leading-relaxed text-silver md:text-lg">
            {SKIN_MAINTENANCE_VS_CORRECTION.body}
          </p>
        </div>
      </section>

      {/* 06 Approach */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="skin-approach-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[40rem]">
            <p className="rella-editorial-eyebrow mb-6">The Rella approach</p>
            <h2
              id="skin-approach-heading"
              className="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Treat the skin you have today.
            </h2>
            <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
              Protocol follows assessment — not a stacked menu.
            </p>
            <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
              Sensitivities, recent procedures, home care, medications, sun, and event timing shape
              what is appropriate that day. We explain the visit plainly before anything begins.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href={HYDRAFACIAL_HREF}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
              >
                HydraFacial details
              </Link>
              <Link
                href={LASERS_CATEGORY_HREF}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline decoration-rule underline-offset-4"
              >
                Explore lasers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 07 Transform House */}
      <TreatmentResults
        id="skin-results-heading"
        heading="Real skin results. Shared with permission."
        body="Approved HydraFacial and microneedling photography from Rella patients — including combined plans where attributed. Individual results vary."
        results={results}
        assetNeededNote="ASSET NEEDED — approved skin before-and-after photography is required before this gallery can publish."
      />

      {/* 08 Start with the concern */}
      <section
        className="rella-site-reveal bg-ivory py-24 md:py-32"
        aria-labelledby="skin-reassure-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <h2
            id="skin-reassure-heading"
            className="text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Start with the concern — not the product name.
          </h2>
          <p className="mx-auto mt-8 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Bring dullness, congestion, pigment, texture, scarring, or a maintenance question. We
            map options in plain language, including when lasers belong in the plan.
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
        aria-labelledby="skin-faq-heading"
      >
        <div className="mx-auto max-w-[860px] px-6 md:px-8">
          <p className="rella-editorial-eyebrow mb-6">Questions</p>
          <h2
            id="skin-faq-heading"
            className="mb-10 max-w-[12ch] text-[clamp(1.85rem,4.2vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            Skin FAQ
          </h2>
          <FaqAccordion items={SKIN_FAQ} />
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
        aria-labelledby="skin-final-cta-heading"
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
            id="skin-final-cta-heading"
            className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
          >
            Better skin starts with a plan.
          </h2>
          <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
            Book in Vacaville or Napa — or open a treatment path when you already know which visit
            type to discuss.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled"
              data-cta="service-booking"
            >
              Book a consultation
            </Link>
            <Link href={FACIALS_HREF} className="rella-cta-rect rella-cta-rect--ghost-light">
              Facials
            </Link>
            <Link
              href={LASERS_CATEGORY_HREF}
              className="rella-cta-rect rella-cta-rect--ghost-light"
            >
              Lasers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
