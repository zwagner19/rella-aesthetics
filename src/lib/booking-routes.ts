/**
 * Canonical public booking routes owned by Rella.
 *
 * `rella-booking` collects clinic and category intent before a patient chooses
 * an appointment. Keep broad website CTAs on those chooser routes; only the
 * verified Napa Botox campaign may enter an exact appointment flow.
 */

export type BookingLocation = "napa" | "vacaville";
export type BookingCategory =
  | "injectables"
  | "laser"
  | "microneedling"
  | "facials"
  | "peels";

export interface BookingIntent {
  location?: BookingLocation;
  service?: string;
  category?: BookingCategory;
}

export const AESTHETICS_BOOKING_ORIGIN =
  "https://book.experiencerella.com";
export const BOOKING_LOCATION_CHOOSER =
  `${AESTHETICS_BOOKING_ORIGIN}/book`;
export const CANONICAL_NAPA_TOX =
  `${AESTHETICS_BOOKING_ORIGIN}/book/napa/botox`;

export const WEIGHT_LOSS_BOOKING_ORIGIN = "https://book.rellaweightloss.com";
export const WEIGHT_LOSS_CONSULT_SERVICE = "weight-loss-consult";

export function resolveWeightLossConsultHref(
  location: BookingLocation,
): string {
  return `${WEIGHT_LOSS_BOOKING_ORIGIN}/book/${location}/${WEIGHT_LOSS_CONSULT_SERVICE}`;
}

const SUPPORTED_CATEGORIES = new Set<BookingCategory>([
  "injectables",
  "laser",
  "microneedling",
  "facials",
  "peels",
]);

const TOX_SLUGS = new Set([
  "botox",
  "tox",
  "new-patient-tox",
  "new-patient-botox",
  "napa-botox",
]);

const WEIGHT_LOSS_SLUGS = new Set([
  "weight-loss",
  "medical-weight-loss",
  WEIGHT_LOSS_CONSULT_SERVICE,
]);

const CATEGORY_BY_SERVICE: Readonly<Record<string, BookingCategory>> = {
  botox: "injectables",
  tox: "injectables",
  "new-patient-tox": "injectables",
  "new-patient-botox": "injectables",
  "napa-botox": "injectables",
  "dermal-fillers": "injectables",
  filler: "injectables",
  hyperhidrosis: "injectables",
  laser: "laser",
  "laser-treatments": "laser",
  microneedling: "microneedling",
  facial: "facials",
  facials: "facials",
  hydrafacial: "facials",
  peel: "peels",
  peels: "peels",
  "chemical-peels": "peels",
};

function normalizeSlug(value?: string): string {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 64);
}

function supportedCategory(value?: string): BookingCategory | undefined {
  const normalized = normalizeSlug(value);
  return SUPPORTED_CATEGORIES.has(normalized as BookingCategory)
    ? (normalized as BookingCategory)
    : undefined;
}

/**
 * Build a branded chooser URL without selecting an appointment. The booking
 * app supports an optional clinic and one of its public category slugs.
 */
export function resolveBookingChooserHref(
  intent: Pick<BookingIntent, "location" | "category" | "service"> = {},
): string {
  const service = normalizeSlug(intent.service);
  const category =
    supportedCategory(intent.category) ?? CATEGORY_BY_SERVICE[service];
  const url = new URL(BOOKING_LOCATION_CHOOSER);

  if (intent.location) url.searchParams.set("location", intent.location);
  if (category) url.searchParams.set("category", category);

  return url.toString();
}

/**
 * Total, city-safe customer routing. Broad service/category intent always
 * opens the chooser; it never auto-selects an appointment.
 */
export function resolveBookingHref(intent: BookingIntent = {}): string {
  const service = normalizeSlug(intent.service);

  if (intent.location && WEIGHT_LOSS_SLUGS.has(service)) {
    return resolveWeightLossConsultHref(intent.location);
  }

  if (intent.location === "napa" && TOX_SLUGS.has(service)) {
    return CANONICAL_NAPA_TOX;
  }

  // A clinic is required before entering the dedicated consultation flow.
  if (WEIGHT_LOSS_SLUGS.has(service)) {
    return BOOKING_LOCATION_CHOOSER;
  }

  return resolveBookingChooserHref({
    location: intent.location,
    category: intent.category,
    service,
  });
}
