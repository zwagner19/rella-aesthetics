import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";
import { treatmentBookingNotes, treatmentDescription } from "./description";
import type {
  GuidedLocation,
  GuidedTreatment,
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

export const ALLOWS_MULTI_TREATMENT = false;

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

export function backendTreatments(locationSlug: BookingLocation, services: Array<{serviceSlug: string; displayName: string; category: string; description: string; durationCopy?: string; listPriceCents?: number; depositCents?: number; paymentRule?: string}>): GuidedTreatment[] {
  return services.map(s => ({
    key: `${locationSlug}/${s.serviceSlug}`, locationSlug, serviceSlug: s.serviceSlug,
    displayName: s.displayName, category: s.category, shortDescription: treatmentDescription(s.description, s.displayName),
    bookingNotes: treatmentBookingNotes(s.description),
    durationCopy: s.durationCopy, listPriceCents: s.listPriceCents, depositCents: s.depositCents,
    paymentRule: s.paymentRule === "NO_CARD" ? "no_card" : s.paymentRule === "CARD_ON_FILE_ZERO" ? "card_on_file" : s.paymentRule === "DEPOSIT_CENTS" ? "deposit" : "pending",
    isConsultation: /consult/i.test(s.displayName), onlineHandoff: true,
    ...IMAGE_BY_SLUG[s.serviceSlug],
  }));
}

export function getGuidedLocation(
  slug: BookingLocation | null | undefined,
): GuidedLocation | null {
  if (!slug) return null;
  return GUIDED_LOCATIONS.find((l) => l.slug === slug) ?? null;
}

export function resolveGuidedTreatment(
  locationSlug: BookingLocation,
  serviceSlug: string,
  catalog: readonly GuidedTreatment[] = [],
): GuidedTreatment | null {
  return catalog.find(t => t.key === `${locationSlug}/${serviceSlug}`) ?? null;
}

export function listTreatmentsForLocation(
  locationSlug: BookingLocation,
  catalog: readonly GuidedTreatment[] = [],
): GuidedTreatment[] {
  return catalog.filter((t) => t.locationSlug === locationSlug);
}

export function treatmentsByCategory(
  locationSlug: BookingLocation,
  search = "",
  catalog: readonly GuidedTreatment[] = [],
): { category: string; label: string; treatments: GuidedTreatment[] }[] {
  const q = search.trim().toLowerCase();
  const treatments = listTreatmentsForLocation(locationSlug, catalog).filter((t) => {
    if (!q) return true;
    return (
      t.displayName.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return [...new Set(treatments.map(t => t.category))].map((category) => ({
    category,
    label: category,
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
  treatments?: readonly GuidedTreatment[];
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
    const treatment = resolveGuidedTreatment(location, mapped, input.treatments);
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
    return resolveGuidedTreatment(location, slug, input.treatments)?.key ?? null;
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
    case "pending": return "Amount confirmed by Boulevard before payment";
    case "deposit": {
      const amount = formatDeposit(treatment.depositCents);
      if (amount) {
        return `${amount} booking deposit (charged when confirmed)`;
      }
      if (treatment.onlineHandoff) {
        return "Booking deposit required at confirmation";
      }
      return "Amount confirmed by Boulevard before payment";
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
