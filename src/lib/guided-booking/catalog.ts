import type { BookingLocation } from "@/lib/booking-routes";
import type { GuidedLocation } from "./types";

/**
 * The two clinics the live catalog accepts. Service rows are not stored here.
 */
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

export function getGuidedLocation(
  slug: BookingLocation | null | undefined,
): GuidedLocation | null {
  if (!slug) return null;
  return GUIDED_LOCATIONS.find((location) => location.slug === slug) ?? null;
}
