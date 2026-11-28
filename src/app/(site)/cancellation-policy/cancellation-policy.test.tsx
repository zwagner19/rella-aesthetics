import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CancellationPolicyPage from "./page";
import { metadata } from "./page";
import {
  PREPAID_PACKAGE_POLICY,
  PREPAID_PACKAGE_TIMING_POLICY,
  STANDARD_BOOKING_POLICY,
} from "./policy-copy";

describe("cancellation policy", () => {
  it("publishes the standard and prepaid-package reservation rules", () => {
    const pageSource = readFileSync(
      resolve(process.cwd(), "src/app/(site)/cancellation-policy/page.tsx"),
      "utf8",
    );

    expect(metadata.alternates?.canonical).toBe("/cancellation-policy");
    expect(pageSource).toContain("<p>{STANDARD_BOOKING_POLICY}</p>");
    expect(pageSource).toContain("<p>{PREPAID_PACKAGE_POLICY}</p>");
    expect(pageSource).toContain("<p>{PREPAID_PACKAGE_TIMING_POLICY}</p>");
    expect(pageSource).not.toContain("Universal Peel");
    expect(STANDARD_BOOKING_POLICY).toContain(
      "All consultations, and appointments priced at $100 or more, require a $100 reservation deposit",
    );
    expect(PREPAID_PACKAGE_POLICY).toContain(
      "verifies that an appointment redeems an existing prepaid treatment package",
    );
    expect(PREPAID_PACKAGE_POLICY).toContain("a $50 reservation deposit is required");
    expect(PREPAID_PACKAGE_POLICY).toContain("added to your Boulevard account credit");
    expect(PREPAID_PACKAGE_POLICY).toContain("kept on file to reserve your next appointment");
    expect(PREPAID_PACKAGE_POLICY).toContain("refunded on request");
    expect(PREPAID_PACKAGE_TIMING_POLICY).toContain("cancellation or reschedule within 48 hours");
    expect(PREPAID_PACKAGE_TIMING_POLICY).toContain("A no-show also forfeits the deposit");
    expect(PREPAID_PACKAGE_TIMING_POLICY).toContain("redeems the prepaid package");
  });

  it("renders the complete 48-hour cancellation, reschedule, and no-show rule", () => {
    const rendered = renderToStaticMarkup(<CancellationPolicyPage />)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    expect(rendered).toContain("cancel or reschedule");
    expect(rendered).toContain("within 48 hours, or for a no-show");
    expect(rendered).toContain("All consultations, and appointments priced at $100 or more");
    expect(rendered).not.toContain("Universal Peel");
    expect(rendered).not.toContain("A $50 booking deposit is charged");
  });
});
