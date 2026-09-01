import { describe, expect, it } from "vitest";
import { BOOKING_LOCATION_CHOOSER } from "./booking-routes";
import { resolveGlobalBookingAction } from "./site-experience";

describe("global booking chrome separation", () => {
  it("keeps the weight-loss root inside its qualification-call funnel", () => {
    expect(resolveGlobalBookingAction("/", true, "Book Consultation")).toEqual({
      href: "#consultation-options",
      label: "See Call Times",
      cta: "booking-flow-start",
    });
  });

  it("returns other weight-loss-host routes to the approved landing-page section", () => {
    expect(resolveGlobalBookingAction("/about", true, "Book Online")).toEqual({
      href: "/#consultation-options",
      label: "See Call Times",
      cta: "booking-flow-start",
    });
  });

  it("leaves the general website on its first-party clinic chooser", () => {
    expect(resolveGlobalBookingAction("/", false, "Book Consultation")).toEqual({
      href: BOOKING_LOCATION_CHOOSER,
      label: "Book Consultation",
    });
  });
});
