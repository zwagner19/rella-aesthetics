import { describe, it, expect } from "vitest";
import {
  resolveBookingHref,
  CANONICAL_NAPA_TOX,
  BOOKING_LOCATION_CHOOSER,
  BOULEVARD_WIDGET_NAPA,
  BOULEVARD_WIDGET_VACAVILLE,
  WEIGHT_LOSS_BOOKING_ORIGIN,
  resolveWeightLossAssessmentHref,
  resolveWeightLossConsultHref,
} from "./booking-routes";

/**
 * Workstream D — cross-location / cross-service routing safety. Proves the
 * typed resolver never leaks Vacaville or generic CTAs into the Napa Tox app,
 * and that only an explicit Napa Tox/Botox intent reaches the canonical app.
 */

describe("resolveBookingHref — explicit Napa Tox", () => {
  it("napa + botox → canonical app", () => {
    expect(resolveBookingHref({ location: "napa", service: "botox" })).toBe(CANONICAL_NAPA_TOX);
  });
  it("napa + new-patient-tox → canonical app", () => {
    expect(resolveBookingHref({ location: "napa", service: "New Patient Tox" })).toBe(CANONICAL_NAPA_TOX);
  });
});

describe("resolveBookingHref — Napa non-Tox", () => {
  it("napa + hydrafacial → verified deep link pinned to the Napa locationId, NOT the Tox app", () => {
    const href = resolveBookingHref({ location: "napa", service: "hydrafacial" });
    expect(href).toContain("s_68b27f62");
    expect(href).toContain("locationId=91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
  });
  it("napa + facials → rendered Initial Skin Health Consult, NOT the Tox app", () => {
    const href = resolveBookingHref({ location: "napa", service: "facials" });
    expect(href).toContain("s_3ae8bab0-f23c-45d2-b265-3836289df3a1");
    expect(href).toContain("locationId=91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
    expect(href).not.toContain("0f146f87-364e-4dfd-b938-61ba49528820");
  });
  it("napa + unspecified service → Napa widget, NOT the Tox app", () => {
    const href = resolveBookingHref({ location: "napa" });
    expect(href).toBe(BOULEVARD_WIDGET_NAPA);
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
  });

  it.each([
    ["dermal-fillers", "s_e3564b2f"],
    ["laser-treatments", "%2Fcart%2Fmenu%2FLaser"],
    ["hyperhidrosis", "s_14029fc9"],
  ])("napa + %s → verified Napa acquisition path", (service, expected) => {
    const href = resolveBookingHref({ location: "napa", service });
    expect(href).toContain(expected);
    expect(href).toContain("locationId=91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
  });
});

describe("resolveBookingHref — Vacaville never reaches Napa Tox", () => {
  for (const service of [undefined, "anything"]) {
    it(`vacaville + ${service ?? "(none)"} → Vacaville widget`, () => {
      const href = resolveBookingHref({ location: "vacaville", service });
      expect(href).toBe(BOULEVARD_WIDGET_VACAVILLE);
      expect(href).not.toBe(CANONICAL_NAPA_TOX);
      expect(href).not.toContain("book.experiencerella.com");
    });
  }

  it.each(["botox", "tox", "new-patient-tox", "new-patient-botox"])(
    "routes Vacaville %s intent to the rendered New Patient Tox service",
    (service) => {
      const href = resolveBookingHref({ location: "vacaville", service });

      expect(href).toContain("s_2fee10b1-1831-4c00-83e9-9c05a7071b15");
      expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
      expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
      expect(href).not.toContain("book.experiencerella.com");
    },
  );

  it.each(["dermal-fillers", "filler"])(
    "routes Vacaville %s intent to the rendered Dermal Fillers service",
    (service) => {
      const href = resolveBookingHref({ location: "vacaville", service });

      expect(href).toContain("s_e3564b2f-c00d-47c2-8ca0-665b6d6f25e4");
      expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
      expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
      expect(href).not.toContain("book.experiencerella.com");
    },
  );

  it("routes Vacaville HydraFacial intent to the rendered Signature service", () => {
    const href = resolveBookingHref({
      location: "vacaville",
      service: "hydrafacial",
    });

    expect(href).toContain("s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d");
    expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
    expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toContain("book.experiencerella.com");
  });

  it("routes Vacaville facial intent to the rendered Initial Skin Health Consult", () => {
    const href = resolveBookingHref({
      location: "vacaville",
      service: "facials",
    });

    expect(href).toContain("s_3ae8bab0-f23c-45d2-b265-3836289df3a1");
    expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
    expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toContain("book.experiencerella.com");
  });

  it("routes Vacaville laser intent to the rendered Initial Laser Consult", () => {
    const href = resolveBookingHref({
      location: "vacaville",
      service: "laser-treatments",
    });

    expect(href).toContain("s_1328674e-c793-4b3c-833e-9a3827c5769b");
    expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
    expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toContain("book.experiencerella.com");
  });

  it("routes Vacaville microneedling intent to the rendered initial consult", () => {
    const href = resolveBookingHref({
      location: "vacaville",
      service: "microneedling",
    });

    expect(href).toContain("s_762959b6-0015-4904-be74-78d563b5651a");
    expect(href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
    expect(href).not.toContain("91eba843-57fb-49e9-8505-431d501ffec7");
    expect(href).not.toContain("book.experiencerella.com");
  });
});

describe("resolveBookingHref — generic (no location) never silently Napa Tox", () => {
  for (const service of [undefined, "botox", "tox", "new-patient-tox", "book"]) {
    it(`no-location + ${service ?? "(none)"} → generic/deeplink, never the Tox app`, () => {
      const href = resolveBookingHref({ service });
      expect(href).not.toBe(CANONICAL_NAPA_TOX);
      expect(href).not.toContain("book.experiencerella.com");
    });
  }
  it("no-location + hydrafacial → clinic chooser (never assumes Napa, even for a known service)", () => {
    expect(resolveBookingHref({ service: "hydrafacial" })).toBe(BOOKING_LOCATION_CHOOSER);
  });
  it("no-location, no service → first-party clinic chooser", () => {
    expect(resolveBookingHref({})).toBe(BOOKING_LOCATION_CHOOSER);
  });
});

describe("resolveBookingHref — dedicated medical-weight-loss funnel", () => {
  it("requires an explicit city before entering the dedicated booking app", () => {
    expect(resolveBookingHref({ service: "weight-loss" })).toBe(BOOKING_LOCATION_CHOOSER);
  });

  for (const location of ["napa", "vacaville"] as const) {
    it(`${location} medical weight loss → verified location-first consultation route`, () => {
      const expected = `${WEIGHT_LOSS_BOOKING_ORIGIN}/book/${location}/weight-loss-consult`;
      expect(resolveBookingHref({ location, service: "weight-loss" })).toBe(expected);
      expect(resolveWeightLossConsultHref(location)).toBe(expected);
    });

    it(`${location} assessment → verified city-scoped route`, () => {
      expect(resolveWeightLossAssessmentHref(location)).toBe(
        `${WEIGHT_LOSS_BOOKING_ORIGIN}/assessment/${location}`,
      );
    });
  }

  it("never regenerates the stale service-first paths that return 404", () => {
    const hrefs = [
      resolveWeightLossConsultHref("napa"),
      resolveWeightLossConsultHref("vacaville"),
      resolveWeightLossAssessmentHref("napa"),
      resolveWeightLossAssessmentHref("vacaville"),
    ];
    for (const href of hrefs) {
      expect(href).not.toContain("/book/weight-loss-consult/");
      expect(href).not.toContain("/assessment/weight-loss");
    }
  });
});

describe("resolveBookingHref — rendered Boulevard menu safety", () => {
  it.each([
    ["napa", BOULEVARD_WIDGET_NAPA],
    ["vacaville", BOULEVARD_WIDGET_VACAVILLE],
  ] as const)("%s generic clinic route carries the live menu path", (_location, href) => {
    expect(href).toContain("path=%2Fcart%2Fmenu");
    expect(href).toContain("visitType=SELF_VISIT");
  });

  it("keeps chemical peels on the verified Vacaville menu instead of the broken Peels deep link", () => {
    const href = resolveBookingHref({ location: "vacaville", service: "chemical-peels" });
    expect(href).toBe(BOULEVARD_WIDGET_VACAVILLE);
    expect(href).not.toContain("%2Fcart%2Fmenu%2FPeels");
  });
});
