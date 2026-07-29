import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "font-poppins" }),
}));

/**
 * Analytics ownership is STRUCTURAL, not incidental.
 *
 * Direct GA and Meta used to live in the root layout, so campaign routes
 * inherited them. They rendered null only because the canonical Vercel project
 * has no matching environment variables — a coincidence of configuration, not a
 * contract. Setting `NEXT_PUBLIC_GA_MEASUREMENT_ID` would have silently given
 * the campaign page a second measurement path and double-counted GA4.
 *
 * Now: root = document only · (site) = direct GA + Meta · (campaign) = GTM only.
 */
const APP = __dirname;
const read = (p: string) => readFileSync(join(APP, p), "utf8");
/** Scan CODE, not explanatory comments. */
const code = (p: string) => read(p).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

describe("root layout owns no analytics at all", () => {
  it("does not import or render GoogleAnalytics or MetaPixel", () => {
    const c = code("layout.tsx");
    expect(c).not.toMatch(/GoogleAnalytics/);
    expect(c).not.toMatch(/MetaPixel/);
  });
  it("does not render the campaign GTM either", () => {
    expect(code("layout.tsx")).not.toMatch(/CampaignGtm/);
  });
  it("still owns the document and the font", () => {
    const c = code("layout.tsx");
    expect(c).toMatch(/<html/);
    expect(c).toMatch(/Poppins/);
  });
});

describe("(site) layout owns the direct GA and Meta components", () => {
  const c = code("(site)/layout.tsx");
  it("renders GoogleAnalytics", () => expect(c).toMatch(/<GoogleAnalytics\s*\/>/));
  it("renders MetaPixel", () => expect(c).toMatch(/<MetaPixel\s*\/>/));
  it("keeps the existing site chrome", () => {
    for (const x of ["SkipNav", "Header", "Footer", "GhlChatWidget"]) expect(c).toContain(x);
  });
  it("does NOT render the campaign GTM", () => expect(c).not.toMatch(/CampaignGtm/));
});

describe("(campaign) layout owns CampaignGtm and nothing else", () => {
  const c = code("(campaign)/layout.tsx");
  it("renders the campaign GTM container and its noscript half", () => {
    expect(c).toMatch(/<CampaignGtm\s*\/>/);
    expect(c).toMatch(/<CampaignGtmNoScript\s*\/>/);
  });
  it("renders no direct GA, Meta, GHL chat, or CallRail", () => {
    for (const banned of ["GoogleAnalytics", "MetaPixel", "GhlChatWidget", "callrail", "CallRail"]) {
      expect(c, `campaign layout must not contain ${banned}`).not.toContain(banned);
    }
  });
});

describe("the campaign ROUTE has exactly one possible analytics path", () => {
  /** Every module reachable from the campaign route, scanned for tracker imports. */
  const campaignSources = [
    "(campaign)/layout.tsx",
    "(campaign)/napa/botox/page.tsx",
  ];
  it("no campaign source imports a direct GA, Meta, or GHL component", () => {
    for (const f of campaignSources) {
      const c = code(f);
      for (const banned of ["GoogleAnalytics", "MetaPixel", "GhlChatWidget"]) {
        expect(c, `${f} imports ${banned}`).not.toContain(banned);
      }
    }
  });

  it("setting direct GA/Meta env vars CANNOT put them in the campaign route", async () => {
    // The decisive test: with both direct-tracker variables set, render the
    // campaign layout + page and prove neither tracker appears. Previously this
    // would have failed, because the root layout mounted them for every route.
    vi.resetModules();
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-SHOULDNOTAPPEAR";
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "1234567890";
    try {
      const { default: CampaignLayout } = await import("./(campaign)/layout");
      const { default: Page } = await import("./(campaign)/napa/botox/page");
      const html = renderToStaticMarkup(<CampaignLayout><Page /></CampaignLayout>);
      expect(html).not.toContain("G-SHOULDNOTAPPEAR");
      expect(html).not.toContain("1234567890");
      expect(html).not.toMatch(/gtag\(|fbq\(|connect\.facebook|googletagmanager/i);
    } finally {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    }
  });

  it("a malformed or missing GTM ID still renders nothing", async () => {
    for (const bad of [undefined, "", "   ", "gtm-lowercase", "G-12345678", "GTM-"]) {
      vi.resetModules();
      if (bad === undefined) delete process.env.NEXT_PUBLIC_GTM_ID;
      else process.env.NEXT_PUBLIC_GTM_ID = bad;
      const { default: CampaignLayout } = await import("./(campaign)/layout");
      const html = renderToStaticMarkup(<CampaignLayout><p>x</p></CampaignLayout>);
      expect(html, `rendered for ${JSON.stringify(bad)}`).not.toMatch(/googletagmanager/i);
    }
    delete process.env.NEXT_PUBLIC_GTM_ID;
  });

  it("a valid GTM ID renders the container exactly once", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-5D84LL73";
    try {
      const { default: CampaignLayout } = await import("./(campaign)/layout");
      const html = renderToStaticMarkup(<CampaignLayout><p>x</p></CampaignLayout>);
      // The noscript half renders server-side; the script half is injected by
      // next/script on the client. Exactly one container reference either way.
      expect([...html.matchAll(/GTM-5D84LL73/g)]).toHaveLength(1);
      expect(html).toContain("googletagmanager.com/ns.html?id=GTM-5D84LL73");
    } finally {
      delete process.env.NEXT_PUBLIC_GTM_ID;
    }
  });
});
