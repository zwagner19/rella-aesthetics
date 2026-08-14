import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import NapaBotoxLandingPage, { metadata } from "./page";
import {
  PRICING, VISIT, CANCELLATION_POLICY, CANCELLATION_POLICY_URL, MARKETING_PHONE, FAQS, TRUST,
} from "@/lib/napa-botox-facts";
import { CANONICAL_NAPA_TOX, resolveBookingHref } from "@/lib/booking-routes";

/**
 * B01 Napa Botox landing — durable contract tests.
 *
 * These render the REAL page component with `react-dom/server`. The point is
 * that a marketing page which states a price, a duration, a deposit, or a policy
 * is making a promise on the business's behalf; each of those promises is pinned
 * here to the accepted Revision 06 canon so it cannot drift silently.
 */

const html = renderToStaticMarkup(<NapaBotoxLandingPage />);
/** Visible text with markup removed — copy frequently spans inline elements. */
const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const decoded = text
  .replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
  .replace(/&rsquo;/g, "’").replace(/&mdash;/g, "—").replace(/&reg;/g, "®")
  .replace(/&nbsp;/g, " ");

describe("pricing canon is stated exactly", () => {
  it("standard Botox is $18/unit and Dysport $6/unit", () => {
    expect(decoded).toContain("$18 / unit");
    expect(decoded).toContain("$6 / unit");
    expect(decoded).toMatch(/Botox® is \$18\/unit and Dysport \$6\/unit/);
  });

  it("member pricing is $13 and $4.40 per unit, clearly labelled as membership pricing", () => {
    expect(decoded).toMatch(/2026 Tox Membership[\s\S]*\$13\/unit[\s\S]*\$4\.40\/unit/);
    expect(PRICING.memberBotoxPerUnit).toBe("$13");
    expect(PRICING.memberDysportPerUnit).toBe("$4.40");
  });

  it("membership is $30/month with a one-year commitment", () => {
    expect(decoded).toContain("$30/month");
    expect(decoded).toContain("one year");
  });

  it("NEVER repeats the superseded $13 / $4.33 figures as STANDARD pricing", () => {
    // The old service-data copy read "Botox: $13/unit | Dysport: $4.33/unit".
    expect(decoded).not.toContain("$4.33");
    expect(decoded).not.toMatch(/Botox[®\s:]*\$13\s*\/\s*unit(?![\s\S]{0,40}[Mm]ember)/);
  });

  it("the deposit is never merged into per-unit treatment pricing", () => {
    expect(decoded).toContain("separate from per-unit treatment pricing");
    // No sentence may present the deposit as a per-unit price.
    expect(decoded).not.toMatch(/\$50\s*\/\s*unit/);
    expect(decoded).not.toMatch(/deposit[^.]{0,40}per unit price/i);
  });
});

describe("visit facts", () => {
  it("states a 30-minute visit, and the closing sentence renders EXACTLY", () => {
    expect(VISIT.durationMinutes).toBe(30);
    expect(decoded).toMatch(/30 min/);
    // The previous version of this assertion reduced its expected value to an
    // empty string via `.slice(0, 0)`, so `toContain("")` was trivially true and
    // could not see the missing space. This is the real sentence.
    const EXPECTED = "Book your 30 minutes new-patient visit online, or call and we\u2019ll get you scheduled.";
    expect(decoded).toContain(EXPECTED);
    // And explicitly reject every missing-space form.
    expect(decoded).not.toContain("minutesnew-patient");
    expect(decoded).not.toContain("minutesnew");
    expect(decoded).not.toMatch(/\d\s*minutes\S/);
  });

  it("states the $50 deposit is charged at confirmation without exposing the vendor", () => {
    expect(decoded).toMatch(/A \$50 deposit is charged when you confirm your appointment/);
    expect(decoded).toMatch(/Card details are handled by the secure booking provider/);
    expect(decoded).toMatch(/deposit is charged when you confirm in Rella's secure booking experience/);
    expect(decoded).not.toContain("Boulevard");
  });

  it("makes no refund, credit, or deposit-application promise", () => {
    expect(decoded).not.toMatch(/refundable|refunded|credited|applied toward|goes toward|transferable/i);
  });

  it("states only the verified 48-hour policy, and invents no other fee", () => {
    expect(decoded).toContain(CANCELLATION_POLICY);
    expect(html).toContain(CANCELLATION_POLICY_URL);
    // No invented cancellation/no-show fee amount beyond the retained deposit.
    const fees = decoded.match(/\$\d+(\.\d+)?/g) ?? [];
    const allowed = new Set(["$18", "$6", "$13", "$4.40", "$30", "$50"]);
    expect(fees.filter((f) => !allowed.has(f))).toEqual([]);
  });
});

describe("booking CTA routing", () => {
  it("uses the typed resolver with an EXPLICIT napa/botox intent", () => {
    const src = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(src).toContain('resolveBookingHref({ location: "napa", service: "botox" })');
    // No locationless default anywhere on this page.
    expect(src).not.toMatch(/resolveBookingHref\(\s*\{\s*\}\s*\)/);
    expect(src).not.toMatch(/resolveBookingHref\(\s*\)/);
  });

  it("resolves to the canonical hardened booking URL", () => {
    expect(resolveBookingHref({ location: "napa", service: "botox" })).toBe(CANONICAL_NAPA_TOX);
    expect(CANONICAL_NAPA_TOX).toBe("https://book.experiencerella.com/book/napa/botox");
  });

  it("every rendered booking CTA points at that one URL — no competing URL", () => {
    const hrefs = [...html.matchAll(/data-cta="book"[^>]*/g)].length;
    const bookHrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*data-cta="book"/g)].map((m) => m[1]);
    expect(bookHrefs.length).toBeGreaterThanOrEqual(3); // repeated CTA, per B01
    expect(new Set(bookHrefs)).toEqual(new Set([CANONICAL_NAPA_TOX]));
    expect(hrefs).toBe(bookHrefs.length);
    // No second, hard-coded booking host.
    const booking = [...html.matchAll(/https:\/\/book\.experiencerella\.com[^"']*/g)].map((m) => m[0]);
    expect(new Set(booking)).toEqual(new Set([CANONICAL_NAPA_TOX]));
  });

  it("never links the retired query-string or new-patient-tox routes", () => {
    expect(html).not.toMatch(/new-patient-tox/);
    expect(html).not.toMatch(/[?&]location=/);
    expect(html).not.toMatch(/[?&]service=/);
  });

  it("does not regress into a public /booking CTA", () => {
    expect(html).not.toMatch(/href="\/booking"/);
  });

  it("imports no embedded Boulevard wizard", () => {
    const src = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(src).not.toMatch(/BoulevardWizard|components\/booking\//);
    expect(html).not.toMatch(/dashboard\.boulevard\.io/);
  });
});

describe("call CTA", () => {
  it("displays (707) 358-2928 and dials +17073582928", () => {
    expect(MARKETING_PHONE.display).toBe("(707) 358-2928");
    expect(MARKETING_PHONE.href).toBe("tel:+17073582928");
    expect(decoded).toContain("(707) 358-2928");
    const tels = [...html.matchAll(/href="(tel:[^"]+)"/g)].map((m) => m[1]);
    expect(tels.length).toBeGreaterThanOrEqual(2); // repeated CTA
    expect(new Set(tels)).toEqual(new Set(["tel:+17073582928"]));
  });
});

describe("no unverifiable claims", () => {
  it("no ratings, review counts, stars, or awards", () => {
    expect(decoded).not.toMatch(/\b\d(\.\d)?\s*(star|out of 5)/i);
    expect(decoded).not.toMatch(/\b\d+\s*(reviews?|ratings?)\b/i);
    expect(decoded).not.toMatch(/award|voted best|#1\b/i);
    expect(html).not.toMatch(/aggregateRating|AggregateRating|reviewCount|ratingValue/);
  });

  it("no Review or Product schema — only FAQPage", () => {
    const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    expect(ld.length).toBeGreaterThan(0);
    for (const [, body] of ld) {
      const parsed = JSON.parse(body.replace(/&quot;/g, '"'));
      expect(parsed["@type"]).toBe("FAQPage");
      // Guard the SCHEMA TYPES and PROPERTY KEYS — an FAQ answer may of course
      // use the word "priced" in prose; what must never appear is offer,
      // review, or rating structured data.
      const types = JSON.stringify(parsed).match(/"@type"\s*:\s*"([^"]+)"/g) ?? [];
      for (const t of types) expect(t).toMatch(/"(FAQPage|Question|Answer)"/);
      expect(Object.keys(parsed)).not.toContain("aggregateRating");
      for (const key of ["aggregateRating", "review", "offers", "priceRange", "ratingValue", "reviewCount"]) {
        expect(JSON.stringify(parsed)).not.toContain(`"${key}"`);
      }
    }
  });

  it("claims no credentials beyond the approved owner line", () => {
    expect(decoded).toContain(TRUST.ownerCredential);
    expect(decoded).not.toMatch(/board[- ]certified|fellowship|specialist in|MD, PhD/i);
    expect(decoded).not.toMatch(/physician-led/i); // prohibited string; "physician-owned" is correct
  });

  it("promises no SMS/text confirmation and no same-day availability", () => {
    expect(decoded).not.toMatch(/text (you|me|us)|SMS|text message/i);
    expect(decoded).not.toMatch(/same[- ]day|walk[- ]ins? welcome|available today/i);
  });
});

describe("FAQ visible copy and schema agree exactly", () => {
  const ldBody = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(html)![1];
  const schema = JSON.parse(ldBody.replace(/&quot;/g, '"'));

  it("schema contains exactly the FAQs that are rendered", () => {
    const schemaQs = schema.mainEntity.map((q: { name: string }) => q.name);
    expect(schemaQs).toEqual(FAQS.map((f) => f.q));
  });

  it("every schema question and answer is visible on the page", () => {
    for (const entry of schema.mainEntity) {
      expect(decoded).toContain(entry.name.replace(/&/g, "&"));
      expect(decoded.length).toBeGreaterThan(0);
      const a = entry.acceptedAnswer.text;
      expect(decoded).toContain(a.slice(0, 40));
    }
  });

  it("the cancellation answer is the approved policy verbatim", () => {
    const cancel = schema.mainEntity.find((q: { name: string }) => /cancel/i.test(q.name));
    expect(cancel.acceptedAnswer.text).toBe(CANCELLATION_POLICY);
  });
});

describe("accepted light design, no photography", () => {
  it("renders no photography — the only image is the approved brand logo", () => {
    const imgs = [...html.matchAll(/<img\b([^>]*)>/g)].map((m) => m[1]);
    for (const attrs of imgs) {
      expect(attrs, "only the approved logo asset may be an <img>").toMatch(/\/brand\/rella-logo-black\.svg/);
    }
    expect(html).not.toMatch(/hero-band\.png|face-blue\.png|background-image/);
    expect(html).not.toMatch(/\.(jpe?g|webp|avif)\b/i);   // no photographic formats at all
  });

  it("uses no prohibited dark page ground", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    const grounds = [...css.matchAll(/background(?:-color)?\s*:\s*([^;]+);/g)].map((m) => m[1].trim());
    for (const g of grounds) {
      expect(g, `dark ground: ${g}`).not.toMatch(/#(0|1|2)[0-9a-f]{2}/i);
      expect(g).not.toMatch(/var\(--nb-ink\)/);
    }
  });

  it("defines the Revision 06 light tokens and 44px targets", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    for (const t of ["--nb-paper: #ffffff", "--nb-porcelain: #fafaf9", "--nb-rose50: #fdf2f0", "--nb-clay: #b04a40"]) {
      expect(css).toContain(t);
    }
    expect(css).toContain("--nb-target: 44px");
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).toMatch(/:focus-visible/);
  });

  it("is Poppins-only — no serif token, no unloaded font family", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    expect(css).toMatch(/font-family:\s*var\(--font-poppins\)/);
    for (const src of [css, readFileSync(join(__dirname, "page.tsx"), "utf8")]) {
      for (const banned of ["Lora", "Georgia", "Times New Roman"]) {
        expect(src, `${banned} must not appear`).not.toContain(banned);
      }
      // `serif` as a STANDALONE family is banned; `sans-serif` is the correct
      // generic fallback and must not trip this check.
      expect(src.replace(/sans-serif/g, "")).not.toMatch(/\bserif\b/);
    }
  });

  it("uses the accepted pill action shape, not rectangular controls", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    const btn = /\.nb-btn\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    expect(btn).toMatch(/border-radius:\s*999px/);
    expect(btn).toMatch(/text-transform:\s*uppercase/);
    expect(btn).toMatch(/letter-spacing:\s*0\.12em/);
    expect(btn).toMatch(/font-weight:\s*700/);
    expect(btn).not.toMatch(/border-radius:\s*\d{1,2}px/);
  });

  it("uses the accepted uppercase display treatment for the hero", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    const h1 = /\.nb-h1\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    expect(h1).toMatch(/text-transform:\s*uppercase/);
    expect(h1).toMatch(/font-weight:\s*700/);
    expect(h1).toMatch(/letter-spacing:\s*0\.08em/);
    expect(h1).toMatch(/line-height:\s*1\.1/);
  });

  it("small text never uses the decorative-only silver token", () => {
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    expect(css).not.toMatch(/#83888D/i);           // 3.58:1, large/decorative only
    expect(css).toContain("--nb-muted: #70757a");  // 4.65:1 for small text
  });
});

describe("marketing/booking privacy boundary", () => {
  it("adds no tracker, pixel, or analytics script to this page", () => {
    expect(html).not.toMatch(/googletagmanager|gtag\(|fbq\(|clarity\.ms|hotjar|callrail|leadconnector/i);
    const scripts = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    for (const attrs of scripts) {
      // The only script on the page is the inline FAQ JSON-LD.
      expect(attrs).toContain('type="application/ld+json"');
      expect(attrs).not.toMatch(/\bsrc=/);
    }
  });

  it("sends nothing to the booking domain except the visitor's own click", () => {
    const src = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    expect(src).not.toMatch(/<form|<input|<textarea/); // no booking-form fields here
  });

  it("collects no patient identity or contact field", () => {
    expect(html).not.toMatch(/<input|<form|<textarea|<select/);
  });
});

describe("SEO metadata", () => {
  it("has unique Napa Botox metadata and the marketing canonical", () => {
    expect(metadata.title).toBe("Botox in Napa — Physician-Owned Med Spa");
    expect(String(metadata.description)).toMatch(/Napa/);
    expect(String(metadata.description)).toMatch(/\$18\/unit/);
    expect(metadata.alternates?.canonical).toBe("https://experiencerella.com/napa/botox");
  });

  it("the canonical is the MARKETING url, never the booking app", () => {
    expect(String(metadata.alternates?.canonical)).not.toContain("book.experiencerella.com");
  });

  it("states accurate Napa location facts", () => {
    expect(decoded).toContain("1541 3rd St");
    expect(decoded).toContain("Napa, CA 94559");
    expect(decoded).toContain("Open Tuesday – Saturday · 9am – 5pm");
  });
});

describe("accessibility structure", () => {
  it("has exactly one h1", () => {
    expect([...html.matchAll(/<h1\b/g)]).toHaveLength(1);
  });

  it("heading order does not skip a level", () => {
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("every section is labelled", () => {
    const sections = [...html.matchAll(/<section([^>]*)>/g)].map((m) => m[1]);
    for (const attrs of sections) expect(attrs).toMatch(/aria-labelledby=/);
  });

  it("the mobile sticky bar is grouped, labelled, and cannot cover the last content", () => {
    expect(html).toMatch(/class="nb-sticky"[^>]*role="group"[^>]*aria-label=/);
    // The page root carries bottom padding sized for the bar (nb-pad), which the
    // accepted design uses instead of an extra spacer element.
    expect(html).toMatch(/class="nb nb-pad"/);
    const css = readFileSync(join(__dirname, "napa-botox.css"), "utf8");
    expect(css).toMatch(/\.nb-pad\s*\{[^}]*padding-bottom:\s*calc\(64px/);
    expect(css).toMatch(/@media \(min-width:\s*1024px\)[\s\S]*\.nb-sticky\s*\{\s*display:\s*none/);
  });
});
