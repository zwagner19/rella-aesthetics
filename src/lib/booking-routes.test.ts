import { describe, expect, it } from "vitest";
import {
  BOOKING_LOCATION_CHOOSER,
  CANONICAL_NAPA_TOX,
  CUSTOM_BOOKING_ORIGIN,
  resolveBookingHref,
  resolveCustomBookingEntry,
  resolveWeightLossConsultHref,
  WEIGHT_LOSS_BOOKING_ORIGIN,
} from "./booking-routes";

describe("Rella-owned booking routing", () => {
  it("keeps explicit Napa New Patient Tox on its verified custom flow", () => {
    expect(resolveBookingHref({ location: "napa", service: "botox" })).toBe(
      CANONICAL_NAPA_TOX,
    );
    expect(CANONICAL_NAPA_TOX).toBe(
      "https://book.experiencerella.com/book/napa/botox",
    );
  });

  it.each([
    ["napa", "hydrafacial"],
    ["napa", "facials"],
    ["napa", "dermal-fillers"],
    ["napa", "iv-hydration"],
    ["napa", "laser-treatments"],
    ["napa", "hyperhidrosis"],
    ["vacaville", "botox"],
    ["vacaville", "dermal-fillers"],
    ["vacaville", "hydrafacial"],
    ["vacaville", "facials"],
    ["vacaville", "laser-treatments"],
    ["vacaville", "microneedling"],
    ["vacaville", "iv-hydration"],
    ["vacaville", "chemical-peels"],
  ] as const)("preserves %s/%s intent in the custom app", (location, service) => {
    const href = resolveBookingHref({ location, service });
    const url = new URL(href);
    expect(url.origin).toBe(CUSTOM_BOOKING_ORIGIN);
    expect(url.pathname).toBe("/book");
    expect(url.searchParams.get("location")).toBe(location);
    expect(url.searchParams.get("service")).toBe(service);
    expect(href).not.toMatch(/dashboard\.boulevard\.io|joinblvd\.com/);
  });

  it("preserves clinic intent even when no service was chosen", () => {
    expect(resolveBookingHref({ location: "napa" })).toBe(
      resolveCustomBookingEntry({ location: "napa" }),
    );
    expect(resolveBookingHref({ location: "vacaville" })).toBe(
      resolveCustomBookingEntry({ location: "vacaville" }),
    );
  });

  it("uses the website clinic chooser when no location is known", () => {
    expect(resolveBookingHref({})).toBe(BOOKING_LOCATION_CHOOSER);
    expect(resolveBookingHref({ service: "hydrafacial" })).toBe(
      BOOKING_LOCATION_CHOOSER,
    );
  });

  it("keeps both verified weight-loss routes on the dedicated custom app", () => {
    for (const location of ["napa", "vacaville"] as const) {
      const expected = `${WEIGHT_LOSS_BOOKING_ORIGIN}/book/${location}/weight-loss-consult`;
      expect(resolveWeightLossConsultHref(location)).toBe(expected);
      expect(
        resolveBookingHref({ location, service: "weight-loss" }),
      ).toBe(expected);
    }
  });

  it("contains no customer-facing Boulevard widget destination", () => {
    const destinations = [
      resolveBookingHref({}),
      resolveBookingHref({ location: "napa" }),
      resolveBookingHref({ location: "vacaville", service: "botox" }),
      resolveBookingHref({
        location: "vacaville",
        service: "chemical-peels",
      }),
    ];
    for (const href of destinations) {
      expect(href).not.toMatch(/dashboard\.boulevard\.io|joinblvd\.com/);
    }
  });
});
