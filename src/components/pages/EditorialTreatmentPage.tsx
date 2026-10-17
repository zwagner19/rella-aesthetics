import { FaqSchema } from "@/components/blocks/FaqAccordion";
import { TreatmentApproach } from "@/components/treatments/TreatmentApproach";
import { TreatmentExperience } from "@/components/treatments/TreatmentExperience";
import { TreatmentFaq } from "@/components/treatments/TreatmentFaq";
import { TreatmentFinalCta } from "@/components/treatments/TreatmentFinalCta";
import { TreatmentFocus } from "@/components/treatments/TreatmentFocus";
import { TreatmentGlance } from "@/components/treatments/TreatmentGlance";
import { TreatmentHero } from "@/components/treatments/TreatmentHero";
import { TreatmentIntro } from "@/components/treatments/TreatmentIntro";
import { TreatmentLocations } from "@/components/treatments/TreatmentLocations";
import { TreatmentPricing } from "@/components/treatments/TreatmentPricing";
import { TreatmentResults } from "@/components/treatments/TreatmentResults";
import {
  type BookingLocation,
  resolveBookingHref,
} from "@/lib/booking-routes";
import type { ServicePageData } from "@/lib/service-data";
import {
  matchingTreatmentResults,
  resolveTreatmentLocations,
  type TreatmentEditorialConfig,
} from "@/lib/treatment-editorial";

const RELLA_PHONE_HREF = "tel:+17073582928";

interface EditorialTreatmentPageProps {
  service: ServicePageData;
  editorial: TreatmentEditorialConfig;
}

export function EditorialTreatmentPage({
  service,
  editorial,
}: EditorialTreatmentPageProps) {
  const availableLocations = resolveTreatmentLocations(service);
  const soleLocation =
    availableLocations.length === 1 ? availableLocations[0] : undefined;
  const callAssisted = Boolean(editorial.callAssisted);
  const ctaKind = callAssisted ? "phone" : "service-booking";
  const primaryHref = callAssisted
    ? RELLA_PHONE_HREF
    : resolveBookingHref({
        location: soleLocation,
        service: service.slug,
      });
  const primaryLabel = callAssisted
    ? "Call About IV Hydration"
    : "Book a consultation";

  const results = matchingTreatmentResults(editorial.resultMatch);
  const showResultsSection = Boolean(editorial.resultsHeading);
  const imageFirst =
    editorial.architecture === "device" || editorial.architecture === "wellness";
  const showMembershipLink = editorial.architecture === "injectable";

  const bookingHrefFor = (location: BookingLocation) =>
    resolveBookingHref({ location, service: service.slug });

  const prefix = service.slug;

  return (
    <>
      <FaqSchema items={service.faq} />

      <TreatmentHero
        eyebrow={service.heroEyebrow}
        title={service.heroTitle}
        feelLine={editorial.heroFeelLine}
        image={service.image}
        imageAlt={service.imageAlt}
        ctaHref={primaryHref}
        ctaLabel={primaryLabel}
        ctaKind={ctaKind}
      />

      <TreatmentIntro
        id={`${prefix}-intro-heading`}
        headline={editorial.introHeadline}
        body={service.whatItIs.body}
      />

      <TreatmentGlance
        id={`${prefix}-glance-heading`}
        items={editorial.glance}
      />

      <TreatmentFocus
        id={`${prefix}-focus-heading`}
        eyebrow={editorial.focusEyebrow}
        heading={editorial.focusHeading}
        body={service.whoItsFor.body}
        items={service.whoItsFor.bullets}
        image={editorial.focusImage}
        imageAlt={editorial.focusImageAlt}
        imageFirst={imageFirst}
      />

      <TreatmentApproach
        id={`${prefix}-approach-heading`}
        headline={editorial.approachHeadline}
        lead={editorial.approachLead}
        body={editorial.approachBody}
      />

      <TreatmentExperience
        id={`${prefix}-experience-heading`}
        heading={editorial.experienceHeading}
        steps={editorial.experienceSteps}
      />

      {showResultsSection && editorial.resultsHeading && editorial.resultsBody ? (
        <TreatmentResults
          id={`${prefix}-results-heading`}
          heading={editorial.resultsHeading}
          body={editorial.resultsBody}
          results={results}
          assetNeededNote={`Layout reserved for verified ${service.title} before-and-after photography. ASSET NEEDED — approved patient assets are required before this gallery can publish.`}
        />
      ) : null}

      <TreatmentPricing
        id={`${prefix}-pricing-heading`}
        body={service.pricing.body}
        note={service.pricing.note}
        rows={editorial.pricingRows}
        showMembershipLink={showMembershipLink}
      />

      <TreatmentLocations
        id={`${prefix}-locations-heading`}
        availableLocations={availableLocations}
        bookingHrefFor={bookingHrefFor}
        callAssisted={callAssisted}
        phoneHref={RELLA_PHONE_HREF}
      />

      <TreatmentFaq
        id={`${prefix}-faq-heading`}
        title={`${service.title} FAQ`}
        items={service.faq}
      />

      <TreatmentFinalCta
        id={`${prefix}-final-cta-heading`}
        body={editorial.finalCtaBody}
        ctaHref={primaryHref}
        ctaLabel={primaryLabel}
        ctaKind={ctaKind}
      />
    </>
  );
}
