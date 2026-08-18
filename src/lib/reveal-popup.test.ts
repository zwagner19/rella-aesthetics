import { describe, it, expect } from "vitest";
import {
  REVEAL_EXCLUDED_PATHS,
  REVEAL_SCROLL_THRESHOLD,
  REVEAL_TIME_DELAY_MS,
  isRevealEligiblePath,
} from "./reveal-popup";

describe("Rella Reveal popup (Pass 4)", () => {
  it("excludes booking, contact, and weight-loss funnel paths", () => {
    for (const path of REVEAL_EXCLUDED_PATHS) {
      expect(isRevealEligiblePath(path)).toBe(false);
    }
    expect(isRevealEligiblePath("/")).toBe(true);
    expect(isRevealEligiblePath("/services/botox")).toBe(true);
    expect(isRevealEligiblePath("/studio")).toBe(false);
  });

  it("uses a delayed trigger, not immediate display", () => {
    expect(REVEAL_TIME_DELAY_MS).toBeGreaterThanOrEqual(15_000);
    expect(REVEAL_SCROLL_THRESHOLD).toBeGreaterThan(0.2);
  });
});
