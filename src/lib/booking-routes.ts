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
 *  - A generic CTA with no location → Rella's first-party clinic chooser.
 *    NEVER silently chooses a city or Napa Tox.
 *
 * The Napa campaign service routes below are verified from the Boulevard
 * inventory and the live campaign handoff. Any other service intentionally
 * falls back to a location/business widget. Do not invent Boulevard ids.
 */

/** Canonical, hardened New Patient Tox booking (rella-booking). */
export const CANONICAL_NAPA_TOX = "https://book.experiencerella.com/book/napa/botox";

const WIDGET_BASE =
  "https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget";
const NAPA_LOCATION_ID = "91eba843-57fb-49e9-8505-431d501ffec7";
const VACAVILLE_LOCATION_ID = "0f146f87-364e-4dfd-b938-61ba49528820";

/** First-party clinic chooser used whenever location intent is not explicit. */
export const BOOKING_LOCATION_CHOOSER = "/book";

/**
 * Location-pinned Boulevard menus.
 *
 * Boulevard's old widget URL without `path` rendered its live `#/not-found`
 * screen when checked in a real browser on 2026-08-03, even though the HTTP
 * response was 200. Supplying the menu path is required for a usable handoff.
 */
const locationMenu = (locationId: string) =>
  `${WIDGET_BASE}?path=${encodeURIComponent("/cart/menu")}&locationId=${locationId}&visitType=SELF_VISIT`;

export const BOULEVARD_WIDGET_NAPA = locationMenu(NAPA_LOCATION_ID);
export const BOULEVARD_WIDGET_VACAVILLE = locationMenu(VACAVILLE_LOCATION_ID);

/**
 * Dedicated medical-weight-loss funnel.
 *
 * These four public routes were checked directly on 2026-08-03 and returned
 * HTTP 200. Keep the path order location-first: an older audit recorded the
 * segments in the opposite order, and those stale URLs now return 404.
 */
export const WEIGHT_LOSS_BOOKING_ORIGIN = "https://book.rellaweightloss.com";
export const WEIGHT_LOSS_CONSULT_SERVICE = "weight-loss-consult";

export function resolveWeightLossAssessmentHref(location: BookingLocation): string {
  return `${WEIGHT_LOSS_BOOKING_ORIGIN}/assessment/${location}`;
}

export function resolveWeightLossConsultHref(location: BookingLocation): string {
  return `${WEIGHT_LOSS_BOOKING_ORIGIN}/book/${location}/${WEIGHT_LOSS_CONSULT_SERVICE}`;
}

const deepLink = (menuPath: string) =>
  `${WIDGET_BASE}?path=${encodeURIComponent(`/cart/menu/${menuPath}`)}&locationId=${NAPA_LOCATION_ID}&visitType=SELF_VISIT`;

const vacavilleDeepLink = (menuPath: string) =>
  `${WIDGET_BASE}?path=${encodeURIComponent(`/cart/menu/${menuPath}`)}&locationId=${VACAVILLE_LOCATION_ID}&visitType=SELF_VISIT`;

/**
 * VERIFIED Boulevard service deep links, by canonical service slug — Napa menu,
 * with the Napa locationId pinned (a service path alone is not sufficient). These
 * are ONLY used for an explicit `location: "napa"` intent; a locationless service
 * intent never resolves here (it must not assume Napa).
 */
const VERIFIED_NAPA_SERVICE_DEEPLINKS: Readonly<Record<string, string>> = {
  hydrafacial: deepLink("Facials/s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d"),
  "dermal-fillers": deepLink("Injectables/s_e3564b2f-c00d-47c2-8ca0-665b6d6f25e4"),
  filler: deepLink("Injectables/s_e3564b2f-c00d-47c2-8ca0-665b6d6f25e4"),
  "laser-treatments": deepLink("Laser"),
  laser: deepLink("Laser"),
  // Consult-first: avoids hard-linking a rotating MiraDry special or silently
  // routing a sweating concern into the standard cosmetic-tox cart.
  hyperhidrosis: deepLink("Injectables/s_14029fc9-a8d2-441e-99de-52ca98cd3ae8"),
  // botox/tox intentionally NOT here — Napa Tox routes to the canonical app.
};

/**
 * Rendered against the live Vacaville menu on 2026-08-03. The laser service
 * explicitly requires the Initial Laser Consult before IPL, so the city page
 * can remove a menu-selection step without guessing a treatment.
 */
const VERIFIED_VACAVILLE_SERVICE_DEEPLINKS: Readonly<Record<string, string>> = {
  "laser-treatments": vacavilleDeepLink(
    "Laser/s_1328674e-c793-4b3c-833e-9a3827c5769b",
  ),
  laser: vacavilleDeepLink("Laser/s_1328674e-c793-4b3c-833e-9a3827c5769b"),
};

export type BookingLocation = "napa" | "vacaville";

export interface BookingIntent {
  /** Explicit location, when the CTA is location-specific. */
  location?: BookingLocation;
  /** Service slug / name, when the CTA is service-specific. */
  service?: string;
}

const TOX_SLUGS = new Set(["botox", "tox", "new-patient-tox", "new-patient-botox", "napa-botox"]);
const WEIGHT_LOSS_SLUGS = new Set(["weight-loss", "medical-weight-loss", WEIGHT_LOSS_CONSULT_SERVICE]);

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

  // The weight-loss consultation is owned by the dedicated, verified booking
  // app. An explicit city is required; a locationless CTA still falls back to
  // the business widget rather than guessing a clinic.
  if (intent.location && WEIGHT_LOSS_SLUGS.has(svc)) {
    return resolveWeightLossConsultHref(intent.location);
  }

  // Vacaville: use only rendered, location-pinned paths; otherwise keep the
  // verified clinic menu fallback. No service ever escalates to Napa.
  if (intent.location === "vacaville") {
    if (svc && VERIFIED_VACAVILLE_SERVICE_DEEPLINKS[svc]) {
      return VERIFIED_VACAVILLE_SERVICE_DEEPLINKS[svc];
    }
    return BOULEVARD_WIDGET_VACAVILLE;
  }

  if (intent.location === "napa") {
    if (TOX_SLUGS.has(svc)) return CANONICAL_NAPA_TOX;
    if (svc && VERIFIED_NAPA_SERVICE_DEEPLINKS[svc]) return VERIFIED_NAPA_SERVICE_DEEPLINKS[svc];
    return BOULEVARD_WIDGET_NAPA; // Napa, unspecified/other service — not Tox
  }

  // No explicit location: never assume Napa — not even for a known service slug
  // like hydrafacial. Route to the clinic chooser so the visitor selects a
  // location before any location-specific menu/deep link is used.
  return BOOKING_LOCATION_CHOOSER;
}
