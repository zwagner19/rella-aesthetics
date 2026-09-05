import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import legacyRedirects from "../../legacy-redirects.json";

const indexedWordPressPaths = [
  "/",
  "/about-us",
  "/become-a-vip",
  "/before-after",
  "/blog",
  "/blog/boost-your-immune-system-with-iv-vitamin-infusions",
  "/blog/botox-vs-dysport-which-is-right-for-you",
  "/blog/revolutionize-your-skin-microneedling-laser-for-a-radiant-glow",
  "/blog/semaglutide-weight-loss-consultation-what-to-expect",
  "/botox",
  "/cancellation-policy",
  "/chemical-peels",
  "/contact",
  "/dermal-fillers",
  "/facial-laser-treatment/choosing-the-right-facial-laser-treatment-for-your-skin-type",
  "/facial-laser-treatment/why-should-derma-facial-treatments-be-part-of-your-skincare-routine",
  "/facials",
  "/faq",
  "/giveaway-terms-and-conditions",
  "/hydrafacial",
  "/iv-hydration",
  "/laser-treatments",
  "/locations",
  "/locations/napa",
  "/locations/vacaville",
  "/membership",
  "/microneedling-for-acne-scar-treatment-vacaville-ca/how-does-microneedling-address-different-types-of-acne-scars",
  "/napa",
  "/napa/botox",
  "/napa/filler",
  "/napa/hydrafacial",
  "/napa/hyperhidrosis",
  "/napa/laser",
  "/our-team",
  "/payment-plans",
  "/privacy-policy",
  "/private-parties",
  "/radio-frequency-rf-microneedling",
  "/terms-and-conditions",
  "/testimonials",
  "/thank-you",
  "/weight-loss-treatment/the-role-of-massage-therapy-in-spa-weight-loss-treatment",
  "/weight-loss",
  "/wpbc-booking-received",
] as const;

const retainedIndexedRoutes = new Map<string, string>([
  ["/", "src/app/(site)/page.tsx"],
  ["/blog", "src/app/(site)/blog/page.tsx"],
  ["/cancellation-policy", "src/app/(site)/cancellation-policy/page.tsx"],
  ["/contact", "src/app/(site)/contact/page.tsx"],
  ["/giveaway-terms-and-conditions", "src/app/(site)/giveaway-terms-and-conditions/page.tsx"],
  ["/locations/napa", "src/app/(site)/locations/napa/page.tsx"],
  ["/locations/vacaville", "src/app/(site)/locations/vacaville/page.tsx"],
  ["/membership", "src/app/(site)/membership/page.tsx"],
  ["/napa/botox", "src/app/(campaign)/napa/botox/page.tsx"],
  ["/payment-plans", "src/app/(site)/payment-plans/page.tsx"],
  ["/privacy-policy", "src/app/(site)/privacy-policy/page.tsx"],
  ["/private-parties", "src/app/(site)/private-parties/page.tsx"],
  ["/wpbc-booking-received", "src/app/(site)/wpbc-booking-received/page.tsx"],
]);

describe("legacy WordPress URL continuity", () => {
  it("covers every one of the 44 indexed page and post paths", () => {
    expect(indexedWordPressPaths).toHaveLength(44);
    expect(new Set(indexedWordPressPaths).size).toBe(44);

    const redirectSources = new Set(legacyRedirects.map(({ source }) => source));
    for (const source of indexedWordPressPaths) {
      const outcomes = Number(redirectSources.has(source)) + Number(retainedIndexedRoutes.has(source));
      expect(outcomes, `${source} must have exactly one migration outcome`).toBe(1);
    }

    for (const [source, file] of retainedIndexedRoutes) {
      expect(existsSync(join(process.cwd(), file)), `${source} is missing ${file}`).toBe(true);
    }
  });

  it("keeps a unique internal redirect inventory without self redirects", () => {
    const sources = legacyRedirects.map(({ source }) => source);

    expect(legacyRedirects).toHaveLength(39);
    expect(new Set(sources).size).toBe(sources.length);
    for (const { source, destination } of legacyRedirects) {
      expect(source).toMatch(/^\/(?:[^/].*[^/]|[^/])$/);
      expect(destination).toMatch(/^\//);
      expect(destination).not.toBe(source);
      expect(destination).not.toMatch(/^https?:/);
    }
  });

  it("maps local Napa, sitemap, homepage alias, article, and legal gaps", () => {
    const map = new Map(legacyRedirects.map(({ source, destination }) => [source, destination]));

    expect(map.get("/napa")).toBe("/locations/napa");
    expect(map.get("/napa/hyperhidrosis")).toBe("/services/botox");
    expect(map.get("/napa/hydrafacial")).toBe("/services/hydrafacial");
    expect(map.get("/napa/filler")).toBe("/services/dermal-fillers");
    expect(map.get("/napa/laser")).toBe("/services/laser-treatments");
    expect(map.get("/terms-and-conditions")).toBe("/terms");
    expect(map.get("/thank-you")).toBe("/contact");
    expect(map.get("/sitemap_index.xml")).toBe("/sitemap.xml");
    expect(map.get("/wp-sitemap.xml")).toBe("/sitemap.xml");
    expect(map.get("/index.php/botox")).toBe("/services/botox");
    expect(map.get("/blog/semaglutide-weight-loss-consultation-what-to-expect")).toBe(
      "/services/weight-loss",
    );
    expect(map.has("/payment-plans")).toBe(false);
    expect(map.has("/giveaway-terms-and-conditions")).toBe(false);
    expect(map.has("/wpbc-booking-received")).toBe(false);
    expect(map.has("/events")).toBe(false);
    expect(map.has("/upcoming-events")).toBe(false);
  });

  it("expands every moved URL into permanent slash and slashless rules", async () => {
    const configured = await nextConfig.redirects?.();

    expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
    expect(configured).toHaveLength(legacyRedirects.length * 2);
    for (const { source, destination } of legacyRedirects) {
      expect(configured).toContainEqual({ source, destination, permanent: true });
      expect(configured).toContainEqual({ source: `${source}/`, destination, permanent: true });
    }
  });
});
