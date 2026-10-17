import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PackagePanel, type PackagePanelProps } from "./PackagePanel";
import type { PackagePurchaseReview } from "@/lib/guided-booking/package-client";

const review: PackagePurchaseReview = {
  offering: { id: "opaque-package", displayName: "Laser package | $600", description: "Treatment details from the verified catalog.", benefitGroups: [{ quantity: 3, alternatives: ["Laser A", "Laser B"] }] },
  totalCents: 60000,
  currency: "USD",
  needsCard: true,
  cardFrameOrigin: "https://secure.example.test",
};
const actions: Omit<PackagePanelProps, "view"> = {
  onIntent: () => {}, onLocation: () => {}, onOffering: () => {}, onReviewContinue: () => {},
  onContact: () => {}, onPrepare: async () => {}, onPurchase: async () => {}, onOwnedSession: () => {},
};

describe("package presentation", () => {
  it("separates buying a package from booking sessions already owned", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "intent" }} />);
    expect(html).toContain("Buy a package");
    expect(html).toContain("Book from my package");
  });

  it("does not expose package prices or descriptions before selection, including accessible labels", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "catalog", location: "napa", offerings: [review.offering], loading: false }} />);
    expect(html).toContain('aria-label="Review Laser package"');
    expect(html).not.toContain("$600");
    expect(html).not.toContain("Treatment details");
  });

  it("shows the exact full purchase total and treats alternatives as OR within their shared quantity", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "review", location: "napa", review }} />);
    expect(html).toContain("Package purchase total: $600.00");
    expect(html).toContain("3 sessions");
    expect(html).toMatch(/Laser A.*> or <.*Laser B/);
    expect(html).not.toContain(" and ");
    expect(html).not.toContain("deposit");
  });

  it("blocks continuation for an unverified total rather than calculating a replacement", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "review", location: "vacaville", review: { ...review, totalCents: -1 } }} />);
    expect(html).toContain("The package total could not be verified");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Continue to purchase/);
  });

  it("renders terminal uncertainty without purchase, navigation, or retry controls", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "pending" }} />);
    expect(html).toContain("Package verification pending");
    expect(html).toContain("before trying again");
    expect(html).not.toContain("<button");
  });

  it("uses mobile-safe contact inputs and the real secure-card component boundary", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "contact", location: "napa", review, contact: { firstName: "", lastName: "", email: "", phone: "" } }} />);
    const inputs = html.match(/<input\b[^>]*>/g) ?? [];
    expect(inputs).toHaveLength(4);
    for (const input of inputs) {
      expect(input).toContain("min-h-11");
      expect(input).toContain("text-base");
      expect(input).toContain("sm:text-sm");
    }
    expect(html).not.toContain('name="cardNumber"');
    expect(html).not.toContain('name="cvc"');
    expect(html).toContain("Review total and payment");
  });

  it("requires the supplied ownership-verification flow before showing balances", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "verify-ownership", location: "vacaville", verification: <div>Verified authentication controls</div> }} />);
    expect(html).toContain("Verify your account");
    expect(html).toContain("Verified authentication controls");
    expect(html).not.toContain("sessions remaining");
    expect(html).not.toContain("voucher redeemed");
  });

  it("shows only server-returned unused voucher rows and their treatment alternatives without claiming redemption", () => {
    const html = renderToStaticMarkup(<PackagePanel {...actions} view={{ step: "owned", location: "napa", wallet: {
      location: "napa", profile: { name: "Test Profile" }, redemption: "STAFF_CHECKOUT", vouchers: [
        { id: "opaque-voucher", title: "Native package", expiresOn: "2027-01-01", eligibleAtLocation: true, restrictions: [], services: [
          { key: "napa/treatment-a", name: "Treatment A", category: "Laser" }, { key: "napa/treatment-b", name: "Treatment B", category: "Laser" },
        ] },
      ],
    } }} />);
    expect(html.match(/Book a session/g)).toHaveLength(2);
    expect(html).toContain("Choose one of the covered treatments");
    expect(html).toContain("The team applies your package at your appointment");
    expect(html).toContain("Jan 1, 2027");
    expect(html).not.toContain("sessions remaining");
    expect(html).not.toContain("redeemed");
  });
});
