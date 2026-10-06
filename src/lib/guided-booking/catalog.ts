/**
 * Fail-closed public catalog for the in-site guided booking shell.
 *
 * Source: verified enabled aesthetics entries in `rella-booking`
 * `src/lib/booking-v2/catalog.ts` (NONPAID_PUBLIC / owner-approved). This module
 * NEVER embeds Boulevard URNs, invents service IDs, or invents prices. Deposit
 * cents and durations appear only when already verified in that catalog.
 *
 * Unknown location/service mappings refuse — there is no fall-through menu.
 */

import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";
import type {
  GuidedLocation,
  GuidedTreatment,
  PaymentRuleCopy,
} from "./types";

export const GUIDED_LOCATIONS: readonly GuidedLocation[] = [
  {
    slug: "napa",
    displayName: "Rella Aesthetics Napa",
    streetShort: "1541 3rd St",
    addressLine: "1541 3rd St · Downtown Napa",
    phoneDisplay: "707.358.2928",
    phoneHref: "tel:+17073582928",
  },
  {
    slug: "vacaville",
    displayName: "Rella Aesthetics Vacaville",
    streetShort: "542 Main St",
    addressLine: "542 Main St · Vacaville",
    phoneDisplay: "707.358.2928",
    phoneHref: "tel:+17073582928",
  },
] as const;

type CatalogSeed = {
  locationSlug: BookingLocation;
  serviceSlug: string;
  displayName: string;
  category: BookingCategory | "consults";
  shortDescription: string;
  durationCopy?: string;
  depositCents?: number;
  paymentRule: PaymentRuleCopy;
  isConsultation: boolean;
  image?: string;
  imageAlt?: string;
  prepCopy?: string;
  downtimeCopy?: string;
};

/**
 * Public bookable aesthetics rows only. Weight-loss stays on its dedicated host.
 * IV hydration is intentionally absent (call-assisted).
 */
const SEEDS: readonly CatalogSeed[] = [
  {
    locationSlug: "napa",
    serviceSlug: "botox",
    displayName: "New Patient Tox",
    category: "injectables",
    shortDescription:
      "Your first tox visit includes a consultation to tailor neuromodulator treatment.",
    durationCopy: "30 min.",
    depositCents: 5000,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "Botox and Dysport vials",
    prepCopy:
      "Arrive with a clean face when possible. Share medications, allergies, and prior injectable history during your consultation.",
    downtimeCopy:
      "Most people return to normal activities the same day. Temporary redness or small marks can occur at injection sites.",
  },
  {
    locationSlug: "napa",
    serviceSlug: "tox-established",
    displayName: "Established Patient Tox",
    category: "injectables",
    shortDescription: "A focused tox visit for established Rella patients.",
    durationCopy: "20–30 min.",
    depositCents: 5000,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "Botox and Dysport vials",
  },
  {
    locationSlug: "napa",
    serviceSlug: "dermal-fillers",
    displayName: "Dermal Fillers",
    category: "injectables",
    shortDescription:
      "A personalized filler appointment focused on balanced, natural-looking results.",
    durationCopy: "65 min.",
    depositCents: 12012,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "Injectable treatment near the lips",
    prepCopy:
      "Avoid blood-thinning supplements only when your provider has advised it. Bring a list of prior fillers and medical history.",
    downtimeCopy:
      "Swelling or bruising can appear for several days depending on the area and product.",
  },
  {
    locationSlug: "napa",
    serviceSlug: "hyperhidrosis-consult",
    displayName: "Excessive Sweating Consult",
    category: "injectables",
    shortDescription:
      "A complimentary consultation to discuss excessive sweating and the appropriate next step.",
    durationCopy: "15 min.",
    paymentRule: "no_card",
    isConsultation: true,
  },
  {
    locationSlug: "napa",
    serviceSlug: "hydrafacial",
    displayName: "Signature HydraFacial",
    category: "facials",
    shortDescription: "Deep-cleanse, exfoliate, and hydrate in one treatment.",
    durationCopy: "45 min.",
    paymentRule: "card_on_file",
    isConsultation: false,
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "Facial treatment handpiece",
  },
  {
    locationSlug: "napa",
    serviceSlug: "hydrafacial-deluxe",
    displayName: "Deluxe HydraFacial",
    category: "facials",
    shortDescription: "A deluxe HydraFacial visit with Rella’s esthetics team.",
    durationCopy: "45 min.",
    depositCents: 6000,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "Facial treatment handpiece",
  },
  {
    locationSlug: "napa",
    serviceSlug: "skin-health-consult",
    displayName: "Initial Skin Health Consult",
    category: "facials",
    shortDescription:
      "Start with a complimentary skin consultation to choose the right facial or skin-health plan.",
    durationCopy: "15 min.",
    paymentRule: "no_card",
    isConsultation: true,
  },
  {
    locationSlug: "napa",
    serviceSlug: "laser-consult",
    displayName: "Initial Laser Consult",
    category: "laser",
    shortDescription:
      "A complimentary consultation to match your goals with the appropriate laser treatment.",
    durationCopy: "15 min.",
    paymentRule: "no_card",
    isConsultation: true,
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "Device-based skin treatment",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "botox",
    displayName: "New Patient Tox",
    category: "injectables",
    shortDescription:
      "Your first tox visit includes a consultation to tailor neuromodulator treatment.",
    durationCopy: "30 min.",
    depositCents: 5000,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "Botox and Dysport vials",
    prepCopy:
      "Arrive with a clean face when possible. Share medications, allergies, and prior injectable history during your consultation.",
    downtimeCopy:
      "Most people return to normal activities the same day. Temporary redness or small marks can occur at injection sites.",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "dermal-fillers",
    displayName: "Dermal Fillers",
    category: "injectables",
    shortDescription:
      "A personalized filler appointment focused on balanced, natural-looking results.",
    durationCopy: "65 min.",
    depositCents: 12012,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "Injectable treatment near the lips",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "hydrafacial",
    displayName: "Signature HydraFacial",
    category: "facials",
    shortDescription: "Deep-cleanse, exfoliate, and hydrate in one treatment.",
    durationCopy: "45 min.",
    depositCents: 6000,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "Facial treatment handpiece",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "skin-health-consult",
    displayName: "Initial Skin Health Consult",
    category: "facials",
    shortDescription:
      "Start with a complimentary skin consultation to choose the right facial or skin-health plan.",
    durationCopy: "30 min.",
    paymentRule: "no_card",
    isConsultation: true,
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "laser-consult",
    displayName: "Initial Laser Consult",
    category: "laser",
    shortDescription:
      "A complimentary consultation to match your goals with the appropriate laser treatment.",
    durationCopy: "30 min.",
    paymentRule: "no_card",
    isConsultation: true,
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "Device-based skin treatment",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "microneedling-consult",
    displayName: "Initial Microneedling Consult",
    category: "microneedling",
    shortDescription:
      "A complimentary consultation to confirm the right microneedling plan for your skin goals.",
    durationCopy: "30 min.",
    paymentRule: "no_card",
    isConsultation: true,
    image: "/images/treatments/microneedling-aftercare.webp",
    imageAlt: "Patient checking skin after treatment",
  },
  {
    locationSlug: "vacaville",
    serviceSlug: "universal-peel",
    displayName: "Universal Peel",
    category: "peels",
    shortDescription:
      "A professional chemical peel appointment customized for your skin and treatment goals.",
    durationCopy: "90 min.",
    depositCents: 5060,
    paymentRule: "deposit",
    isConsultation: false,
    image: "/images/treatments/chemical-peel.webp",
    imageAlt: "In-clinic facial treatment",
  },
] as const;

function toTreatment(seed: CatalogSeed): GuidedTreatment {
  return {
    key: `${seed.locationSlug}/${seed.serviceSlug}`,
    locationSlug: seed.locationSlug,
    serviceSlug: seed.serviceSlug,
    displayName: seed.displayName,
    category: seed.category,
    shortDescription: seed.shortDescription,
    image: seed.image,
    imageAlt: seed.imageAlt,
    durationCopy: seed.durationCopy,
    depositCents: seed.depositCents,
    paymentRule: seed.paymentRule,
    isConsultation: seed.isConsultation,
    prepCopy: seed.prepCopy,
    downtimeCopy: seed.downtimeCopy,
  };
}

const TREATMENTS: readonly GuidedTreatment[] = SEEDS.map(toTreatment);

const BY_KEY = new Map(TREATMENTS.map((t) => [t.key, t]));

export const CATEGORY_LABELS: Record<string, string> = {
  injectables: "Injectables",
  facials: "Facials & Skin",
  laser: "Laser",
  microneedling: "Microneedling",
  peels: "Peels",
  consults: "Consultations",
};

export const CATEGORY_ORDER = [
  "injectables",
  "facials",
  "laser",
  "microneedling",
  "peels",
] as const;

/** Boulevard combination scheduling is not verified for this shell — one treatment only. */
export const ALLOWS_MULTI_TREATMENT = false;

export function getGuidedLocation(
  slug: BookingLocation | null | undefined,
): GuidedLocation | null {
  if (!slug) return null;
  return GUIDED_LOCATIONS.find((l) => l.slug === slug) ?? null;
}

export function resolveGuidedTreatment(
  locationSlug: BookingLocation,
  serviceSlug: string,
): GuidedTreatment | null {
  return BY_KEY.get(`${locationSlug}/${serviceSlug}`) ?? null;
}

export function listTreatmentsForLocation(
  locationSlug: BookingLocation,
): GuidedTreatment[] {
  return TREATMENTS.filter((t) => t.locationSlug === locationSlug);
}

export function treatmentsByCategory(
  locationSlug: BookingLocation,
  search = "",
): { category: string; label: string; treatments: GuidedTreatment[] }[] {
  const q = search.trim().toLowerCase();
  const treatments = listTreatmentsForLocation(locationSlug).filter((t) => {
    if (!q) return true;
    return (
      t.displayName.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    treatments: treatments.filter((t) => t.category === category),
  })).filter((group) => group.treatments.length > 0);
}

/**
 * Map website CTA intent onto a catalog treatment when the mapping is known.
 * Unknown services fail closed (null) — never invent a booking target.
 */
export function mapIntentToTreatmentKey(input: {
  location?: BookingLocation;
  service?: string;
  category?: BookingCategory;
}): string | null {
  const location = input.location;
  if (!location) return null;

  const service = (input.service ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  if (service) {
    const aliases: Record<string, string> = {
      botox: "botox",
      tox: "botox",
      "new-patient-tox": "botox",
      "new-patient-botox": "botox",
      "napa-botox": "botox",
      filler: "dermal-fillers",
      "dermal-fillers": "dermal-fillers",
      hydrafacial: "hydrafacial",
      peels: "universal-peel",
      peel: "universal-peel",
      "chemical-peels": "universal-peel",
      "universal-peel": "universal-peel",
      "skin-health-consult": "skin-health-consult",
      "laser-consult": "laser-consult",
      laser: "laser-consult",
      "laser-treatments": "laser-consult",
      microneedling: "microneedling-consult",
      "microneedling-consult": "microneedling-consult",
      hyperhidrosis: "hyperhidrosis-consult",
      "hyperhidrosis-consult": "hyperhidrosis-consult",
      "tox-established": "tox-established",
      "hydrafacial-deluxe": "hydrafacial-deluxe",
      facial: "skin-health-consult",
      facials: "skin-health-consult",
    };

    const mapped = aliases[service];
    if (!mapped) return null;
    const treatment = resolveGuidedTreatment(location, mapped);
    return treatment?.key ?? null;
  }

  if (input.category) {
    const consultByCategory: Partial<Record<BookingCategory, string>> = {
      injectables: location === "napa" ? "botox" : "botox",
      laser: "laser-consult",
      microneedling: "microneedling-consult",
      facials: "skin-health-consult",
      peels: "universal-peel",
    };
    const slug = consultByCategory[input.category];
    if (!slug) return null;
    return resolveGuidedTreatment(location, slug)?.key ?? null;
  }

  return null;
}

export function formatDeposit(cents: number | undefined): string | null {
  if (cents == null || !Number.isFinite(cents) || cents < 0) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function paymentRuleLabel(
  treatment: GuidedTreatment,
): string {
  switch (treatment.paymentRule) {
    case "deposit": {
      const amount = formatDeposit(treatment.depositCents);
      return amount
        ? `${amount} booking deposit (charged when confirmed)`
        : "Booking deposit required at confirmation";
    }
    case "card_on_file":
      return "Card on file required · $0 charged at booking";
    case "no_card":
      return "No card required for this consult";
    default: {
      const _exhaustive: never = treatment.paymentRule;
      return _exhaustive;
    }
  }
}

export function buildHandoffUrl(
  locationSlug: BookingLocation,
  serviceSlug: string,
): string | null {
  const treatment = resolveGuidedTreatment(locationSlug, serviceSlug);
  if (!treatment) return null;
  return `https://book.experiencerella.com/book/${locationSlug}/${serviceSlug}`;
}
