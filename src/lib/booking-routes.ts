/**
 * Centralized, typed booking-CTA routing (Large Sprint 06, Workstream D).
 *
 * Single source of truth for where every booking CTA sends a visitor. Hard
 * safety rules encoded here + proven by booking-routes.test.ts:
 *  - Napa New Patient Tox / Botox → the canonical hardened booking app.
 *  - Other Napa services → their VERIFIED Boulevard deep link.
 *  - A Napa CTA with no specific service → the Napa-scoped Boulevard widget
 *    (NOT Tox — never silently assume the service).
 *  - Vacaville → the Vacaville-scoped Boulevard widget. NEVER Napa Tox.
 *  - A generic CTA with no location → the business-level Boulevard widget.
 *    NEVER silently Napa Tox.
 *
 * Only the two service deep links below are verified (Admin-read + live); any
 * other service intentionally falls back to a location/business widget. Do not
 * invent Boulevard ids.
 */

/** Canonical, hardened New Patient Tox booking (rella-booking). */
export const CANONICAL_NAPA_TOX = "https://book.experiencerella.com/book/napa/botox";

const WIDGET_BASE =
  "https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget";
const NAPA_LOCATION_ID = "91eba843-57fb-49e9-8505-431d501ffec7";
const VACAVILLE_LOCATION_ID = "0f146f87-364e-4dfd-b938-61ba49528820";

/** Business-level generic widget (safe fallback; visitor picks location/service). */
export const BOULEVARD_WIDGET_GENERIC = WIDGET_BASE;
export const BOULEVARD_WIDGET_NAPA = `${WIDGET_BASE}?locationId=${NAPA_LOCATION_ID}`;
export const BOULEVARD_WIDGET_VACAVILLE = `${WIDGET_BASE}?locationId=${VACAVILLE_LOCATION_ID}`;

const deepLink = (menuPath: string) =>
  `${WIDGET_BASE}?path=${encodeURIComponent(`/cart/menu/${menuPath}`)}&locationId=${NAPA_LOCATION_ID}&visitType=SELF_VISIT`;

/**
 * VERIFIED Boulevard service deep links, by canonical service slug — Napa menu,
 * with the Napa locationId pinned (a service path alone is not sufficient). These
 * are ONLY used for an explicit `location: "napa"` intent; a locationless service
 * intent never resolves here (it must not assume Napa).
 */
const VERIFIED_NAPA_SERVICE_DEEPLINKS: Readonly<Record<string, string>> = {
  hydrafacial: deepLink("Facials/s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d"),
  // botox/tox intentionally NOT here — Napa Tox routes to the canonical app.
};

export type BookingLocation = "napa" | "vacaville";

export interface BookingIntent {
  /** Explicit location, when the CTA is location-specific. */
  location?: BookingLocation;
  /** Service slug / name, when the CTA is service-specific. */
  service?: string;
}

const TOX_SLUGS = new Set(["botox", "tox", "new-patient-tox", "new-patient-botox", "napa-botox"]);

function normalizeService(service?: string): string {
  return (service ?? "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Resolve a booking CTA intent to its destination URL. Total function — always
 * returns a safe URL and never silently routes to Napa Tox except for an
 * explicit Napa Tox/Botox intent.
 */
export function resolveBookingHref(intent: BookingIntent = {}): string {
  const svc = normalizeService(intent.service);

  // Vacaville: always the Vacaville widget. No service ever escalates to Napa.
  if (intent.location === "vacaville") return BOULEVARD_WIDGET_VACAVILLE;

  if (intent.location === "napa") {
    if (TOX_SLUGS.has(svc)) return CANONICAL_NAPA_TOX;
    if (svc && VERIFIED_NAPA_SERVICE_DEEPLINKS[svc]) return VERIFIED_NAPA_SERVICE_DEEPLINKS[svc];
    return BOULEVARD_WIDGET_NAPA; // Napa, unspecified/other service — not Tox
  }

  // No explicit location: never assume Napa — not even for a known service slug
  // like hydrafacial. Route to the generic widget so the visitor selects a
  // location before any location-specific menu/deep link is used.
  return BOULEVARD_WIDGET_GENERIC;
}
