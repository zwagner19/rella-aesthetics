import { describe, expect, it } from "vitest";
import { metadata } from "./page";
import {
  PREPAID_PACKAGE_POLICY,
  PREPAID_PACKAGE_TIMING_POLICY,
  UNIVERSAL_PEEL_POLICY,
} from "./policy-copy";

describe("cancellation policy", () => {
  it("publishes the prepaid-package and Universal Peel $50 reservation rules", () => {
    expect(metadata.alternates?.canonical).toBe("/cancellation-policy");
    expect(PREPAID_PACKAGE_POLICY).toContain(
      "prepaid treatment package require a $50 reservation deposit",
    );
    expect(PREPAID_PACKAGE_POLICY).toContain("added to your Boulevard account credit");
    expect(PREPAID_PACKAGE_POLICY).toContain("kept on file to reserve your next appointment");
    expect(PREPAID_PACKAGE_POLICY).toContain("refunded on request");
    expect(PREPAID_PACKAGE_TIMING_POLICY).toContain("cancellation or reschedule within 48 hours");
    expect(PREPAID_PACKAGE_TIMING_POLICY).toContain("A no-show also forfeits the deposit");
    expect(UNIVERSAL_PEEL_POLICY).toContain("Universal Peel requires a $50 reservation deposit");
    expect(UNIVERSAL_PEEL_POLICY).toContain("not a $100 deposit");
  });
});
