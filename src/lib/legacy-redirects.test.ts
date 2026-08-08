import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import legacyRedirects from "../../legacy-redirects.json";

describe("legacy WordPress redirect inventory", () => {
  it("keeps a unique, slashless, internal source of truth without self redirects", () => {
    const sources = legacyRedirects.map(({ source }) => source);

    expect(new Set(sources).size).toBe(sources.length);
    for (const { source, destination } of legacyRedirects) {
      expect(source).toMatch(/^\/(?:[^/].*[^/]|[^/])$/);
      expect(destination).toMatch(/^\//);
      expect(destination).not.toBe(source);
      expect(destination).not.toMatch(/^https?:/);
    }
  });

  it("maps the live WordPress service, company, conversion, and article gaps", () => {
    const map = new Map(legacyRedirects.map(({ source, destination }) => [source, destination]));

    expect(map.get("/about-us")).toBe("/about");
    expect(map.get("/our-team")).toBe("/about");
    expect(map.get("/chemical-peels")).toBe("/services/chemical-peels");
    expect(map.get("/facials")).toBe("/services/facials");
    expect(map.get("/radio-frequency-rf-microneedling")).toBe("/services/microneedling");
    expect(map.get("/become-a-vip")).toBe("/membership");
    expect(map.get("/payment-plans")).toBe("/contact");
    expect(map.get("/before-after")).toBe("/gallery");
    expect(map.get("/blog/semaglutide-weight-loss-consultation-what-to-expect")).toBe(
      "/services/weight-loss",
    );
    expect(map.get("/blog/botox-vs-dysport-which-is-right-for-you")).toBe(
      "/services/botox",
    );
  });

  it("expands each audited source into permanent slash and slashless rules", async () => {
    const configured = await nextConfig.redirects?.();

    expect(configured).toHaveLength(legacyRedirects.length * 2);
    for (const { source, destination } of legacyRedirects) {
      expect(configured).toContainEqual({ source, destination, permanent: true });
      expect(configured).toContainEqual({ source: `${source}/`, destination, permanent: true });
    }
  });
});
