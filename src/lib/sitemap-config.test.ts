import type { AdditionalPathsConfig, ISitemapField } from "next-sitemap";
import { describe, expect, it } from "vitest";
import sitemapConfig from "../../next-sitemap.config.js";

describe("generated sitemap contract", () => {
  it("does not fabricate last-modified dates from the build clock", () => {
    expect(sitemapConfig.autoLastmod).toBe(false);
  });

  it("always adds the homepage and every canonical local landing page", async () => {
    const additionalPaths = sitemapConfig.additionalPaths;
    const transform = sitemapConfig.transform;
    expect(additionalPaths).toBeTypeOf("function");
    expect(transform).toBeTypeOf("function");
    if (!additionalPaths || !transform) throw new Error("Sitemap callbacks are required");

    const config = { ...sitemapConfig, transform } as AdditionalPathsConfig;
    const paths = (await additionalPaths(config)).filter(
      (entry): entry is ISitemapField => entry !== undefined,
    );
    const locations = paths.map((entry) => entry.loc);

    expect(new Set(locations).size).toBe(locations.length);
    expect(locations).toContain("/");
    expect(locations).toContain("/payment-plans");
    expect(locations).toContain("/napa/botox");
    expect(locations).toContain("/napa/facials");
    expect(locations).not.toContain("/services/weight-loss");
    for (const slug of [
      "botox",
      "chemical-peels",
      "facials",
      "filler",
      "hydrafacial",
      "laser",
      "microneedling",
    ]) {
      expect(locations).toContain(`/vacaville/${slug}`);
    }

    expect(paths.find((entry) => entry.loc === "/")?.priority).toBe(1);
  });

  it("excludes noindex records, retired URLs, Studio, and the legacy booking launcher", () => {
    for (const path of [
      "/booking",
      "/events",
      "/upcoming-events",
      "/giveaway-terms-and-conditions",
      "/wpbc-booking-received",
      "/locations.kml",
      "/services/weight-loss",
      "/studio",
      "/studio/**",
    ]) {
      expect(sitemapConfig.exclude).toContain(path);
    }
  });
});
