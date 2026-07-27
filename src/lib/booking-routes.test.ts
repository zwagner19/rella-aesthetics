import { describe, it, expect } from "vitest";
import {
  resolveBookingHref,
  CANONICAL_NAPA_TOX,
  BOULEVARD_WIDGET_GENERIC,
  BOULEVARD_WIDGET_NAPA,
  BOULEVARD_WIDGET_VACAVILLE,
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
  it("napa + hydrafacial → verified deep link, NOT the Tox app", () => {
    const href = resolveBookingHref({ location: "napa", service: "hydrafacial" });
    expect(href).toContain("s_68b27f62");
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
  });
  it("napa + unspecified service → Napa widget, NOT the Tox app", () => {
    const href = resolveBookingHref({ location: "napa" });
    expect(href).toBe(BOULEVARD_WIDGET_NAPA);
    expect(href).not.toBe(CANONICAL_NAPA_TOX);
  });
});

describe("resolveBookingHref — Vacaville never reaches Napa Tox", () => {
  for (const service of [undefined, "botox", "new-patient-tox", "hydrafacial", "anything"]) {
    it(`vacaville + ${service ?? "(none)"} → Vacaville widget`, () => {
      const href = resolveBookingHref({ location: "vacaville", service });
      expect(href).toBe(BOULEVARD_WIDGET_VACAVILLE);
      expect(href).not.toBe(CANONICAL_NAPA_TOX);
      expect(href).not.toContain("book.experiencerella.com");
    });
  }
});

describe("resolveBookingHref — generic (no location) never silently Napa Tox", () => {
  for (const service of [undefined, "botox", "tox", "new-patient-tox", "book"]) {
    it(`no-location + ${service ?? "(none)"} → generic/deeplink, never the Tox app`, () => {
      const href = resolveBookingHref({ service });
      expect(href).not.toBe(CANONICAL_NAPA_TOX);
      expect(href).not.toContain("book.experiencerella.com");
    });
  }
  it("no-location + hydrafacial → verified deep link (service-specific, still not Tox)", () => {
    expect(resolveBookingHref({ service: "hydrafacial" })).toContain("s_68b27f62");
  });
  it("no-location, no service → generic business widget", () => {
    expect(resolveBookingHref({})).toBe(BOULEVARD_WIDGET_GENERIC);
  });
});
