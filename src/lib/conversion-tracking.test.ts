import { describe, expect, it } from "vitest";
import {
  classifyConversionHref,
  conversionMeasurement,
  resolveMobileBookingDestination,
  shouldShowMobileConversionBar,
} from "./conversion-tracking";
import {
  BOOKING_LOCATION_CHOOSER,
  BOULEVARD_WIDGET_NAPA,
  BOULEVARD_WIDGET_VACAVILLE,
  CANONICAL_NAPA_TOX,
} from "./booking-routes";

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
      label: "See Consult Times",
      cta: "booking-flow-start",
    });
  });

  it("keeps location-page booking city-correct", () => {
    expect(resolveMobileBookingDestination("/locations/napa").href).toBe(
      BOULEVARD_WIDGET_NAPA,
    );
    expect(resolveMobileBookingDestination("/locations/vacaville").href).toBe(
      BOULEVARD_WIDGET_VACAVILLE,
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

  it("keeps the Vacaville Botox local page on the Vacaville booking path", () => {
    expect(resolveMobileBookingDestination("/vacaville/botox")).toEqual({
      href: BOULEVARD_WIDGET_VACAVILLE,
      label: "Book Vacaville",
      cta: "service-booking",
    });
  });

  it("keeps the Vacaville filler local page on the Vacaville booking path", () => {
    expect(resolveMobileBookingDestination("/vacaville/filler")).toEqual({
      href: BOULEVARD_WIDGET_VACAVILLE,
      label: "Book Vacaville",
      cta: "service-booking",
    });
  });

  it("keeps the Vacaville laser page on the rendered consult path", () => {
    const booking = resolveMobileBookingDestination("/vacaville/laser");

    expect(booking.label).toBe("Book Laser Consult");
    expect(booking.cta).toBe("service-booking");
    expect(booking.href).toContain("s_1328674e-c793-4b3c-833e-9a3827c5769b");
    expect(booking.href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
  });

  it("keeps the Vacaville HydraFacial page on the rendered Signature service", () => {
    const booking = resolveMobileBookingDestination("/vacaville/hydrafacial");

    expect(booking.label).toBe("Book Signature");
    expect(booking.cta).toBe("service-booking");
    expect(booking.href).toContain("s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d");
    expect(booking.href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
  });

  it("keeps the Vacaville chemical-peel page on the working clinic menu", () => {
    expect(resolveMobileBookingDestination("/vacaville/chemical-peels")).toEqual({
      href: BOULEVARD_WIDGET_VACAVILLE,
      label: "Open Peel Menu",
      cta: "service-booking",
    });
  });

  it("keeps the Vacaville microneedling page on the rendered initial consult", () => {
    const booking = resolveMobileBookingDestination("/vacaville/microneedling");

    expect(booking.label).toBe("Book Initial Consult");
    expect(booking.cta).toBe("service-booking");
    expect(booking.href).toContain("s_762959b6-0015-4904-be74-78d563b5651a");
    expect(booking.href).toContain("locationId=0f146f87-364e-4dfd-b938-61ba49528820");
  });
});
