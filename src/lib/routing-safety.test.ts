import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Sprint 07 lead-review routing closure — full-repo static proof that:
 *  - no public component points a CTA at the retired `/booking` route,
 *  - the employee-only HQ stays outside the customer app, and
 *  - the retired browser-side Boulevard widget and SDK remain physically absent.
 */

const ROOT = join(__dirname, "..", "..");
const SRC = join(ROOT, "src");

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

describe("employee-only Rella HQ is outside the public website", () => {
  it("has no Rella HQ hostname or navigation target in production source", () => {
    const offenders = FILES.filter((p) =>
      /rella-hq(?:-[a-z0-9-]+)?\.vercel\.app|rella-hq/i.test(
        readFileSync(p, "utf8"),
      ),
    ).map(rel);

    expect(
      offenders,
      `public source must never send customers to Rella HQ: ${offenders.join(", ")}`,
    ).toEqual([]);
  });
});

describe("retired embedded Boulevard widget is deleted", () => {
  it("contains neither the old widget implementation nor its browser SDK", () => {
    for (const path of [
      "src/components/integrations/BoulevardCustomBooking.tsx",
      "src/components/booking/BoulevardBookingWizard.tsx",
      "src/components/booking/BookingQuestionsForm.tsx",
      "src/components/booking/BookingAppointmentSummary.tsx",
      "src/components/booking/booking-styles.ts",
      "src/lib/boulevard-config.ts",
      "src/types/boulevard-book-sdk.d.ts",
    ]) {
      expect(existsSync(join(ROOT, path)), path).toBe(false);
    }
    expect(readFileSync(join(ROOT, "package.json"), "utf8")).not.toContain(
      "@boulevard/blvd-book-sdk",
    );
  });
});
