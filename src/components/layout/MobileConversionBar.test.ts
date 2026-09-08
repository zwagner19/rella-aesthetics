import { describe, expect, it } from "vitest";
import { resolveBookingHref } from "@/lib/booking-routes";
import { WEIGHT_LOSS_HOST } from "@/lib/site-hosts";
import {
  bookingIntentForPath,
  shouldShowMobileConversionBar,
} from "./MobileConversionBar";

describe("mobile conversion bar routing", () => {
  it("keeps ordinary pages eligible and suppresses protected experiences", () => {
    expect(shouldShowMobileConversionBar("/", "experiencerella.com")).toBe(true);
    expect(shouldShowMobileConversionBar("/about", "rella-nextjs.vercel.app")).toBe(true);
    expect(shouldShowMobileConversionBar("/", WEIGHT_LOSS_HOST)).toBe(false);
    expect(shouldShowMobileConversionBar("/services/weight-loss", "experiencerella.com")).toBe(false);
    expect(shouldShowMobileConversionBar("/napa/botox", "experiencerella.com")).toBe(false);
    expect(shouldShowMobileConversionBar("/contact", "experiencerella.com")).toBe(false);
  });

  it("preserves only safe location and category intent", () => {
    expect(bookingIntentForPath("/locations/napa")).toEqual({ location: "napa" });
    expect(bookingIntentForPath("/napa/facials")).toEqual({
      location: "napa",
      service: "facials",
    });
    expect(bookingIntentForPath("/vacaville/botox")).toEqual({
      location: "vacaville",
      service: "botox",
    });
    expect(bookingIntentForPath("/services/laser-treatments")).toEqual({
      service: "laser-treatments",
    });
    expect(bookingIntentForPath("/about")).toEqual({});

    expect(resolveBookingHref(bookingIntentForPath("/locations/napa"))).toBe(
      "https://book.experiencerella.com/book?location=napa",
    );
    expect(resolveBookingHref(bookingIntentForPath("/napa/facials"))).toBe(
      "https://book.experiencerella.com/book?location=napa&category=facials",
    );
    expect(resolveBookingHref(bookingIntentForPath("/vacaville/botox"))).toBe(
      "https://book.experiencerella.com/book?location=vacaville&category=injectables",
    );
  });
});
