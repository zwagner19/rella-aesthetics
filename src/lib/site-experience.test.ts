import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKING_LOCATION_CHOOSER } from "./booking-routes";
import { resolveGlobalBookingAction } from "./site-experience";

describe("global booking chrome separation", () => {
  it("keeps the weight-loss root inside its qualification-call funnel", () => {
    for (const path of [
      "/",
      "/medical-weight-loss-napa",
      "/medical-weight-loss-napa/",
      "/medical-weight-loss-vacaville",
      "/medical-weight-loss-vacaville/",
    ]) {
      expect(resolveGlobalBookingAction(path, true, "Book Consultation")).toEqual({
        href: "#consultation-options",
        label: "See Call Times",
        cta: "booking-flow-start",
      });
    }
  });

  it("returns other weight-loss-host routes to the approved landing-page section", () => {
    expect(resolveGlobalBookingAction("/about", true, "Book Online")).toEqual({
      href: "/#consultation-options",
      label: "See Call Times",
      cta: "booking-flow-start",
    });
  });

  it("uses the shared city-path contract in header and mobile chrome", () => {
    const root = join(__dirname, "..", "components", "layout");
    expect(readFileSync(join(root, "Header.tsx"), "utf8")).toContain(
      "isWeightLossLandingPath(pathname)",
    );
    expect(readFileSync(join(root, "MobileConversionBar.tsx"), "utf8")).toContain(
      "isWeightLossLandingPath(pathname)",
    );
  });

  it("leaves the general website on its first-party clinic chooser", () => {
    expect(resolveGlobalBookingAction("/", false, "Book Consultation")).toEqual({
      href: BOOKING_LOCATION_CHOOSER,
      label: "Book Consultation",
    });
  });
});
