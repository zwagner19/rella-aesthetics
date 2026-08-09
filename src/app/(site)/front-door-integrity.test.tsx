import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./page";
import BlogPage from "./blog/page";
import ServicesPage from "./services/page";
import { MembershipBanner } from "@/components/blocks/MembershipBanner";
import { testimonials } from "@/lib/data";

vi.mock("next/headers", () => ({
  headers: async () => new Headers([["host", "experiencerella.com"]]),
}));

describe("homepage and catalog claim integrity", () => {
  it("keeps the general homepage broad while containing medical authority inside weight loss", async () => {
    const html = renderToStaticMarkup(await HomePage());
    expect(html).toContain("Ageless Beauty");
    expect(html).toContain("American Board of Obesity Medicine diplomate");
    expect(html).toContain('href="/services/weight-loss"');
    expect(html).not.toContain("Every treatment is physician-supervised");
    expect(html).not.toContain("artist&#x27;s eye");
  });

  it("keeps the homepage membership banner on the approved 2026 plan", () => {
    const html = renderToStaticMarkup(<MembershipBanner />);
    expect(html).toContain("$30/month");
    expect(html).toContain("Tox, Filler, and Tox + Filler");
    expect(html).toContain("one-year terms");
    expect(html).toContain('href="/membership"');
    expect(html).not.toContain("complimentary treatments");
    expect(html).not.toContain("exclusive wellness benefits");
  });

  it("does not promise lasting results across every service", () => {
    const html = renderToStaticMarkup(<ServicesPage />);
    expect(html).toContain("consultation-led aesthetic, skin, wellness");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("<h1");
    expect(html).toContain("Our Services</h1>");
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
