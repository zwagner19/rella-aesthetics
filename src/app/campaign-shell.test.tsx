import { describe, it, expect, vi } from "vitest";

// `next/font/google` is a build-time transform; in a plain node test it is not a
// callable function. Stub it so the real RootLayout can still be rendered.
vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "font-poppins" }),
}));
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import RootLayout from "./layout";
import SiteLayout from "./(site)/layout";
import CampaignLayout from "./(campaign)/layout";
import NapaBotoxPage from "./(campaign)/napa/botox/page";
import { CANONICAL_NAPA_TOX, resolveBookingHref } from "@/lib/booking-routes";
import { MARKETING_PHONE } from "@/lib/napa-botox-facts";

/**
 * Route-level shell policy.
 *
 * The earlier pass tested the page component in isolation while claiming
 * route-level behaviour. That could not see what the layout wrapped around it —
 * and the layout was the defect: `/napa/botox` inherited the general site
 * Header, MobileNav, Footer, and GHL chat widget, which between them added two
 * GENERIC Boulevard booking links beside the canonical one, plus a floating
 * bubble over the mobile sticky bar.
 *
 * These tests render the ACTUAL layouts, so a regression in the route tree is
 * visible here rather than only in a browser.
 */

const APP = __dirname;

/** The full document a visitor gets for /napa/botox: root → campaign → page. */
const campaignDoc = renderToStaticMarkup(
  <CampaignLayout>
    <NapaBotoxPage />
  </CampaignLayout>,
);

/** What an ordinary marketing route gets: root → site chrome → its page. */
const siteDoc = renderToStaticMarkup(
  <SiteLayout>
    <p>ordinary marketing page</p>
  </SiteLayout>,
);

describe("the campaign route renders the focused B01 shell", () => {
  it("renders no general-site navigation and no hamburger menu", () => {
    expect(campaignDoc).not.toMatch(/aria-label="Main navigation"/);
    expect(campaignDoc).not.toMatch(/Open menu|Close menu|hamburger/i);
    // The site nav's link set must not appear.
    for (const label of ["VIP MEMBERSHIP", "EDUCATION", "GALLERY", "SERVICES", "ABOUT"]) {
      expect(campaignDoc.toUpperCase()).not.toContain(`>${label}<`);
    }
  });

  it("renders neither generic booking CTA that the site chrome carries", () => {
    expect(campaignDoc).not.toContain("Book Consultation");
    expect(campaignDoc).not.toContain("Book Online");
  });

  it("renders no floating chat widget that could cover an action", () => {
    expect(campaignDoc).not.toMatch(/leadconnector|ghl|chat-widget|GhlChat/i);
  });

  it("supplies its own campaign header: logo, phone, one primary action", () => {
    expect(campaignDoc).toMatch(/<header class="nb-header">/);
    expect(campaignDoc).toContain("/brand/rella-logo-black.svg");
    expect(campaignDoc).toContain(MARKETING_PHONE.display);
    const header = campaignDoc.slice(campaignDoc.indexOf("<header"), campaignDoc.indexOf("</header>"));
    expect(header).toContain(CANONICAL_NAPA_TOX);
    expect((header.match(/data-cta="book"/g) ?? []).length).toBe(1); // one primary action
  });

  it("supplies its own compact campaign footer", () => {
    expect(campaignDoc).toMatch(/<footer class="nb-footer">/);
    expect(campaignDoc).toContain("Individual results vary.");
    expect(campaignDoc).toContain("© 2026 Rella Aesthetics");
    const footer = campaignDoc.slice(campaignDoc.indexOf('<footer class="nb-footer">'));
    expect(footer).not.toContain("Book Online");
  });

  it("keeps the mobile sticky Book/Call bar canonical", () => {
    const sticky = /<div class="nb-sticky"[\s\S]*?<\/div>/.exec(campaignDoc)?.[0] ?? "";
    expect(sticky).toContain('role="group"');
    expect(sticky).toContain('aria-label="Book or call Rella Napa"');
    expect(sticky).toContain(`href="${CANONICAL_NAPA_TOX}"`);
    expect(sticky).toContain(`href="${MARKETING_PHONE.href}"`);
  });
});

describe("campaign landmarks: header and footer are SIBLINGS of one main", () => {
  it("renders exactly one <main>, with id=main", () => {
    expect([...campaignDoc.matchAll(/<main\b/g)]).toHaveLength(1);
    expect(campaignDoc).toMatch(/<main id="main">/);
  });

  it("the campaign header precedes main and is NOT inside it", () => {
    const h = campaignDoc.indexOf('<header class="nb-header">');
    const m = campaignDoc.indexOf('<main id="main">');
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(m);
    const mainInner = campaignDoc.slice(m, campaignDoc.indexOf("</main>"));
    expect(mainInner).not.toContain("<header");
  });

  it("the campaign footer follows main and is NOT inside it", () => {
    const mEnd = campaignDoc.indexOf("</main>");
    const f = campaignDoc.indexOf('<footer class="nb-footer">');
    expect(f).toBeGreaterThan(mEnd);
    const mainInner = campaignDoc.slice(campaignDoc.indexOf('<main id="main">'), mEnd);
    expect(mainInner).not.toContain("<footer");
  });

  it("a skip link exists, targets #main, and is the first focusable element", () => {
    expect(campaignDoc).toContain('href="#main"');
    expect(campaignDoc).toMatch(/<a class="nb-skip" href="#main">Skip to content<\/a>/);
    const firstAnchor = /<a\b[^>]*>/.exec(campaignDoc)?.[0] ?? "";
    expect(firstAnchor).toContain("nb-skip");
  });

  it("the campaign layout is a fragment, not a <main> wrapper", () => {
    // Scan CODE, not the explanatory comment (which legitimately says "<main>").
    const layout = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/\/\/[^\n]*/g, " ");
    expect(layout).not.toMatch(/<main/);
    // Still a fragment — it wraps children in <>…</> and adds only the campaign
    // GTM container (Wave 4B), never a landmark element.
    expect(layout).toMatch(/<>[\s\S]*\{children\}[\s\S]*<\/>/);
    expect(layout).not.toMatch(/<(header|footer|nav|section)\b/);
  });

  it("the sticky actions sit outside main, after the footer", () => {
    expect(campaignDoc.indexOf('class="nb-sticky"')).toBeGreaterThan(campaignDoc.indexOf("</main>"));
  });
});

describe("the mobile header-phone hide rule actually wins the cascade", () => {
  const css = readFileSync(join(APP, "(campaign)", "napa", "botox", "napa-botox.css"), "utf8");

  it("the hide selector outranks the generic anchor rule", () => {
    // `.nb a` is 0-1-1 and sets display:inline-flex for every link. A bare
    // `.nb-headertel` is 0-1-0 and LOSES, because media queries add no
    // specificity. The hide rule must therefore be at least 0-2-1.
    const hide = /@media \(max-width:\s*679px\)\s*\{([^}]*\{[^}]*\})/.exec(css)?.[1] ?? "";
    expect(hide).toContain(".nb a.nb-headertel");
    expect(hide).toMatch(/display:\s*none/);
    // The defective bare form must not come back.
    expect(css).not.toMatch(/@media \(max-width:\s*679px\)\s*\{\s*\.nb-headertel\s*\{/);
  });

  it("the generic anchor rule that caused it is still present and unchanged", () => {
    expect(css).toMatch(/\.nb a\s*\{[^}]*display:\s*inline-flex/);
  });

  it("the breakpoint is 679/680, matching the accepted design", () => {
    expect(css).toMatch(/@media \(max-width:\s*679px\)/);
  });

  it("no global overflow clipping is used to conceal layout defects", () => {
    expect(css).not.toMatch(/overflow-x:\s*(hidden|clip)/);
    expect(css).not.toMatch(/\.nb\s*\{[^}]*overflow/);
  });

  it("the mobile sticky Call action is retained", () => {
    expect(campaignDoc).toMatch(/class="nb-sticky-call"/);
    expect(campaignDoc).toMatch(/<a class="nb-sticky-call" href="tel:\+17073582928"/);
  });
});

describe("ordinary marketing routes keep the global site chrome", () => {
  it("still renders the site header, nav, footer, and chat widget", () => {
    expect(siteDoc).toMatch(/aria-label="Main navigation"/);
    expect(siteDoc).toContain("Book Consultation"); // the site's own generic CTA, unchanged
    expect(siteDoc).toContain("Book Online");
    expect(siteDoc).toMatch(/<footer/);
  });

  it("the exception is scoped to the campaign group only", () => {
    // Every ordinary route lives in (site); only the campaign group opts out.
    const groups = readdirSync(APP, { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name.startsWith("("))
      .map((e) => e.name);
    expect(groups.sort()).toEqual(["(campaign)", "(site)"]);
    const campaignRoutes = readdirSync(join(APP, "(campaign)"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    expect(campaignRoutes).toEqual(["napa"]); // nothing else opted out
  });

  it("the root layout owns the document and font — analytics moved to (site)", () => {
    // SUPERSEDED CONTRACT. This previously required GoogleAnalytics and
    // MetaPixel in the ROOT layout, which meant campaign routes inherited them;
    // they rendered null only because the env vars happen to be unset. Ownership
    // is now structural — see analytics-ownership.test.tsx.
    const root = readFileSync(join(APP, "layout.tsx"), "utf8");
    expect(root).toMatch(/<html/);
    expect(root).not.toContain("GoogleAnalytics");
    expect(root).not.toContain("MetaPixel");
    const site = readFileSync(join(APP, "(site)", "layout.tsx"), "utf8");
    expect(site).toContain("<GoogleAnalytics />");
    expect(site).toContain("<MetaPixel />");
  });

  it("the policy is expressed by the route tree, not by CSS hiding", () => {
    const css = readFileSync(join(APP, "(campaign)", "napa", "botox", "napa-botox.css"), "utf8");
    expect(css).not.toMatch(/header\s*\{[^}]*display:\s*none/i);
    expect(css).not.toMatch(/footer\s*\{[^}]*display:\s*none/i);
    const campaignLayout = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8");
    expect(campaignLayout).not.toContain("Header");
    expect(campaignLayout).not.toContain("Footer");
    expect(campaignLayout).not.toContain("GhlChat");
  });
});

describe("FULL-DOCUMENT booking and call destination matrix", () => {
  /** Every anchor in the whole campaign document, not just the page body. */
  const anchors = [...campaignDoc.matchAll(/<a\b([^>]*)>/g)].map((m) => m[1]);
  const hrefOf = (attrs: string) => /href="([^"]*)"/.exec(attrs)?.[1] ?? "";
  const bookAnchors = anchors.filter((a) => a.includes('data-cta="book"'));
  const callAnchors = anchors.filter((a) => a.includes('data-cta="call"'));

  it("every Book CTA in the entire document resolves to the canonical booking URL", () => {
    expect(bookAnchors.length).toBeGreaterThanOrEqual(5); // header + body ×3 + sticky
    expect(new Set(bookAnchors.map(hrefOf))).toEqual(new Set([CANONICAL_NAPA_TOX]));
    expect(CANONICAL_NAPA_TOX).toBe("https://book.experiencerella.com/book/napa/botox");
  });

  it("the destination comes through the typed napa/botox resolver", () => {
    expect(resolveBookingHref({ location: "napa", service: "botox" })).toBe(CANONICAL_NAPA_TOX);
    const src = readFileSync(join(APP, "(campaign)", "napa", "botox", "page.tsx"), "utf8");
    expect(src).toContain('resolveBookingHref({ location: "napa", service: "botox" })');
    expect(src).not.toMatch(/resolveBookingHref\(\s*\{\s*\}\s*\)/);
    expect(src).not.toMatch(/https:\/\/book\.experiencerella\.com/); // never hard-coded
  });

  it("ZERO anchors on this route point at dashboard.boulevard.io", () => {
    const offenders = anchors.map(hrefOf).filter((h) => h.includes("dashboard.boulevard.io"));
    expect(offenders).toEqual([]);
  });

  it("ZERO Book CTAs point at /booking", () => {
    expect(anchors.map(hrefOf).filter((h) => h === "/booking" || h.startsWith("/booking?"))).toEqual([]);
  });

  it("every Call CTA dials the approved central number", () => {
    expect(callAnchors.length).toBeGreaterThanOrEqual(4);
    expect(new Set(callAnchors.map(hrefOf))).toEqual(new Set(["tel:+17073582928"]));
    const tels = campaignDoc.match(/href="tel:[^"]*"/g) ?? [];
    expect(new Set(tels)).toEqual(new Set(['href="tel:+17073582928"']));
  });

  it("the displayed number is the approved marketing display number", () => {
    expect(MARKETING_PHONE.display).toBe("(707) 358-2928");
    expect(campaignDoc).toContain("(707) 358-2928");
  });

  it("generic and Vacaville routing behaviour is unchanged", () => {
    expect(resolveBookingHref({})).toMatch(/dashboard\.boulevard\.io/);
    expect(resolveBookingHref({ location: "vacaville" })).toMatch(/locationId=0f146f87/);
    expect(resolveBookingHref({ location: "vacaville", service: "botox" })).not.toBe(CANONICAL_NAPA_TOX);
  });
});

describe("the campaign route adds no tracking of its own", () => {
  it("emits only the inline FAQ JSON-LD script", () => {
    const scripts = [...campaignDoc.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    expect(scripts.length).toBeGreaterThan(0);
    for (const attrs of scripts) {
      expect(attrs).toContain('type="application/ld+json"');
      expect(attrs).not.toMatch(/\bsrc=/);
    }
    expect(campaignDoc).not.toMatch(/googletagmanager|gtag\(|fbq\(|clarity\.ms|hotjar|callrail/i);
  });

  it("the site layout's analytics are untouched by the campaign work", () => {
    const site = readFileSync(join(APP, "(site)", "layout.tsx"), "utf8");
    expect(site).toContain("GoogleAnalytics");
    expect(site).toContain("MetaPixel");
    // And the campaign group gains none of them.
    const campaign = readFileSync(join(APP, "(campaign)", "layout.tsx"), "utf8");
    expect(campaign).not.toContain("GoogleAnalytics");
    expect(campaign).not.toContain("MetaPixel");
  });
});

describe("RootLayout still produces a valid document", () => {
  it("renders html/body with the Poppins variable and no site chrome", () => {
    const doc = renderToStaticMarkup(<RootLayout><p>child</p></RootLayout>);
    expect(doc).toMatch(/<html[^>]*lang="en"/);
    expect(doc).toMatch(/__variable_|--font-poppins|antialiased/);
    expect(doc).not.toContain("Book Consultation");
    expect(doc).toContain("child");
  });
});
