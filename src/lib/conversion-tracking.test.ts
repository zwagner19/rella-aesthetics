import { describe, expect, it } from "vitest";
import {
  classifyConversionHref,
  conversionMeasurement,
  resolveMobileBookingDestination,
  shouldShowMobileConversionBar,
} from "./conversion-tracking";
import {
  BOOKING_LOCATION_CHOOSER,
  CANONICAL_NAPA_TOX,
  resolveBookingHref,
} from "./booking-routes";

function expectCustomIntent(
  href: string,
  location: "napa" | "vacaville",
  service?: string,
) {
  const destination = new URL(href);
  expect(destination.hostname).toBe("book.experiencerella.com");
  expect(destination.searchParams.get("location")).toBe(location);
  expect(destination.searchParams.get("service")).toBe(service ?? null);
  expect(href).not.toContain("dashboard.boulevard.io");
}

describe("conversion intent classification", () => {
  it("separates booking, assessment, and funnel-start intent", () => {
    expect(classifyConversionHref(BOOKING_LOCATION_CHOOSER)).toBe("booking_flow_start");
    expect(
      classifyConversionHref(
        "https://book.rellaweightloss.com/assessment/napa",
        "weight-loss-assessment",
      ),
    ).toBe("assessment_intent");
    expect(
      classifyConversionHref("#consultation-options", "booking-flow-start"),
    ).toBe("booking_flow_start");
    expect(classifyConversionHref(CANONICAL_NAPA_TOX)).toBe("booking_intent");
  });

  it("measures direct calls, email, and contact without counting ordinary navigation", () => {
    expect(classifyConversionHref("tel:+17073582928")).toBe("phone_intent");
    expect(classifyConversionHref("mailto:info@experiencerella.com")).toBe("email_intent");
    expect(classifyConversionHref("/contact")).toBe("contact_intent");
    expect(classifyConversionHref("/services/botox")).toBeNull();
    expect(
      classifyConversionHref("https://dashboard.boulevard.io/booking/businesses/example/widget"),
    ).toBeNull();
    expect(classifyConversionHref("https://www.joinblvd.com/b/example/widget")).toBeNull();
  });

  it("reserves generate_lead for a lead that was actually submitted", () => {
    expect(conversionMeasurement("contact_form_success").gaEvent).toBe("generate_lead");
    expect(conversionMeasurement("booking_intent").gaEvent).toBe("select_content");
    expect(conversionMeasurement("booking_intent").metaStandard).toBe(false);
  });
});

describe("mobile booking bar routing", () => {
  it("stays out of the way on clinic choice, contact, policy, and archive pages", () => {
    expect(shouldShowMobileConversionBar("/book")).toBe(false);
    expect(shouldShowMobileConversionBar("/contact")).toBe(false);
    expect(shouldShowMobileConversionBar("/cancellation-policy")).toBe(false);
    expect(shouldShowMobileConversionBar("/privacy-policy")).toBe(false);
    expect(shouldShowMobileConversionBar("/terms")).toBe(false);
    expect(shouldShowMobileConversionBar("/giveaway-terms-and-conditions")).toBe(false);
    expect(shouldShowMobileConversionBar("/")).toBe(true);
    expect(shouldShowMobileConversionBar("/services/botox")).toBe(true);
  });

  it("keeps weight-loss visitors inside the city-choice funnel", () => {
    expect(resolveMobileBookingDestination("/services/weight-loss")).toEqual({
      href: "#consultation-options",
      label: "See Call Times",
      cta: "booking-flow-start",
    });
  });

  it("keeps location-page booking city-correct", () => {
    expectCustomIntent(
      resolveMobileBookingDestination("/locations/napa").href,
      "napa",
    );
    expectCustomIntent(
      resolveMobileBookingDestination("/locations/vacaville").href,
      "vacaville",
    );
  });

  it("uses the first-party clinic chooser elsewhere", () => {
    expect(resolveMobileBookingDestination("/").href).toBe(
      BOOKING_LOCATION_CHOOSER,
    );
  });

  it("keeps service-page visitors in the explicit clinic-choice flow", () => {
    expect(resolveMobileBookingDestination("/services/botox")).toEqual({
      href: "#book-service",
      label: "Choose a Clinic",
      cta: "booking-flow-start",
    });
    expect(resolveMobileBookingDestination("/services/iv-hydration")).toEqual({
      href: "#book-service",
      label: "Choose a Clinic",
      cta: "booking-flow-start",
    });
  });

  it("does not present a false city choice for Vacaville-only chemical peels", () => {
    expect(resolveMobileBookingDestination("/services/chemical-peels")).toEqual({
      href: "#book-service",
      label: "Book Vacaville",
      cta: "booking-flow-start",
    });
  });

  it("does not present a false city choice for Vacaville-only microneedling", () => {
    expect(resolveMobileBookingDestination("/services/microneedling")).toEqual({
      href: "#book-service",
      label: "Book Vacaville",
      cta: "booking-flow-start",
    });
  });

  it("turns the Napa Botox pricing article into a Napa-specific booking path", () => {
    expect(resolveMobileBookingDestination("/blog/botox-cost-napa")).toEqual({
      href: CANONICAL_NAPA_TOX,
      label: "Book Napa Botox",
      cta: "service-booking",
    });
  });

  it("keeps the Vacaville Botox page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/botox");

    expect(booking.label).toBe("Book New Patient Tox");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "botox");
  });

  it("keeps the Vacaville filler page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/filler");

    expect(booking.label).toBe("Book Dermal Fillers");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "dermal-fillers");
  });

  it("keeps the Vacaville laser page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/laser");

    expect(booking.label).toBe("Book Laser Consult");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "laser-treatments");
  });

  it("keeps the Vacaville HydraFacial page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/hydrafacial");

    expect(booking.label).toBe("Book Signature");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "hydrafacial");
  });

  it("keeps the Vacaville facials page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/facials");

    expect(booking.label).toBe("Book Skin Consult");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "facials");
  });

  it("keeps the Vacaville chemical-peel page on the custom service intent", () => {
    expect(resolveMobileBookingDestination("/vacaville/chemical-peels")).toEqual({
      href: resolveBookingHref({
        location: "vacaville",
        service: "chemical-peels",
      }),
      label: "Open Peel Menu",
      cta: "service-booking",
    });
  });

  it("keeps the Vacaville microneedling page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/vacaville/microneedling");

    expect(booking.label).toBe("Book Initial Consult");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "vacaville", "microneedling");
  });

  it("keeps the Napa facials page on the custom service intent", () => {
    const booking = resolveMobileBookingDestination("/napa/facials");

    expect(booking.label).toBe("Book Skin Consult");
    expect(booking.cta).toBe("service-booking");
    expectCustomIntent(booking.href, "napa", "facials");
  });
});
