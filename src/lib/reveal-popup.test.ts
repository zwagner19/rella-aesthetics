import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  REVEAL_EXCLUDED_PATHS,
  REVEAL_OFFER_HEADLINE,
  REVEAL_SCROLL_THRESHOLD,
  REVEAL_TIME_DELAY_MS,
  REVEAL_INTEREST_OPTIONS,
  buildRevealThankYouPath,
  isRevealEligiblePath,
  isRevealInterestId,
  resolveRevealInterestBookingHref,
} from "./reveal-popup";

const ROOT = join(__dirname, "..", "..");

describe("Rella Reveal popup", () => {
  it("excludes booking, contact, weight-loss funnel, and thank-you paths", () => {
    for (const path of REVEAL_EXCLUDED_PATHS) {
      expect(isRevealEligiblePath(path)).toBe(false);
    }
    expect(isRevealEligiblePath("/")).toBe(true);
    expect(isRevealEligiblePath("/services/botox")).toBe(true);
    expect(isRevealEligiblePath("/studio")).toBe(false);
    expect(isRevealEligiblePath("/rella-reveal/thank-you")).toBe(false);
  });

  it("uses a 30–45 second delayed trigger and 40% scroll threshold", () => {
    expect(REVEAL_TIME_DELAY_MS).toBeGreaterThanOrEqual(30_000);
    expect(REVEAL_TIME_DELAY_MS).toBeLessThanOrEqual(45_000);
    expect(REVEAL_SCROLL_THRESHOLD).toBe(0.4);
  });

  it("maps each interest to a booking handoff", () => {
    expect(resolveRevealInterestBookingHref("fine-lines")).toContain("book.experiencerella.com");
    expect(resolveRevealInterestBookingHref("texture")).toContain("boulevard.io");
    expect(resolveRevealInterestBookingHref("weight-loss")).toBe(
      "/services/weight-loss#consultation-options",
    );
    expect(resolveRevealInterestBookingHref("guidance")).toContain("boulevard.io");
  });

  it("exposes six interest options including guidance", () => {
    expect(REVEAL_INTEREST_OPTIONS).toHaveLength(6);
    expect(isRevealInterestId("guidance")).toBe(true);
    expect(buildRevealThankYouPath("texture")).toBe("/rella-reveal/thank-you?interest=texture");
  });

  it("does not use gamified wheel or scratch mechanics in the dialog", () => {
    const dialog = readFileSync(
      join(ROOT, "src/components/marketing/RellaRevealDialog.tsx"),
      "utf8",
    );
    expect(REVEAL_OFFER_HEADLINE).toBe("Unlock your Rella Reveal");
    expect(dialog).toContain("REVEAL_OFFER_HEADLINE");
    expect(dialog).toContain("REVEAL_OFFER_DETAIL");
    expect(dialog).toContain("$50 credit");
    expect(dialog).not.toMatch(/spin|wheel|scratch|casino/i);
    expect(dialog).toContain("mouseleave");
  });
});
