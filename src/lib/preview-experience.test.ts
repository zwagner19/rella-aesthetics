import { describe, expect, it } from "vitest";
import {
  isPreviewExperienceHost,
  shouldOfferPreviewClinicChooser,
} from "./preview-experience";

describe("preview experience host boundary", () => {
  it("allows Vercel review aliases but never the public website", () => {
    expect(isPreviewExperienceHost("rella-aesthetics-git-review.vercel.app", "production")).toBe(true);
    expect(isPreviewExperienceHost("experiencerella.com", "development")).toBe(false);
    expect(isPreviewExperienceHost("www.experiencerella.com", "production")).toBe(false);
  });

  it("allows local QA only outside production", () => {
    expect(isPreviewExperienceHost("localhost:3000", "development")).toBe(true);
    expect(isPreviewExperienceHost("127.0.0.1:3000", "test")).toBe(true);
    expect(isPreviewExperienceHost("localhost:3000", "production")).toBe(false);
  });
});

describe("preview clinic chooser route boundary", () => {
  it.each([
    "/book",
    "/book/napa/botox",
    "/booking",
    "/contact",
    "/contact/thanks",
    "/privacy-policy",
    "/services/weight-loss",
    "/studio/desk",
    "/napa",
    "/napa/botox",
    "/napa/hydrafacial/",
  ])("stays off excluded context %s", (pathname) => {
    expect(shouldOfferPreviewClinicChooser(pathname)).toBe(false);
  });

  it.each(["/", "/about", "/services", "/locations/napa", "/napa/facials"])(
    "can appear on ordinary marketing route %s",
    (pathname) => {
      expect(shouldOfferPreviewClinicChooser(pathname)).toBe(true);
    },
  );

  it("stays out of attributed campaign visits", () => {
    expect(shouldOfferPreviewClinicChooser("/", "?gclid=paid-click")).toBe(false);
    expect(shouldOfferPreviewClinicChooser("/about", "utm_campaign=napa")).toBe(false);
    expect(shouldOfferPreviewClinicChooser("/services", "gad_campaignid=123")).toBe(false);
    expect(shouldOfferPreviewClinicChooser("/", "?ref=team-review")).toBe(true);
  });
});
