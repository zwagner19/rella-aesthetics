import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "font-poppins" }),
}));

/**
 * Analytics ownership is structural, not dependent on environment settings.
 * Ordinary site routes retain their existing direct analytics. The exact-Napa
 * campaign route suppresses the entire browser marketing stack for its full
 * session; consent permits only the bounded first-party attribution request.
 */
const APP = __dirname;
const read = (path: string) => readFileSync(join(APP, path), "utf8");
const code = (path: string) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ");

const BROWSER_MARKETING_PATTERN =
  /googletagmanager|googleadservices|doubleclick|connect\.facebook|leadconnector|msgsndr|callrail|dataLayer|gtag\(|fbq\(|sendBeacon/i;

describe("root layout owns no analytics", () => {
  it("does not import or render any marketing integration", () => {
    const source = code("layout.tsx");
    for (const banned of [
      "GoogleAnalytics",
      "MetaPixel",
      "GhlChatWidget",
      "CampaignGtm",
    ]) {
      expect(source).not.toContain(banned);
    }
  });

  it("still owns the document and font", () => {
    const source = code("layout.tsx");
    expect(source).toMatch(/<html/);
    expect(source).toMatch(/Poppins/);
  });
});

describe("ordinary site routes retain their existing integrations", () => {
  const source = code("(site)/layout.tsx");

  it("renders direct GA and Meta", () => {
    expect(source).toMatch(/<GoogleAnalytics\s*\/>/);
    expect(source).toMatch(/<MetaPixel\s*\/>/);
  });

  it("keeps the existing site chrome and GHL widget", () => {
    for (const expected of ["SkipNav", "Header", "Footer", "GhlChatWidget"]) {
      expect(source).toContain(expected);
    }
  });

  it("does not inherit the exact-Napa consent controller", () => {
    expect(source).not.toContain("AestheticsAttributionConsent");
  });
});

describe("the exact-Napa campaign route has no browser marketing path", () => {
  const campaignSources = [
    "(campaign)/layout.tsx",
    "(campaign)/napa/botox/page.tsx",
    "../components/integrations/AestheticsAttributionConsent.tsx",
    "../lib/aesthetics-attribution.ts",
  ];

  it("mounts only the first-party consent boundary", () => {
    const source = code("(campaign)/layout.tsx");
    expect(source).toMatch(/<AestheticsAttributionConsent\s*\/>/);
    for (const banned of [
      "CampaignGtm",
      "GoogleAnalytics",
      "MetaPixel",
      "GhlChatWidget",
      "CallRail",
    ]) {
      expect(source).not.toContain(banned);
    }
  });

  it("contains no data-layer, browser conversion, tracker, or beacon sink", () => {
    for (const path of campaignSources) {
      const source = read(path).replace(/\/\*[\s\S]*?\*\//g, " ");
      expect(source, path).not.toMatch(BROWSER_MARKETING_PATTERN);
    }
  });

  it("cannot be activated by marketing environment variables", async () => {
    vi.resetModules();
    const configured = {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-SHOULD-NOT-APPEAR",
      NEXT_PUBLIC_META_PIXEL_ID: "1234567890",
      NEXT_PUBLIC_GTM_ID: "GTM-SHOULDNOTAPPEAR",
      NEXT_PUBLIC_GHL_CHAT_WIDGET_ID:
        "00000000-0000-0000-0000-000000000000",
      NEXT_PUBLIC_CALLRAIL_NUMBER: "7075550100",
    };
    Object.assign(process.env, configured);
    try {
      const { default: CampaignLayout } = await import("./(campaign)/layout");
      const { default: Page } = await import("./(campaign)/napa/botox/page");
      const html = renderToStaticMarkup(
        <CampaignLayout>
          <Page />
        </CampaignLayout>,
      );
      for (const value of Object.values(configured)) {
        expect(html).not.toContain(value);
      }
      expect(html).not.toMatch(BROWSER_MARKETING_PATTERN);
      const scripts = [...html.matchAll(/<script([^>]*)>/g)].map(
        (match) => match[1],
      );
      for (const attributes of scripts) {
        expect(attributes).toContain('type="application/ld+json"');
        expect(attributes).not.toMatch(/\bsrc=/);
      }
    } finally {
      for (const key of Object.keys(configured)) delete process.env[key];
    }
  });

  it("keeps the sole network mutation on Rella's booking endpoint", () => {
    const controller = read("../lib/aesthetics-attribution.ts");
    expect(controller).toContain(
      '"https://book.experiencerella.com/api/booking-v2/attribution"',
    );
    expect(controller).toContain('credentials: "include"');
    expect(controller).not.toMatch(
      /google-analytics|analytics\.google|facebook\.com\/tr|googletagmanager|googleadservices|doubleclick/i,
    );
  });
});
