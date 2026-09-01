/**
 * Centralized customer booking routing.
 *
 * The website owns intent collection; `rella-booking` owns every scheduling
 * handoff. Boulevard remains the server-side system of record and is never a
 * customer-facing destination from this application.
 */

export type BookingLocation = "napa" | "vacaville";

export interface BookingIntent {
  location?: BookingLocation;
  service?: string;
}

const configuredBookingOrigin =
  process.env.NEXT_PUBLIC_RELLA_BOOKING_ORIGIN?.trim().replace(/\/$/, "");

/**
 * Production defaults to the canonical custom app. Preview branches can point
 * at a protected booking preview without changing production or DNS.
 */
export const CUSTOM_BOOKING_ORIGIN =
  configuredBookingOrigin || "https://book.experiencerella.com";

export const CANONICAL_NAPA_TOX =
  `${CUSTOM_BOOKING_ORIGIN}/book/napa/botox`;

/** Keep generic website actions on the branded clinic chooser first. */
export const BOOKING_LOCATION_CHOOSER = "/book";

export const WEIGHT_LOSS_BOOKING_ORIGIN =
  "https://book.rellaweightloss.com";
export const WEIGHT_LOSS_CONSULT_SERVICE = "weight-loss-consult";

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

function normalizeService(service?: string): string {
  return (service ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 64);
}

export function resolveWeightLossConsultHref(
  location: BookingLocation,
): string {
  return `${WEIGHT_LOSS_BOOKING_ORIGIN}/book/${location}/${WEIGHT_LOSS_CONSULT_SERVICE}`;
}

/**
 * Safe custom-app entry for unverified or not-yet-enabled aesthetics services.
 * The booking app preserves the requested clinic/service, exposes only catalog
 * entries that pass its fail-closed checks, and otherwise offers a Rella call
 * path. It never falls through to a Boulevard widget.
 */
export function resolveCustomBookingEntry(intent: BookingIntent): string {
  const url = new URL("/book", `${CUSTOM_BOOKING_ORIGIN}/`);
  if (intent.location) url.searchParams.set("location", intent.location);
  const service = normalizeService(intent.service);
  if (service) url.searchParams.set("service", service);
  return url.toString();
}

/**
 * Total, city-safe resolver. The two verified weight-loss routes and Napa Tox
 * can enter their exact custom flows; everything else enters the custom Rella
 * chooser with its intent preserved until that catalog item is verified.
 */
export function resolveBookingHref(intent: BookingIntent = {}): string {
  const service = normalizeService(intent.service);

  if (intent.location && WEIGHT_LOSS_SLUGS.has(service)) {
    return resolveWeightLossConsultHref(intent.location);
  }

  if (intent.location === "napa" && TOX_SLUGS.has(service)) {
    return CANONICAL_NAPA_TOX;
  }

  if (intent.location) {
    return resolveCustomBookingEntry({
      location: intent.location,
      ...(service ? { service } : {}),
    });
  }

  return BOOKING_LOCATION_CHOOSER;
}
