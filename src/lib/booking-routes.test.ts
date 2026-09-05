import { describe, expect, it } from "vitest";
import {
  AESTHETICS_BOOKING_ORIGIN,
  BOOKING_LOCATION_CHOOSER,
  CANONICAL_NAPA_TOX,
  WEIGHT_LOSS_BOOKING_ORIGIN,
  resolveBookingChooserHref,
  resolveBookingHref,
  resolveWeightLossConsultHref,
} from "./booking-routes";

describe("canonical public booking routing", () => {
  it("uses the branded booking app for generic CTAs", () => {
    expect(AESTHETICS_BOOKING_ORIGIN).toBe(
      "https://book.experiencerella.com",
    );
    expect(BOOKING_LOCATION_CHOOSER).toBe(
      "https://book.experiencerella.com/book",
    );
    expect(resolveBookingHref()).toBe(BOOKING_LOCATION_CHOOSER);
    expect(resolveBookingHref({})).toBe(BOOKING_LOCATION_CHOOSER);
  });

  it("keeps explicit Napa New Patient Tox on its verified exact flow", () => {
    expect(CANONICAL_NAPA_TOX).toBe(
      "https://book.experiencerella.com/book/napa/botox",
    );
    for (const service of [
      "botox",
      "tox",
      "New Patient Tox",
      "new-patient-botox",
      "napa-botox",
    ]) {
      expect(resolveBookingHref({ location: "napa", service })).toBe(
        CANONICAL_NAPA_TOX,
      );
    }
  });

  it.each([
    ["botox", "injectables"],
    ["dermal-fillers", "injectables"],
    ["hyperhidrosis", "injectables"],
    ["laser-treatments", "laser"],
    ["microneedling", "microneedling"],
    ["facials", "facials"],
    ["hydrafacial", "facials"],
    ["chemical-peels", "peels"],
  ] as const)(
    "maps broad %s intent to the %s chooser without selecting an appointment",
    (service, category) => {
      expect(resolveBookingHref({ service })).toBe(
        `${BOOKING_LOCATION_CHOOSER}?category=${category}`,
      );
      expect(
        resolveBookingHref({ location: "vacaville", service }),
      ).toBe(
        `${BOOKING_LOCATION_CHOOSER}?location=vacaville&category=${category}`,
      );
    },
  );

  it("supports the booking app's explicit category chooser contract", () => {
    for (const category of [
      "injectables",
      "laser",
      "microneedling",
      "facials",
      "peels",
    ] as const) {
      expect(resolveBookingChooserHref({ category })).toBe(
        `${BOOKING_LOCATION_CHOOSER}?category=${category}`,
      );
      expect(
        resolveBookingChooserHref({ location: "napa", category }),
      ).toBe(
        `${BOOKING_LOCATION_CHOOSER}?location=napa&category=${category}`,
      );
    }
  });

  it("keeps Napa broad non-Tox services on category chooser routes", () => {
    expect(
      resolveBookingHref({ location: "napa", service: "hydrafacial" }),
    ).toBe(`${BOOKING_LOCATION_CHOOSER}?location=napa&category=facials`);
    expect(
      resolveBookingHref({ location: "napa", service: "dermal-fillers" }),
    ).toBe(`${BOOKING_LOCATION_CHOOSER}?location=napa&category=injectables`);
  });

  it("preserves clinic intent without inventing unsupported service/category routes", () => {
    expect(resolveBookingHref({ location: "napa" })).toBe(
      `${BOOKING_LOCATION_CHOOSER}?location=napa`,
    );
    expect(resolveBookingHref({ location: "vacaville" })).toBe(
      `${BOOKING_LOCATION_CHOOSER}?location=vacaville`,
    );
    expect(resolveBookingHref({ service: "iv-hydration" })).toBe(
      BOOKING_LOCATION_CHOOSER,
    );
    expect(resolveBookingHref({ service: "weight-loss" })).toBe(
      BOOKING_LOCATION_CHOOSER,
    );
    expect(
      resolveBookingHref({ location: "vacaville", service: "unknown" }),
    ).toBe(`${BOOKING_LOCATION_CHOOSER}?location=vacaville`);
  });

  it("uses the verified dedicated weight-loss consultation routes", () => {
    expect(WEIGHT_LOSS_BOOKING_ORIGIN).toBe(
      "https://book.rellaweightloss.com",
    );
    expect(resolveWeightLossConsultHref("napa")).toBe(
      "https://book.rellaweightloss.com/book/napa/weight-loss-consult",
    );
    expect(resolveWeightLossConsultHref("vacaville")).toBe(
      "https://book.rellaweightloss.com/book/vacaville/weight-loss-consult",
    );
    expect(resolveBookingHref({ location: "napa", service: "weight-loss" })).toBe(
      "https://book.rellaweightloss.com/book/napa/weight-loss-consult",
    );
    expect(
      resolveBookingHref({
        location: "vacaville",
        service: "medical-weight-loss",
      }),
    ).toBe(
      "https://book.rellaweightloss.com/book/vacaville/weight-loss-consult",
    );
  });

  it("allows only the reviewed public host/path matrix", () => {
    const destinations = [
      resolveBookingHref({}),
      resolveBookingHref({ service: "hydrafacial" }),
      resolveBookingHref({ location: "napa" }),
      resolveBookingHref({ location: "vacaville", service: "botox" }),
      resolveBookingHref({ location: "napa", service: "botox" }),
      resolveBookingHref({ location: "napa", service: "weight-loss" }),
      resolveBookingHref({
        location: "vacaville",
        service: "weight-loss",
      }),
    ];

    for (const destination of destinations) {
      const url = new URL(destination);
      expect([
        "book.experiencerella.com",
        "book.rellaweightloss.com",
      ]).toContain(url.hostname);
      expect(destination).not.toMatch(
        /dashboard\.boulevard\.io|joinblvd\.com|rella-hq/i,
      );
      if (url.hostname === "book.rellaweightloss.com") {
        expect([
          "/book/napa/weight-loss-consult",
          "/book/vacaville/weight-loss-consult",
        ]).toContain(url.pathname);
      } else {
        expect(["/book", "/book/napa/botox"]).toContain(url.pathname);
      }
      expect(url.searchParams.has("service")).toBe(false);
    }
  });
});
