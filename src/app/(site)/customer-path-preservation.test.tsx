import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PaymentPlansPage, { metadata as paymentMetadata } from "./payment-plans/page";
import PrivatePartiesPage, { metadata as partyMetadata } from "./private-parties/page";

describe("preserved customer information paths", () => {
  it("preserves the sourced private-event path without exposing ordinary booking", () => {
    const html = renderToStaticMarkup(<PrivatePartiesPage />);
    expect(html).toContain("Private Parties");
    expect(html).toContain("minimum of six people");
    expect(html).toContain("707.358.2928");
    expect(html).toContain('href="/contact?intent=private-parties"');
    expect(html).not.toMatch(/Anna|data-cta="book"|book\.experiencerella|Boulevard/i);
    expect(partyMetadata.alternates?.canonical).toBe("/private-parties");
  });

  it("preserves current Cherry transparency without inventing credit terms", () => {
    const html = renderToStaticMarkup(<PaymentPlansPage />);
    const widgetSource = readFileSync(
      "src/components/integrations/CherryFinancingWidget.tsx",
      "utf8",
    );
    expect(html).toContain("Cherry");
    expect(html).toContain("subject to approval");
    expect(html).toContain('id="all"');
    expect(html).toContain('href="/contact?intent=payment-plans"');
    expect(html).not.toMatch(/\bAPR\b|\$\d|months?\b|pre-?qualif|apply now/i);
    expect(widgetSource).toContain("https://files.withcherry.com/widgets/widget.js");
    expect(widgetSource).toContain('CHERRY_MERCHANT_SLUG = "experiencerella"');
    expect(widgetSource).toContain('["all"]');
    expect(widgetSource).not.toMatch(/email|phone|patient|diagnosis/i);
    expect(paymentMetadata.alternates?.canonical).toBe("/payment-plans");
  });

  it.each([
    renderToStaticMarkup(<PrivatePartiesPage />),
    renderToStaticMarkup(<PaymentPlansPage />),
  ])("renders one customer-facing H1", (html) => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
  });

  it("keeps both preserved paths in the acquisition sitemap", () => {
    const sitemapConfig = readFileSync("next-sitemap.config.js", "utf8");
    expect(sitemapConfig).toContain('"/private-parties"');
    expect(sitemapConfig).toContain('"/payment-plans"');
  });
});
