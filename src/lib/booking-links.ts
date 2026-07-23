/**
 * Canonical booking destinations.
 *
 * Location-specific pages must link to their location's booking URL.
 * The custom booking app link (BOOKING_URL_NAPA_TOX) is used only where
 * the Napa New Patient Tox intent is explicit. Everything else uses
 * BOOKING_URL_DEFAULT (the business-level standard calendar).
 */

const BOULEVARD_WIDGET_BASE =
  "https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget";

export const BOOKING_URL_DEFAULT = BOULEVARD_WIDGET_BASE;

export const BOOKING_URL_NAPA = `${BOULEVARD_WIDGET_BASE}?locationId=91eba843-57fb-49e9-8505-431d501ffec7`;

export const BOOKING_URL_VACAVILLE = `${BOULEVARD_WIDGET_BASE}?locationId=0f146f87-364e-4dfd-b938-61ba49528820`;

export const BOOKING_URL_NAPA_TOX =
  "https://book.experiencerella.com/book/napa/botox";
