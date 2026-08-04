import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "./page";
import BlogPage from "./blog/page";
import ServicesPage from "./services/page";
import { MembershipBanner } from "@/components/blocks/MembershipBanner";
import { testimonials } from "@/lib/data";

describe("homepage and catalog claim integrity", () => {
  it("uses verified physician-owner language without blanket supervision claims", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("Physician-Owned Aesthetic Care");
    expect(html).toContain("Zachary Wagner, DO");
    expect(html).toContain("American Board of Obesity Medicine diplomate");
    expect(html).toContain("dr-zachary-wagner.jpg");
    expect(html).not.toContain("Every treatment is physician-supervised");
    expect(html).not.toContain("artist&#x27;s eye");
  });

  it("keeps the homepage membership banner on the approved 2026 plan", () => {
    const html = renderToStaticMarkup(<MembershipBanner />);
    expect(html).toContain("$30/month");
    expect(html).toContain("$13/unit");
    expect(html).toContain("$4.40/unit");
    expect(html).toContain("one-year commitment");
    expect(html).not.toContain("complimentary treatments");
    expect(html).not.toContain("exclusive wellness benefits");
  });

  it("does not promise lasting results across every service", () => {
    const html = renderToStaticMarkup(<ServicesPage />);
    expect(html).toContain("consultation-led aesthetic, skin, wellness");
    expect(html).not.toContain("natural, lasting results");
  });

  it("preserves testimonial wording from the archived public source", () => {
    expect(testimonials).toEqual([
      expect.objectContaining({
        name: "Mrs. Fout",
        quote: expect.stringContaining("a little pampering at Rella Aesthetics"),
      }),
      expect.objectContaining({
        name: "Jenya Khranilov",
        quote: expect.stringContaining("I am so happy I found Rella Aesthetics"),
      }),
      expect.objectContaining({
        name: "Diamond Bolton",
        quote: expect.stringContaining("my treatment results"),
      }),
    ]);
  });
});

describe("education library integrity", () => {
  it("publishes a real local-search article and preserves verified service guides", async () => {
    const html = renderToStaticMarkup(await BlogPage());
    expect(html).toContain('href="/blog/botox-cost-napa"');
    expect(html).toContain("Botox in Napa: 2026 Pricing");
    expect(html).toContain('href="/services/botox"');
    expect(html).toContain('href="/services/weight-loss"');
    expect(html).toContain('href="/services/hydrafacial"');
    expect(html).toContain("Read the verified guide");
    expect(html).not.toContain("/blog/botox-vs-dysport");
    expect(html).not.toContain("/blog/semaglutide-weight-loss-guide");
    expect(html).not.toContain("These are placeholder articles");
  });
});
