/**
 * Fail-closed public catalog for the in-site guided booking shell.
 *
 * Menu contents come from Boulevard Admin-read inventory (2026-07-22), filtered
 * to active Injectables / Laser / Microneedling / Facials / Peels. Exact online
 * handoff to `book.experiencerella.com/book/{location}/{service}` is only
 * enabled for verified rella-booking aesthetics routes — everything else shows
 * in the menu but completes via the location+category chooser (never invents
 * Boulevard mutation IDs or fake availability).
 */

import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";
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
 * Boulevard Client API / rella-booking menu categories (aesthetics only).
 * Source: `BOOKING_CATEGORY_ORDER` in rella-booking catalog — Weight Loss stays
 * on the dedicated weight-loss host and is intentionally excluded here.
 */
export const BOULEVARD_CATEGORY_ORDER = [
  "Injectables",
  "Laser",
  "Microneedling",
  "Facials",
  "Peels",
] as const;

export type BoulevardBookingCategory =
  (typeof BOULEVARD_CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<BoulevardBookingCategory, string> = {
  Injectables: "Injectables",
  Laser: "Laser",
  Microneedling: "Microneedling",
  Facials: "Facials",
  Peels: "Peels",
};

export const CATEGORY_ORDER = BOULEVARD_CATEGORY_ORDER;

/** Boulevard combination scheduling is not verified for this shell — one treatment only. */
export const ALLOWS_MULTI_TREATMENT = false;

/** Verified deposit amounts from rella-booking cart probes (cents). */
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
};

function durationCopy(minutes?: number): string | undefined {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) return undefined;
  return `${minutes} min.`;
}

function paymentFor(
  seed: BoulevardMenuSeed,
  locationSlug: BookingLocation,
): { depositCents?: number; paymentRule: PaymentRuleCopy } {
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
    displayName: seed.displayName,
    category: seed.category,
    shortDescription:
      seed.shortDescription ??
      "Boulevard menu service — availability and pricing confirmed during booking.",
    image: media?.image,
    imageAlt: media?.imageAlt,
    durationCopy: durationCopy(seed.durationMinutes),
    listPriceCents:
      seed.listPriceCents && seed.listPriceCents > 0
        ? seed.listPriceCents
        : undefined,
    depositCents: pay.depositCents,
    paymentRule: pay.paymentRule,
    isConsultation: seed.isConsultation,
    onlineHandoff: seed.onlineHandoff,
  };
}

const TREATMENTS: readonly GuidedTreatment[] = BOULEVARD_MENU_SEEDS.flatMap(
  (seed) => seed.locations.map((location) => toTreatment(seed, location)),
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
    case "deposit": {
      const amount = formatDeposit(treatment.depositCents);
      if (amount) {
        return `${amount} booking deposit (charged when confirmed)`;
      }
      if (treatment.onlineHandoff) {
        return "Booking deposit required at confirmation";
      }
      return "Deposit/payment confirmed in booking app";
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

/**
 * Exact service route when verified; otherwise location+category chooser.
 * Never invents an unmapped `/book/{location}/{unknown}` path.
 */
export function buildHandoffUrl(
  locationSlug: BookingLocation,
  serviceSlug: string,
): string | null {
  const treatment = resolveGuidedTreatment(locationSlug, serviceSlug);
  if (!treatment) return null;
  if (treatment.onlineHandoff) {
    return `https://book.experiencerella.com/book/${locationSlug}/${serviceSlug}`;
  }
  const categoryParam = treatment.category.toLowerCase();
  const url = new URL("https://book.experiencerella.com/book");
  url.searchParams.set("location", locationSlug);
  url.searchParams.set("category", categoryParam);
  return url.toString();
}
