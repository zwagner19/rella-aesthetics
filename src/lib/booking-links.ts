/**
 * Canonical booking destinations.
 *
 * Rules:
 * - Location-specific pages must link to their location's booking URL
 *   (locationId preserved) so location intent is never lost.
 * - Service-specific CTAs keep service intent ONLY where a verified
 *   Boulevard deep link exists (see VERIFIED_SERVICE_BOOKING_URLS).
 *   Every other service intentionally falls back to the generic
 *   business-level widget (BOOKING_URL_DEFAULT) — do not invent
 *   Boulevard ids for unverified services.
 */

const BOULEVARD_WIDGET_BASE =
  "https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget";

/** Generic business-level booking widget (documented fallback). */
export const BOOKING_URL_DEFAULT = BOULEVARD_WIDGET_BASE;

/** Napa studio — 1541 3rd St, Napa. */
export const BOOKING_URL_NAPA = `${BOULEVARD_WIDGET_BASE}?locationId=91eba843-57fb-49e9-8505-431d501ffec7`;

/** Vacaville studio — 542 Main St, Vacaville. */
export const BOOKING_URL_VACAVILLE = `${BOULEVARD_WIDGET_BASE}?locationId=0f146f87-364e-4dfd-b938-61ba49528820`;

/**
 * Verified Boulevard service deep links, keyed by service page slug.
 *
 * Only two service menu paths are verified:
 * - New Patient Tox (Injectables/s_2fee10b1-1831-4c00-83e9-9c05a7071b15)
 * - Signature Hydrafacial (Facials/s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d)
 *
 * Any slug not listed here intentionally falls back to the generic
 * business widget. Never add an entry without a verified Boulevard id.
 */
export const VERIFIED_SERVICE_BOOKING_URLS: Readonly<Record<string, string>> = {
  botox: `${BOULEVARD_WIDGET_BASE}?path=${encodeURIComponent(
    "/cart/menu/Injectables/s_2fee10b1-1831-4c00-83e9-9c05a7071b15",
  )}&visitType=SELF_VISIT`,
  hydrafacial: `${BOULEVARD_WIDGET_BASE}?path=${encodeURIComponent(
    "/cart/menu/Facials/s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d",
  )}&visitType=SELF_VISIT`,
};

/**
 * Resolve a service page slug to its booking destination.
 * Unlisted slugs use the generic widget — this fallback is intentional.
 */
export function bookingUrlForService(slug: string): string {
  return VERIFIED_SERVICE_BOOKING_URLS[slug] ?? BOOKING_URL_DEFAULT;
}
