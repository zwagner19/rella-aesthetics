import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import NapaBotoxPage from "./(campaign)/napa/botox/page";
import { CANONICAL_NAPA_TOX } from "@/lib/booking-routes";
import { MARKETING_PHONE, PUBLIC_LINKS } from "@/lib/napa-botox-facts";

vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "font-poppins" }),
}));

/**
 * Wave 4B edge-readiness contracts.
 *
 * This route can be served through the dedicated release origin before the full
 * site cutover. Three things follow, and each is asserted here:
 *
 *  - Navigation must return visitors to canonical public-site destinations.
 *  - The proxied document must preserve the exact-Napa suppression of every
 *    browser marketing loader; consent permits only first-party attribution.
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
  const APPROVED = new Set([
    "https://experiencerella.com/services/botox",
    "https://experiencerella.com/privacy-policy",
    "https://experiencerella.com/terms",
    "https://experiencerella.com/cancellation-policy",
  ]);

  it("every rendered navigation link is an approved public destination", () => {
    expect(navLinks.length).toBeGreaterThanOrEqual(4);
    for (const href of navLinks) {
      expect(APPROVED.has(href), `unapproved destination: ${href}`).toBe(true);
    }
  });

  it("privacy policy uses the canonical public URL", () => {
    expect(PUBLIC_LINKS.privacy).toBe("https://experiencerella.com/privacy-policy");
    expect(navLinks).toContain("https://experiencerella.com/privacy-policy");
  });

  it("treatments and terms point at canonical post-cutover pages", () => {
    expect(PUBLIC_LINKS.treatments).toBe("https://experiencerella.com/services/botox");
    expect(PUBLIC_LINKS.terms).toBe("https://experiencerella.com/terms");
  });

  it("no navigation link is root-relative, so none can 404 after proxying", () => {
    for (const href of navLinks) expect(href.startsWith("/")).toBe(false);
  });
});

describe("exact-Napa browser marketing suppression", () => {
  it("mounts the first-party consent controller and no marketing loader", () => {
    const campaign = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8");
    expect(campaign).toContain("AestheticsAttributionConsent");
    expect(campaign).not.toMatch(
      /CampaignGtm|GoogleAnalytics|MetaPixel|GhlChatWidget|CallRail/,
    );
    const site = readFileSync(join(APP, "(site)", "layout.tsx"), "utf8");
    expect(site).not.toContain("AestheticsAttributionConsent");
  });

  it("has no browser tracker or conversion sink in any reachable source", () => {
    const sources = [
      join(APP, "(campaign)", "layout.tsx"),
      join(APP, "(campaign)", "napa", "botox", "page.tsx"),
      join(APP, "..", "components", "integrations", "AestheticsAttributionConsent.tsx"),
      join(APP, "..", "lib", "aesthetics-attribution.ts"),
    ];
    for (const source of sources) {
      const code = readFileSync(source, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ");
      expect(code, source).not.toMatch(
        /googletagmanager|googleadservices|doubleclick|connect\.facebook|leadconnector|msgsndr|callrail|dataLayer|gtag\(|fbq\(|sendBeacon/i,
      );
    }
  });

  it("retains only the credentialed first-party attribution endpoint", () => {
    const source = readFileSync(
      join(APP, "..", "lib", "aesthetics-attribution.ts"),
      "utf8",
    );
    expect(source).toContain(
      "https://book.experiencerella.com/api/booking-v2/attribution",
    );
    expect(source).toContain('credentials: "include"');
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
