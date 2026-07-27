import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Sprint 07 lead-review routing closure — full-repo static proof that:
 *  - no public component points a CTA at the retired `/booking` embedded wizard, and
 *  - the retired embedded wizard has no public import path (only `/booking`, now a
 *    server redirect, ever referenced it — and it no longer does).
 */

const SRC = join(__dirname, "..");

function walk(dir: string, acc: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(f)) acc.push(p);
  }
  return acc;
}
// Scan production source only — test files legitimately contain these patterns as assertions.
const FILES = walk(SRC).filter((p) => !/\.test\.(ts|tsx)$/.test(p));
const rel = (p: string) => p.slice(SRC.length + 1);

describe("no public CTA points at /booking", () => {
  it("has zero href=/booking or ctaHref=/booking (plain or curly) in any source file", () => {
    // Matches href="/booking", ctaHref='/booking', href={"/booking"}, etc.
    const offenders = FILES.filter((p) => /(?:cta)?[Hh]ref\s*=\s*\{?\s*["'`]\/booking["'`]/.test(readFileSync(p, "utf8")))
      .map(rel);
    expect(offenders, `public /booking CTAs must be rewired: ${offenders.join(", ")}`).toEqual([]);
  });
});

describe("retired embedded wizard is quarantined (no public import)", () => {
  it("no page/route imports BoulevardCustomBooking / BoulevardBookingWizard", () => {
    const importers = FILES.filter((p) => {
      const t = readFileSync(p, "utf8");
      // The wizard component files themselves may reference their own name.
      if (/components\/(integrations\/BoulevardCustomBooking|booking\/BoulevardBookingWizard)\.tsx$/.test(p)) return false;
      return /import[^;]*Boulevard(CustomBooking|BookingWizard)/.test(t);
    }).map(rel);
    expect(importers, `retired wizard must have no public importers: ${importers.join(", ")}`).toEqual([]);
  });
});
