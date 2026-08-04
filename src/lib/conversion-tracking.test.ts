import { describe, expect, it } from "vitest";
import {
  classifyConversionHref,
  conversionMeasurement,
  resolveMobileBookingDestination,
} from "./conversion-tracking";
import {
  BOULEVARD_WIDGET_GENERIC,
  BOULEVARD_WIDGET_NAPA,
  BOULEVARD_WIDGET_VACAVILLE,
} from "./booking-routes";

describe("conversion intent classification", () => {
  it("separates booking, assessment, and funnel-start intent", () => {
    expect(classifyConversionHref(BOULEVARD_WIDGET_GENERIC)).toBe("booking_intent");
    expect(
      classifyConversionHref(
        "https://book.rellaweightloss.com/assessment/napa",
        "weight-loss-assessment",
      ),
    ).toBe("assessment_intent");
    expect(
      classifyConversionHref("#consultation-options", "booking-flow-start"),
    ).toBe("booking_flow_start");
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

  it("uses the safe generic widget elsewhere", () => {
    expect(resolveMobileBookingDestination("/").href).toBe(
      BOULEVARD_WIDGET_GENERIC,
    );
  });

  it("keeps the mobile action aligned with the service being viewed", () => {
    expect(resolveMobileBookingDestination("/services/botox")).toEqual({
      href: BOULEVARD_WIDGET_GENERIC,
      label: "Book Botox",
      cta: "service-booking",
    });
    expect(resolveMobileBookingDestination("/services/iv-hydration").label).toBe(
      "Book IV Hydration",
    );
  });
});
