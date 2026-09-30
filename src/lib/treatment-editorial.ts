import type { PatientResultImage } from "@/content/results";
import { approvedPatientResultImages } from "@/content/results";
import type { BookingLocation } from "@/lib/booking-routes";
import type { ServicePageData } from "@/lib/service-data";
import { servicePages } from "@/lib/service-data";

export type TreatmentArchitecture =
  | "injectable"
  | "skin"
  | "device"
  | "wellness";

export interface TreatmentGlanceItem {
  label: string;
  value: string;
}

export interface TreatmentExperienceStep {
  number: string;
  title: string;
  body: string;
}

export interface TreatmentPricingRow {
  label: string;
  amount: string;
  unit?: string;
}

export interface TreatmentEditorialConfig {
  slug: string;
  architecture: TreatmentArchitecture;
  heroFeelLine: string;
  introHeadline: string;
  focusEyebrow: string;
  focusHeading: string;
  approachHeadline: string;
  approachLead: string;
  approachBody: string;
  experienceHeading: string;
  experienceSteps: readonly TreatmentExperienceStep[];
  glance: readonly TreatmentGlanceItem[];
  /** Secondary still for the focus/split section — real treatment imagery only. */
  focusImage: string;
  focusImageAlt: string;
  pricingRows?: readonly TreatmentPricingRow[];
  resultsHeading?: string;
  resultsBody?: string;
  resultMatch?: RegExp;
  finalCtaBody: string;
  callAssisted?: boolean;
}

const RELLA_APPROACH_LEAD = "We don't treat trends. We treat you.";

function requireService(slug: string): ServicePageData {
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Missing service-data entry for ${slug}`);
  }
  return service;
}

/**
 * Editorial overlays for individual treatment pages.
 * Medical/pricing facts stay in service-data; this layer is presentation + brand voice only.
 */
export const treatmentEditorialBySlug: Readonly<
  Record<string, TreatmentEditorialConfig>
> = {
  "dermal-fillers": {
    slug: "dermal-fillers",
    architecture: "injectable",
    heroFeelLine:
      "Subtle volume. Honest proportions. A plan shaped to your face.",
    introHeadline: "More volume isn't the goal. Better balance is.",
    focusEyebrow: "Areas of focus",
    focusHeading: "What we can address",
    approachHeadline: "Your face isn't a template.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "Filler decisions start with anatomy, history, and the look you want to keep — not a syringe count. Your provider explains product, area, and amount plainly, and chooses restraint when that is the better plan.",
    experienceHeading: "How the experience unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Consult",
        body: "A review of facial anatomy, health history, goals, and product options before anything is injected.",
      },
      {
        number: "02",
        title: "Plan",
        body: "Comfort measures, product selection, and technique chosen for the proposed area and your individual needs.",
      },
      {
        number: "03",
        title: "Treat",
        body: "Injection technique selected for the plan. Sensation varies by person, product, and area.",
      },
      {
        number: "04",
        title: "Settle",
        body: "Aftercare for possible swelling, bruising, and tenderness — plus product-specific expectations for follow-up and duration.",
      },
    ],
    glance: [
      { label: "Treatment", value: "Consultation-led injectables" },
      { label: "Focus", value: "Volume, contour, and lips" },
      { label: "Settling", value: "Product- and area-specific" },
      { label: "Duration", value: "Varies by product and plan" },
    ],
    focusImage: "/images/treatments/dermal-fillers.webp",
    focusImageAlt: "A provider performing an injectable treatment near a patient's lips",
    pricingRows: [
      { label: "Base service", amount: "$840" },
      { label: "Product range", amount: "$540–$960" },
    ],
    resultsHeading: "Real results, honest proportions.",
    resultsBody:
      "Approved before-and-after photography for filler treatments, shared with permission. Individual results vary.",
    resultMatch: /filler|lips|lip|under.?eye/i,
    finalCtaBody:
      "Book a consultation to learn whether dermal filler is appropriate for your goals — and leave with a clear next step.",
  },
  "chemical-peels": {
    slug: "chemical-peels",
    architecture: "skin",
    heroFeelLine:
      "A clearer surface starts with the right peel for your skin.",
    introHeadline: "Exfoliation with a plan.",
    focusEyebrow: "Skin concerns",
    focusHeading: "What peels can support",
    approachHeadline: "We read your skin before we treat it.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "Peel selection follows assessment — your skin, recent treatments, and expected recovery — not a one-depth-fits-all menu. Universal Peel is currently listed for Vacaville online booking; ask the team about other formulations.",
    experienceHeading: "How the visit unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Assess",
        body: "Skin analysis and peel selection based on your concerns and expected recovery.",
      },
      {
        number: "02",
        title: "Prep",
        body: "Gentle cleansing and preparation of the treatment area.",
      },
      {
        number: "03",
        title: "Treat",
        body: "Application of the selected peel with comfort and skin response monitored.",
      },
      {
        number: "04",
        title: "Recover",
        body: "Neutralization, soothing care, and product-specific aftercare before you leave.",
      },
    ],
    glance: [
      { label: "Location", value: "Vacaville online booking" },
      { label: "Listed option", value: "Universal Peel" },
      { label: "Downtime", value: "Varies by product and response" },
      { label: "Plan", value: "Single treatment or series" },
    ],
    focusImage: "/images/treatments/chemical-peel.webp",
    focusImageAlt: "A Rella provider applying an in-clinic facial treatment",
    finalCtaBody:
      "Book in Vacaville to review whether a peel is appropriate for your skin and goals.",
  },
  facials: {
    slug: "facials",
    architecture: "skin",
    heroFeelLine:
      "Assessment first. Products second. Skin that feels cared for.",
    introHeadline: "Your skin sets the agenda.",
    focusEyebrow: "Skin care goals",
    focusHeading: "What a facial can support",
    approachHeadline: "Protocol follows your skin — not the other way around.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "A professional facial starts with what your skin needs that day: sensitivities, recent procedures, home care, and timing around events. Your provider explains the exact protocol before treatment.",
    experienceHeading: "How the experience unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Review",
        body: "A conversation about your skin, concerns, sensitivities, products, and recent treatments.",
      },
      {
        number: "02",
        title: "Cleanse",
        body: "Cleansing and exfoliation selected for the service and your skin.",
      },
      {
        number: "03",
        title: "Treat",
        body: "Targeted products or extractions steps only when included and appropriate.",
      },
      {
        number: "04",
        title: "Finish",
        body: "Finishing products, sun-care guidance, and timing for active products or other services.",
      },
    ],
    glance: [
      { label: "Treatment", value: "Provider-guided facial" },
      { label: "Focus", value: "Assessment before products" },
      { label: "Timing", value: "Depends on selected service" },
      { label: "Locations", value: "Vacaville and Napa" },
    ],
    focusImage: "/images/treatments/facial.webp",
    focusImageAlt: "A patient receiving red-light therapy during a facial",
    finalCtaBody:
      "Schedule a facial consultation to choose the service that fits your skin and timing.",
  },
  hydrafacial: {
    slug: "hydrafacial",
    architecture: "skin",
    heroFeelLine:
      "Cleanse, extract, and hydrate — in one considered appointment.",
    introHeadline: "A multi-step facial with a clear purpose.",
    focusEyebrow: "Who it's for",
    focusHeading: "Goals HydraFacial can support",
    approachHeadline: "Tier and booster follow your skin that day.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "Signature, Deluxe, and Platinum are distinct tiers — not upgrades for their own sake. Your provider confirms the tier and any booster against your skin, sensitivities, and recent treatments before you begin.",
    experienceHeading: "How the experience unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Review",
        body: "Skin, sensitivities, recent procedures, home care, and goals — before a tier is chosen.",
      },
      {
        number: "02",
        title: "Cleanse",
        body: "Cleanse and exfoliate using the products included in the selected tier.",
      },
      {
        number: "03",
        title: "Extract",
        body: "Extract and hydrate with the HydraFacial handpiece and solutions.",
      },
      {
        number: "04",
        title: "Finish",
        body: "Add a booster only when included and appropriate, then review aftercare and event timing.",
      },
    ],
    glance: [
      { label: "Signature / Deluxe", value: "Listed at 45 minutes" },
      { label: "Platinum", value: "Listed at 75 minutes" },
      { label: "Tiers", value: "Signature · Deluxe · Platinum" },
      { label: "Recovery", value: "Temporary flushing possible" },
    ],
    focusImage: "/images/treatments/hydrafacial.webp",
    focusImageAlt:
      "A Rella provider using a facial-treatment handpiece on a patient's cheek",
    pricingRows: [
      { label: "Signature", amount: "$240" },
      { label: "Deluxe", amount: "$300" },
      { label: "Platinum", amount: "$390" },
    ],
    resultsHeading: "Real skin, real HydraFacial results.",
    resultsBody:
      "Approved before-and-after photography for HydraFacial, shared with permission. Individual results vary.",
    resultMatch: /hydrafacial/i,
    finalCtaBody:
      "Book a HydraFacial to choose the tier that fits your skin and schedule.",
  },
  microneedling: {
    slug: "microneedling",
    architecture: "device",
    heroFeelLine:
      "Controlled care for texture, planned around your recovery.",
    introHeadline: "Texture takes intention.",
    focusEyebrow: "Treatment focus",
    focusHeading: "What microneedling may address",
    approachHeadline: "Depth without a reason is just trauma.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "Device, depth, area, and the number of procedures require an individual plan. Candidacy comes first — medications, sun exposure, prior procedures, and realistic expectations included.",
    experienceHeading: "How the visit unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Screen",
        body: "Review of skin, health history, medications, recent procedures, and sun exposure.",
      },
      {
        number: "02",
        title: "Prep",
        body: "Cleansing and a comfort plan, which may include topical numbing when appropriate.",
      },
      {
        number: "03",
        title: "Treat",
        body: "Treatment with settings selected for the device, area, and plan.",
      },
      {
        number: "04",
        title: "Recover",
        body: "Aftercare for sun, makeup, and products — plus review of possible redness, tightness, or other risks.",
      },
    ],
    glance: [
      { label: "Location", value: "Vacaville" },
      { label: "Treatment", value: "Controlled microchannels" },
      { label: "Plan", value: "Device, depth, and area specific" },
      { label: "Recovery", value: "Redness and sensitivity possible" },
    ],
    focusImage: "/images/treatments/microneedling-aftercare.webp",
    focusImageAlt: "A patient checking her skin in a mirror after treatment",
    resultsHeading: "Real results, planned recovery.",
    resultsBody:
      "Approved photography that includes microneedling, shared with permission. Individual results vary.",
    resultMatch: /microneedling/i,
    finalCtaBody:
      "Book in Vacaville to learn whether microneedling is appropriate for your skin and goals.",
  },
  "iv-hydration": {
    slug: "iv-hydration",
    architecture: "wellness",
    heroFeelLine:
      "Fluids and ingredients, chosen after screening — not from a menu alone.",
    introHeadline: "Hydration with clinical judgment.",
    focusEyebrow: "Before we begin",
    focusHeading: "What screening considers",
    approachHeadline: "Suitability comes before the drip.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "IV hydration is clinician-guided. Formulation and frequency depend on your history, goals, current symptoms, and screening — administered by licensed medical professionals in a monitored setting.",
    experienceHeading: "How the visit unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Screen",
        body: "Brief health screening and IV formula selection based on what is appropriate for you.",
      },
      {
        number: "02",
        title: "Access",
        body: "Placement of a small IV catheter, with sensation and comfort varying by person.",
      },
      {
        number: "03",
        title: "Infuse",
        body: "Monitored infusion over the time appropriate for the selected formula.",
      },
      {
        number: "04",
        title: "Follow-up",
        body: "Post-infusion guidance and instructions before you leave.",
      },
    ],
    glance: [
      { label: "Treatment", value: "Clinician-guided IV" },
      { label: "Screening", value: "Required before treatment" },
      { label: "Delivery", value: "Monitored infusion" },
      { label: "Booking", value: "Call-assisted" },
    ],
    focusImage: "/images/treatments/iv-hydration.webp",
    focusImageAlt: "A Rella-branded IV hydration bag prepared in the clinic",
    callAssisted: true,
    finalCtaBody:
      "Call Rella, name your preferred clinic, and ask about IV hydration availability and next steps.",
  },
  "laser-treatments": {
    slug: "laser-treatments",
    architecture: "device",
    heroFeelLine:
      "Light and energy, matched to your skin, goals, and recovery.",
    introHeadline: "The device is only half the decision.",
    focusEyebrow: "Modalities",
    focusHeading: "What we can plan",
    approachHeadline: "Settings follow assessment — not the other way around.",
    approachLead: RELLA_APPROACH_LEAD,
    approachBody:
      "IPL, laser hair removal, spider-vein care, Erbium resurfacing, and CO2 CoolPeel are different tools with different recovery profiles. Skin type, medications, recent sun, and event timing shape the recommendation.",
    experienceHeading: "How the experience unfolds",
    experienceSteps: [
      {
        number: "01",
        title: "Assess",
        body: "Review of skin, treatment area, goals, medications, recent sun, and event timing.",
      },
      {
        number: "02",
        title: "Prep",
        body: "Skin preparation and protective eyewear for the selected procedure.",
      },
      {
        number: "03",
        title: "Treat",
        body: "Device-specific settings, with sensation varying by procedure and person.",
      },
      {
        number: "04",
        title: "Recover",
        body: "Procedure-specific aftercare, sun guidance, and review of material risks.",
      },
    ],
    glance: [
      { label: "Modalities", value: "IPL · LHR · veins · Erbium · CoolPeel" },
      { label: "Assessment", value: "Skin type and history first" },
      { label: "Recovery", value: "Varies substantially by modality" },
      { label: "Plan", value: "Area, device, and settings specific" },
    ],
    focusImage: "/images/treatments/laser-treatment.webp",
    focusImageAlt: "A Rella provider performing a device-based skin treatment",
    pricingRows: [
      { label: "IPL Full Face", amount: "$420" },
      { label: "CO2 CoolPeel Full Face", amount: "$1,440" },
    ],
    resultsHeading: "Real results from light-based care.",
    resultsBody:
      "Approved before-and-after photography for CoolPeel and related laser care, shared with permission. Individual results vary.",
    resultMatch: /coolpeel|laser|ipl/i,
    finalCtaBody:
      "Book a consultation to learn which laser or light-based option fits your skin and goals.",
  },
};

export function getTreatmentEditorial(
  slug: string,
): TreatmentEditorialConfig | undefined {
  return treatmentEditorialBySlug[slug];
}

export function getEditorialService(slug: string): ServicePageData {
  return requireService(slug);
}

export function resolveTreatmentLocations(
  service: ServicePageData,
): readonly BookingLocation[] {
  return service.availableLocations ?? (["vacaville", "napa"] as const);
}

export function matchingTreatmentResults(
  pattern: RegExp | undefined,
): readonly PatientResultImage[] {
  if (!pattern) return [];
  return approvedPatientResultImages("main-gallery").filter((result) =>
    pattern.test(result.treatment),
  );
}

export const EDITORIAL_TREATMENT_SLUGS = Object.keys(
  treatmentEditorialBySlug,
) as readonly string[];
