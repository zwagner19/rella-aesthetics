import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Focused hardening tests.
 *
 * Two independent issues, both of which survived on `main` after PR #1's
 * booking-routing work was superseded by PR #2:
 *
 *  1. `aggregateRating` published a 4.9 rating over 32 reviews that is not
 *     traceable to any auditable source. Structured-data ratings are a claim
 *     made to search engines and to patients.
 *  2. `/api/revalidate` FAILED OPEN. Its guard read
 *     `if (SECRET && authHeader !== ...)`, so a deployment with no secret
 *     configured skipped the check and accepted anonymous revalidation.
 */

const ROOT = join(__dirname, "..", "..");

// `revalidatePath` needs Next's static-generation store, which does not exist in
// a plain node test. Stub it: these tests are about the AUTH GATE, not about
// Next's cache internals. A call reaching the stub means auth already passed.
const revalidated: string[] = [];
vi.mock("next/cache", () => ({
  revalidatePath: (p: string) => { revalidated.push(p); },
  revalidateTag: () => {},
}));

describe("no unverifiable rating markup is emitted", () => {
  it("the schema module contains no aggregateRating or review counts", async () => {
    const src = readFileSync(join(ROOT, "src/lib/schemas.ts"), "utf8");
    // Allowed in the explanatory comment only if it is not part of an object
    // literal; assert on the emitted structure instead of on prose.
    const mod = await import("@/lib/schemas");
    const emitted = JSON.stringify(
      Object.entries(mod)
        .filter(([, v]) => typeof v === "function")
        .map(([name, fn]) => {
          try {
            return { name, out: (fn as (a: unknown) => unknown)({
              name: "Rella Napa", street: "1541 3rd St", city: "Napa", state: "CA",
              zip: "94559", phone: "+17073582928", slug: "napa",
            }) };
          } catch { return { name, out: null }; }
        }),
    );
    for (const banned of ["aggregateRating", "AggregateRating", "ratingValue", "reviewCount", "bestRating"]) {
      expect(emitted, `${banned} must not be emitted`).not.toContain(banned);
    }
    // And the literal must be gone from the source object, not just unused.
    expect(src).not.toMatch(/aggregateRating\s*:/);
    expect(src).not.toMatch(/ratingValue\s*:/);
  });
});

describe("/api/revalidate fails CLOSED", () => {
  const ORIGINAL = process.env.SANITY_WEBHOOK_SECRET;

  beforeEach(() => { vi.resetModules(); });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.SANITY_WEBHOOK_SECRET;
    else process.env.SANITY_WEBHOOK_SECRET = ORIGINAL;
  });

  const post = (headers: Record<string, string> = {}) =>
    new Request("https://experiencerella.com/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ _type: "blogPost", slug: { current: "x" } }),
    });

  it("refuses when NO secret is configured (the old code accepted this)", async () => {
    delete process.env.SANITY_WEBHOOK_SECRET;
    const { POST } = await import("@/app/api/revalidate/route");
    const res = await POST(post() as never);
    expect(res.status).toBe(503);
    expect(res.status).not.toBe(200);
  });

  it("refuses when the secret is an EMPTY string", async () => {
    process.env.SANITY_WEBHOOK_SECRET = "";
    const { POST } = await import("@/app/api/revalidate/route");
    const res = await POST(post() as never);
    expect(res.status).toBe(503);
  });

  it("refuses a configured endpoint with a wrong or missing bearer token", async () => {
    process.env.SANITY_WEBHOOK_SECRET = "s3cr3t";
    const { POST } = await import("@/app/api/revalidate/route");
    expect((await POST(post() as never)).status).toBe(401);
    expect((await POST(post({ authorization: "Bearer wrong" }) as never)).status).toBe(401);
  });

  it("accepts only the correct bearer token, and only then revalidates", async () => {
    process.env.SANITY_WEBHOOK_SECRET = "s3cr3t";
    revalidated.length = 0;
    const { POST } = await import("@/app/api/revalidate/route");
    const res = await POST(post({ authorization: "Bearer s3cr3t" }) as never);
    expect(res.status).toBe(200);
    expect(revalidated).toContain("/blog");
  });

  it("an unauthenticated request revalidates NOTHING", async () => {
    delete process.env.SANITY_WEBHOOK_SECRET;
    revalidated.length = 0;
    const { POST } = await import("@/app/api/revalidate/route");
    await POST(post() as never);
    expect(revalidated).toEqual([]);
  });

  it("the fail-open shape can never come back", () => {
    const src = readFileSync(join(ROOT, "src/app/api/revalidate/route.ts"), "utf8");
    // The defect was a truthiness guard that skipped auth when unset.
    expect(src).not.toMatch(/if\s*\(\s*SANITY_WEBHOOK_SECRET\s*&&/);
    expect(src).toMatch(/if\s*\(\s*!\s*SANITY_WEBHOOK_SECRET\s*\)/);
  });
});
