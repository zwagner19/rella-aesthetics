/**
 * Fail-closed public catalog for the in-site guided booking shell.
 *
 * The overlay menu is the prior Boulevard online catalog (location by location),
 * limited to services this repo already names, plus the weight-loss consult
 * route. Wider Admin-inventory rows stay out of the menu. Prices, deposit
 * amounts, and staff are not shown. Exact handoff is used only for a verified
 * route; unknown services fail closed.
 */

import {
  resolveWeightLossConsultHref,
  WEIGHT_LOSS_CONSULT_SERVICE,
  type BookingCategory,
  type BookingLocation,
} from "@/lib/booking-routes";
import {
  BOULEVARD_MENU_SEEDS,
  type BoulevardMenuSeed,
} from "./boulevard-menu-data";
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

/**
 * Menu groups for the overlay. Aesthetics order matches the booking catalog.
 * Weight Loss is its own group, booked on book.rellaweightloss.com.
 */
export const BOULEVARD_CATEGORY_ORDER = [
  "Injectables",
  "Laser",
  "Microneedling",
  "Facials",
  "Peels",
  "Weight Loss",
] as const;

export type BoulevardBookingCategory =
  (typeof BOULEVARD_CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<BoulevardBookingCategory, string> = {
  Injectables: "Injectables",
  Laser: "Laser",
  Microneedling: "Microneedling",
  Facials: "Facials",
  Peels: "Peels",
  "Weight Loss": "Weight Loss",
};

export const CATEGORY_ORDER = BOULEVARD_CATEGORY_ORDER;

/** Boulevard combination scheduling is not verified for this shell — one treatment only. */
export const ALLOWS_MULTI_TREATMENT = false;

/**
 * Probe amounts kept on the treatment record and never rendered.
 * QC D1–D5: these figures are unverified. The overlay must not state them.
 */
const VERIFIED_DEPOSITS: Record<string, { depositCents?: number; paymentRule: PaymentRuleCopy }> = {
  botox: { depositCents: 5000, paymentRule: "deposit" },
  "tox-established": { depositCents: 5000, paymentRule: "deposit" },
  "dermal-fillers": { depositCents: 12012, paymentRule: "deposit" },
  "hyperhidrosis-consult": { paymentRule: "no_card" },
  hydrafacial: { paymentRule: "card_on_file" }, // Napa CARD_ON_FILE_ZERO; Vacaville has deposit — location resolved below
  "hydrafacial-deluxe": { depositCents: 6000, paymentRule: "deposit" },
  "skin-health-consult": { paymentRule: "no_card" },
  "laser-consult": { paymentRule: "no_card" },
  "microneedling-consult": { paymentRule: "no_card" },
  "universal-peel": { depositCents: 5060, paymentRule: "deposit" },
};

const VERIFIED_HYDRAFACIAL_BY_LOCATION: Record<
  string,
  { depositCents?: number; paymentRule: PaymentRuleCopy }
> = {
  napa: { paymentRule: "card_on_file" },
  vacaville: { depositCents: 6000, paymentRule: "deposit" },
};

const IMAGE_BY_SLUG: Record<string, { image: string; imageAlt: string }> = {
  botox: {
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "Botox and Dysport vials",
  },
  "tox-established": {
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "Botox and Dysport vials",
  },
  "dermal-fillers": {
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "Injectable treatment near the lips",
  },
  hydrafacial: {
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "Facial treatment handpiece",
  },
  "hydrafacial-deluxe": {
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "Facial treatment handpiece",
  },
  "laser-consult": {
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "Device-based skin treatment",
  },
  "microneedling-consult": {
    image: "/images/treatments/microneedling-aftercare.webp",
    imageAlt: "Patient checking skin after treatment",
  },
  "universal-peel": {
    image: "/images/treatments/chemical-peel.webp",
    imageAlt: "In-clinic facial treatment",
  },
  "weight-loss-consult": {
    image: "/images/treatments/medical-weight-loss.webp",
    imageAlt:
      "A gloved Rella team member holding three prepared syringes in the clinic",
  },
};

/**
 * Online rows from the prior Boulevard catalog snapshot, limited to services
 * this repo already names. Location splits follow that QC: Napa has established
 * tox, Deluxe HydraFacial, and the hyperhidrosis consult; Vacaville has the
 * microneedling consult and Universal Peel. Platinum, IV, and the wider Admin
 * inventory are not online at either clinic.
 */
const OFFERED_SERVICE_SLUGS: Record<BookingLocation, ReadonlySet<string>> = {
  napa: new Set([
    "botox",
    "tox-established",
    "dermal-fillers",
    "hydrafacial",
    "hydrafacial-deluxe",
    "skin-health-consult",
    "laser-consult",
    "hyperhidrosis-consult",
    WEIGHT_LOSS_CONSULT_SERVICE,
  ]),
  vacaville: new Set([
    "botox",
    "dermal-fillers",
    "hydrafacial",
    "skin-health-consult",
    "laser-consult",
    "microneedling-consult",
    "universal-peel",
    WEIGHT_LOSS_CONSULT_SERVICE,
  ]),
};

/**
 * Durations shown only where this repo does not disagree with itself.
 * Omitted on purpose: skin-health consult (Napa page 15 min, seed and
 * Vacaville page 30), Universal Peel (seed 45, Vacaville page 90),
 * laser consult (seed 30; catalog 30 vs a 15-minute probe), hyperhidrosis
 * consult (seed 15; catalog 30 vs a 15-minute probe), fillers (seed 5).
 */
const SHOWN_DURATION_MINUTES: Partial<Record<string, number>> = {
  botox: 30,
  "tox-established": 20,
  hydrafacial: 45,
  "hydrafacial-deluxe": 45,
  "microneedling-consult": 30,
  [WEIGHT_LOSS_CONSULT_SERVICE]: 30,
};

const WEIGHT_LOSS_SEED: BoulevardMenuSeed = {
  serviceSlug: WEIGHT_LOSS_CONSULT_SERVICE,
  displayName: "Weight Loss Consult",
  category: "Weight Loss",
  durationMinutes: 30,
  isConsultation: true,
  onlineHandoff: true,
  locations: ["napa", "vacaville"],
  shortDescription: "Medical weight-loss consultation.",
};

function durationCopy(minutes?: number): string | undefined {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) return undefined;
  return `${minutes} min.`;
}

function paymentFor(
  seed: BoulevardMenuSeed,
  locationSlug: BookingLocation,
): { depositCents?: number; paymentRule: PaymentRuleCopy } {
  // Boulevard price and deposit for this consult are not in the repo.
  if (seed.serviceSlug === WEIGHT_LOSS_CONSULT_SERVICE) {
    return { paymentRule: "deposit" };
  }
  if (seed.serviceSlug === "hydrafacial") {
    return VERIFIED_HYDRAFACIAL_BY_LOCATION[locationSlug] ?? {
      paymentRule: "deposit",
    };
  }
  const verified = VERIFIED_DEPOSITS[seed.serviceSlug];
  if (verified) return verified;
  if (seed.isConsultation) return { paymentRule: "no_card" };
  // Unverified online path — do not invent deposit amounts.
  return { paymentRule: "deposit" };
}

function publicDisplayName(seed: BoulevardMenuSeed): string {
  switch (seed.serviceSlug) {
    case "hyperhidrosis-consult":
      return "Hyperhidrosis Consult";
    case "hydrafacial":
      return "Signature HydraFacial";
    case "hydrafacial-deluxe":
      return "Deluxe HydraFacial";
    case WEIGHT_LOSS_CONSULT_SERVICE:
      return "Weight Loss Consult";
    default:
      return seed.displayName;
  }
}

function publicDescription(seed: BoulevardMenuSeed): string {
  if (seed.serviceSlug === WEIGHT_LOSS_CONSULT_SERVICE) {
    return "Medical weight-loss consultation.";
  }
  if (seed.shortDescription?.toLowerCase().includes("complimentary")) {
    return "Consultation.";
  }
  return (
    seed.shortDescription ??
    "Boulevard menu service — availability confirmed during booking."
  );
}

function toTreatment(
  seed: BoulevardMenuSeed,
  locationSlug: BookingLocation,
): GuidedTreatment {
  const pay = paymentFor(seed, locationSlug);
  const media = IMAGE_BY_SLUG[seed.serviceSlug];
  return {
    key: `${locationSlug}/${seed.serviceSlug}`,
    locationSlug,
    serviceSlug: seed.serviceSlug,
    displayName: publicDisplayName(seed),
    category: seed.category,
    shortDescription: publicDescription(seed),
    image: media?.image,
    imageAlt: media?.imageAlt,
    durationCopy: durationCopy(SHOWN_DURATION_MINUTES[seed.serviceSlug]),
    listPriceCents: undefined,
    depositCents: undefined,
    paymentRule: pay.paymentRule,
    isConsultation: seed.isConsultation,
    onlineHandoff: seed.onlineHandoff,
  };
}

const MENU_SEEDS: readonly BoulevardMenuSeed[] = [
  ...BOULEVARD_MENU_SEEDS,
  WEIGHT_LOSS_SEED,
];

const TREATMENTS: readonly GuidedTreatment[] = MENU_SEEDS.flatMap((seed) =>
  seed.locations
    .filter((location) => OFFERED_SERVICE_SLUGS[location].has(seed.serviceSlug))
    .map((location) => toTreatment(seed, location)),
);

const BY_KEY = new Map(TREATMENTS.map((t) => [t.key, t]));

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

  return BOULEVARD_CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
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
      "weight-loss": WEIGHT_LOSS_CONSULT_SERVICE,
      "medical-weight-loss": WEIGHT_LOSS_CONSULT_SERVICE,
      [WEIGHT_LOSS_CONSULT_SERVICE]: WEIGHT_LOSS_CONSULT_SERVICE,
    };

    const mapped = aliases[service] ?? service;
    const treatment = resolveGuidedTreatment(location, mapped);
    return treatment?.key ?? null;
  }

  if (input.category) {
    const consultByCategory: Partial<Record<BookingCategory, string>> = {
      injectables: "botox",
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

export function formatListPrice(cents: number | undefined): string | null {
  if (cents == null || !Number.isFinite(cents) || cents <= 0) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function paymentRuleLabel(treatment: GuidedTreatment): string {
  switch (treatment.paymentRule) {
    case "deposit":
    case "card_on_file":
    case "no_card":
      return "Payment is confirmed in Boulevard before you reserve.";
    default: {
      const _exhaustive: never = treatment.paymentRule;
      return _exhaustive;
    }
  }
}

/**
 * Existing booking-site route for this clinic and service.
 * Weight loss uses its consult host. Unknown slugs fail closed.
 * This overlay does not build a cart, calendar, or payment.
 */
export function buildHandoffUrl(
  locationSlug: BookingLocation,
  serviceSlug: string,
): string | null {
  const treatment = resolveGuidedTreatment(locationSlug, serviceSlug);
  if (!treatment) return null;
  if (treatment.serviceSlug === WEIGHT_LOSS_CONSULT_SERVICE) {
    return resolveWeightLossConsultHref(locationSlug);
  }
  if (!treatment.onlineHandoff) return null;
  return `https://book.experiencerella.com/book/${locationSlug}/${serviceSlug}`;
}
