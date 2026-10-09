import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { AESTHETICS_AD_LANDING_PAGES } from "@/lib/aesthetics-attribution";

const APP = join(process.cwd(), "src", "app");
const GROUP = join(APP, "(ad-landing)");

function pagePaths(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...pagePaths(full));
    else if (entry === "page.tsx") {
      const route = relative(GROUP, dir).split(sep).join("/");
      found.push(`/${route}`);
    }
  }
  return found;
}

describe("ad landing privacy boundary", () => {
  it("lists every (ad-landing) page in the consent page map, and nothing outside it", () => {
    const routes = pagePaths(GROUP).sort();
    const mapped = Object.keys(AESTHETICS_AD_LANDING_PAGES)
      .filter((path) => path !== "/napa/botox")
      .sort();
    expect(routes).toEqual(mapped);
  });

  it("loads no third-party analytics, advertising, or chat scripts", () => {
    const layout = readFileSync(join(GROUP, "layout.tsx"), "utf8");
    for (const forbidden of ["GoogleAnalytics", "MetaPixel", "GhlChatWidget", "googletagmanager", "fbq("]) {
      expect(layout, forbidden).not.toContain(forbidden);
    }
    expect(layout).toContain("<AestheticsAttributionConsent />");
    expect(layout).toContain("<AdLandingTrackerGuard />");
  });

  it("forces a full page load from ordinary routes into ad landing pages", () => {
    const site = readFileSync(join(APP, "(site)", "layout.tsx"), "utf8");
    expect(site).toContain("<AdLandingHardNavigation />");
  });

  it("maps each landing page to its own clinic", () => {
    for (const [path, location] of Object.entries(AESTHETICS_AD_LANDING_PAGES)) {
      const expected = path.includes("vacaville") ? "vacaville" : "napa";
      expect(location, path).toBe(expected);
    }
  });
});
