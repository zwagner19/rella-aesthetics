import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import NapaBotoxPage from "./(campaign)/napa/botox/page";
import { CAMPAIGN_GTM_ENV_VAR } from "@/components/integrations/CampaignGtm";
import { CANONICAL_NAPA_TOX } from "@/lib/booking-routes";
import { MARKETING_PHONE, PUBLIC_LINKS } from "@/lib/napa-botox-facts";

vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "font-poppins" }),
}));

/**
 * Wave 4B edge-readiness contracts.
 *
 * The public plan is to proxy ONLY this route onto experiencerella.com while the
 * rest of that host stays WordPress. Three things follow, and each is asserted
 * here because each was a verified launch blocker:
 *
 *  - Root-relative navigation to `/services` or `/terms` 404s on the public host.
 *  - The proxied document does NOT inherit WordPress's GTM, so campaign routes
 *    must carry their own container.
 *  - The `*.vercel.app` aliases must be noindex while the public response stays
 *    indexable.
 */

const APP = __dirname;
const html = renderToStaticMarkup(<NapaBotoxPage />);

/** Every non-booking, non-tel link the page renders. */
const navLinks = [...html.matchAll(/<a\b([^>]*)>/g)]
  .map((m) => /href="([^"]*)"/.exec(m[1])?.[1] ?? "")
  .filter((h) => h && !h.startsWith("tel:") && h !== CANONICAL_NAPA_TOX && h !== "#main");

describe("the complete non-booking link matrix targets verified public destinations", () => {
  /** Verified live against experiencerella.com on 2026-07-27. */
  const APPROVED = new Set([
    "https://experiencerella.com/botox/",
    "https://experiencerella.com/privacy-policy/",
    "https://experiencerella.com/terms-and-conditions/",
    "https://experiencerella.com/cancellation-policy/",
  ]);

  it("every rendered navigation link is an approved public destination", () => {
    expect(navLinks.length).toBeGreaterThanOrEqual(4);
    for (const href of navLinks) {
      expect(APPROVED.has(href), `unapproved destination: ${href}`).toBe(true);
    }
  });

  it("the two destinations that 404 on the public host are gone", () => {
    for (const broken of ['href="/services"', 'href="/terms"']) {
      expect(html, `${broken} 404s on experiencerella.com`).not.toContain(broken);
    }
  });

  it("privacy policy is preserved, at its trailing-slash public URL", () => {
    expect(PUBLIC_LINKS.privacy).toBe("https://experiencerella.com/privacy-policy/");
    expect(navLinks).toContain("https://experiencerella.com/privacy-policy/");
  });

  it("treatments and terms point at the verified live pages", () => {
    expect(PUBLIC_LINKS.treatments).toBe("https://experiencerella.com/botox/");
    expect(PUBLIC_LINKS.terms).toBe("https://experiencerella.com/terms-and-conditions/");
  });

  it("no navigation link is root-relative, so none can 404 after proxying", () => {
    for (const href of navLinks) expect(href.startsWith("/")).toBe(false);
  });
});

describe("campaign GTM: opt-in, campaign-only, never near the booking app", () => {
  it("renders nothing when the environment variable is absent", async () => {
    vi.resetModules();
    delete process.env[CAMPAIGN_GTM_ENV_VAR];
    const { CampaignGtm, CampaignGtmNoScript } = await import("@/components/integrations/CampaignGtm");
    expect(renderToStaticMarkup(<CampaignGtm />)).toBe("");
    expect(renderToStaticMarkup(<CampaignGtmNoScript />)).toBe("");
  });

  it("emits the standard container snippet AND the noscript fallback when set", async () => {
    vi.resetModules();
    process.env[CAMPAIGN_GTM_ENV_VAR] = "GTM-TEST123";
    const { CampaignGtm, CampaignGtmNoScript } = await import("@/components/integrations/CampaignGtm");
    // `next/script` with strategy="afterInteractive" injects on the client, so it
    // emits nothing during SSR. Assert the ELEMENT contract instead of markup.
    const el = CampaignGtm() as React.ReactElement<{ id: string; children: string }>;
    expect(el).not.toBeNull();
    expect(el.props.id).toBe("campaign-gtm");
    expect(el.props.children).toContain("gtm.js?id=");
    expect(el.props.children).toContain("GTM-TEST123");
    expect(el.props.children).toContain("dataLayer");
    // The noscript half is plain markup and does render.
    const ns = renderToStaticMarkup(<CampaignGtmNoScript />);
    expect(ns).toContain("googletagmanager.com/ns.html?id=GTM-TEST123");
    expect(ns).toMatch(/<iframe[^>]+height="0"[^>]*>/);
    delete process.env[CAMPAIGN_GTM_ENV_VAR];
  });

  it("is mounted by the campaign layout only — the site group is untouched", () => {
    const campaign = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8");
    expect(campaign).toContain("CampaignGtm");
    const site = readFileSync(join(APP, "(site)", "layout.tsx"), "utf8");
    expect(site).not.toContain("CampaignGtm");
    const root = readFileSync(join(APP, "layout.tsx"), "utf8");
    expect(root).not.toContain("CampaignGtm");
  });

  it("adds no GHL chat widget to the campaign route", () => {
    const campaign = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8");
    expect(campaign).not.toContain("GhlChatWidget");
    expect(html).not.toMatch(/leadconnector|msgsndr/i);
  });

  it("hardcodes no patient data, click identifier, or secret", () => {
    const raw = readFileSync(join(APP, "..", "components", "integrations", "CampaignGtm.tsx"), "utf8");
    // Scan CODE, not the explanatory comment — the comment legitimately explains
    // what the component must never do.
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
    expect(code).not.toMatch(/gclid|utm_source|utm_medium|patient|email|phone_number/i);
    expect(code).not.toMatch(/GTM-[A-Z0-9]{5,}/);         // no literal container id
    expect(code).toContain("process.env.NEXT_PUBLIC_GTM_ID");
    // And nothing is pushed into dataLayer by this component beyond GTM's own boot.
    expect(code).not.toMatch(/dataLayer\.push\((?!\{'gtm\.start')/);
  });

  it("rejects a malformed container ID — no script, no iframe", async () => {
    const { GTM_ID_PATTERN } = await import("@/components/integrations/CampaignGtm");
    for (const bad of ["", "  ", "GTM", "GTM-", "gtm-5D84LL73", "GTM_5D84LL73", "G-5D84LL73",
                       "UA-12345-1", "GTM-ABC", "<script>alert(1)</script>", "GTM-5D84LL73; evil()"]) {
      vi.resetModules();
      process.env[CAMPAIGN_GTM_ENV_VAR] = bad;
      const { CampaignGtm, CampaignGtmNoScript } = await import("@/components/integrations/CampaignGtm");
      expect(CampaignGtm(), `malformed value rendered a script: ${JSON.stringify(bad)}`).toBeNull();
      expect(renderToStaticMarkup(<CampaignGtmNoScript />), JSON.stringify(bad)).toBe("");
      expect(GTM_ID_PATTERN.test(bad)).toBe(false);
    }
    delete process.env[CAMPAIGN_GTM_ENV_VAR];
  });

  it("accepts the confirmed production container ID format", async () => {
    const { GTM_ID_PATTERN } = await import("@/components/integrations/CampaignGtm");
    expect(GTM_ID_PATTERN.test("GTM-5D84LL73")).toBe(true);
  });

  it("documents the duplicate-GA4 hazard next to the code", () => {
    const src = readFileSync(join(APP, "..", "components", "integrations", "CampaignGtm.tsx"), "utf8");
    expect(src).toMatch(/DUPLICATE GA4/);
    expect(src).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID");
  });
});

describe("host-aware headers: alias noindex + origin marker", () => {
  const cfg = readFileSync(join(APP, "..", "..", "next.config.ts"), "utf8");

  it("attaches X-Robots-Tag: noindex only for *.vercel.app hosts", () => {
    expect(cfg).toMatch(/X-Robots-Tag/);
    expect(cfg).toMatch(/type:\s*"host"/);
    expect(cfg).toMatch(/vercel\\\\.app/);
  });

  it("does NOT make the page's own robots meta noindex", () => {
    // The future public response must stay indexable.
    expect(html).not.toMatch(/name="robots"[^>]*noindex/);
  });

  it("marks the campaign response with an explicit origin header", () => {
    expect(cfg).toContain("X-Rella-Origin");
    expect(cfg).toContain("next-marketing-wave3");
    expect(cfg).toMatch(/source:\s*"\/napa\/botox"/);
  });

  it("documents the threat model for stripping the alias-only header", () => {
    expect(cfg).toMatch(/THREAT MODEL/);
  });
});

describe("every Wave 3 contract is preserved", () => {
  const decoded = html
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
    .replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—").replace(/&reg;/g, "®");

  it("pricing canon unchanged", () => {
    expect(decoded).toContain("$18 / unit");
    expect(decoded).toContain("$6 / unit");
    expect(decoded).toMatch(/\$13\/unit/);
    expect(decoded).toMatch(/\$4\.40\/unit/);
    expect(decoded).toMatch(/\$30\/month/);
    expect(decoded).not.toContain("$4.33");
  });

  it("deposit language unchanged and still separate from per-unit pricing", () => {
    expect(decoded).toMatch(/Boulevard will charge a \$50 deposit when you confirm your appointment/);
    expect(decoded).toContain("separate from per-unit treatment pricing");
  });

  it("5 booking CTAs, canonical only; 6 call CTAs, central fallback only", () => {
    const book = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*data-cta="book"/g)].map((m) => m[1]);
    const call = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*data-cta="call"/g)].map((m) => m[1]);
    expect(book).toHaveLength(5);
    expect(new Set(book)).toEqual(new Set([CANONICAL_NAPA_TOX]));
    expect(call).toHaveLength(6);
    expect(new Set(call)).toEqual(new Set([MARKETING_PHONE.href]));
    expect(MARKETING_PHONE.href).toBe("tel:+17073582928");
  });

  it("no generic Boulevard link, no /booking link", () => {
    expect(html).not.toContain("dashboard.boulevard.io");
    expect(html).not.toMatch(/href="\/booking"/);
  });

  it("FAQ schema present, no aggregate rating, no patient form", () => {
    const ld = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(html)![1];
    expect(JSON.parse(ld)["@type"]).toBe("FAQPage");
    expect(html).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
  });

  it("responsive + accessibility structure unchanged", () => {
    expect([...html.matchAll(/<main\b/g)]).toHaveLength(1);
    expect(html).toContain('href="#main"');
    expect(html).toMatch(/class="nb-sticky"[^>]*role="group"/);
    expect(html.indexOf('<header class="nb-header">')).toBeLessThan(html.indexOf('<main id="main">'));
    expect(html.indexOf('<footer class="nb-footer">')).toBeGreaterThan(html.indexOf("</main>"));
  });
});
