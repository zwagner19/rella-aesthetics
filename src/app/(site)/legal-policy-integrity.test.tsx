import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CancellationPolicyPage, {
  metadata as cancellationMetadata,
} from "./cancellation-policy/page";
import TermsPage from "./terms/page";
import { Footer } from "@/components/layout/Footer";
import { CANCELLATION_POLICY } from "@/lib/napa-botox-facts";

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&apos;|&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

const cancellationHtml = renderToStaticMarkup(<CancellationPolicyPage />);
const cancellationText = visibleText(cancellationHtml);
const termsHtml = renderToStaticMarkup(<TermsPage />);
const termsText = visibleText(termsHtml);

describe("public cancellation-policy integrity", () => {
  it("publishes the approved 48-hour policy verbatim", () => {
    expect(cancellationText).toContain(CANCELLATION_POLICY);
    expect(cancellationText).toContain("at least 48 hours");
    expect(cancellationText).toContain("Emergencies are reviewed individually");
    expect(cancellationText.indexOf("Napa New-Patient Tox Appointments")).toBeLessThan(
      cancellationText.indexOf(CANCELLATION_POLICY),
    );
    expect([...cancellationHtml.matchAll(/<h1\b/g)]).toHaveLength(1);
  });

  it("keeps the Napa booking deposit separate from treatment pricing", () => {
    expect(cancellationText).toContain("$50 booking deposit");
    expect(cancellationText).toContain("separate from per-unit treatment pricing");
    expect(cancellationText).not.toMatch(
      /(?:credited|applied|refundable|transferrable|transferable) (?:to|toward|towards|against)/i,
    );
  });

  it("removes the unsupported sitewide 24-hour and generic fee claims", () => {
    for (const text of [termsText, cancellationText]) {
      expect(text).not.toContain("24 hours");
      expect(text).not.toContain("subject to a fee");
    }
    expect(termsHtml).toContain('href="/cancellation-policy"');
  });

  it("has a stable canonical and direct contact paths", () => {
    expect(cancellationMetadata.alternates?.canonical).toBe("/cancellation-policy");
    expect(cancellationHtml).toContain('href="tel:+17073582928"');
    expect(cancellationHtml).toContain('href="/contact"');
  });

  it("keeps the policy discoverable from the ordinary-site footer", () => {
    const footerHtml = renderToStaticMarkup(<Footer />);
    expect(footerHtml).toContain('href="/cancellation-policy"');
    expect(footerHtml).toContain('href="https://www.instagram.com/experiencerella/"');
    expect(footerHtml).toContain('href="https://www.facebook.com/rellaaesthetics/"');
    expect(footerHtml).toContain('href="/team"');
    expect(footerHtml).toContain("Reviews shared on this site span both Rella locations");
    expect(footerHtml).toContain("Individual results vary");
    expect(footerHtml).toContain("pb-28 pt-16 text-ink xl:pb-8");
  });
});
