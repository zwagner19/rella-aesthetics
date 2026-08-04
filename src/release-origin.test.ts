import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  proxy,
  isReleaseOriginHost,
  isAllowedOnReleaseOrigin,
  isWeightLossHost,
} from "./proxy";

/**
 * Release-origin surface guard.
 *
 * Without this, the release alias would expose the ENTIRE application to anyone
 * who guessed the hostname. That is not abstract: `sanity` is a PRODUCTION
 * dependency because Studio mounts at `/studio`, so the Studio toolchain — and
 * its current critical/high advisories — ships in the production tree. Blocking
 * `/studio` here is what keeps it unreachable from the public origin.
 */

const RELEASE = "rella-napa-botox-release.vercel.app";
const WEIGHT_LOSS = "weightloss.experiencerella.com";
const req = (path: string, host: string) =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });

describe("medical weight-loss subdomain", () => {
  it("matches only the exact branded hostname", () => {
    expect(isWeightLossHost(WEIGHT_LOSS)).toBe(true);
    expect(isWeightLossHost(WEIGHT_LOSS.toUpperCase())).toBe(true);
    expect(isWeightLossHost(`${WEIGHT_LOSS}:443`)).toBe(true);

    for (const host of [
      "experiencerella.com",
      "www.experiencerella.com",
      "weightloss.experiencerella.com.evil.com",
      "notweightloss.experiencerella.com",
      "rella-aesthetics.vercel.app",
    ]) {
      expect(isWeightLossHost(host), `must not match: ${host}`).toBe(false);
    }
  });

  it("does not rewrite the subdomain root during hydration", () => {
    const response = proxy(req("/?utm_source=google&gclid=test-click", WEIGHT_LOSS));
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("renders the qualification funnel from the real root page for that host", () => {
    const rootPage = readFileSync(join(__dirname, "app", "(site)", "page.tsx"), "utf8");
    expect(rootPage).toContain("isWeightLossHost(host)");
    expect(rootPage).toContain("<WeightLossServicePage />");
  });

  it("does not rewrite paths or the main domains", () => {
    for (const [path, host] of [
      ["/services/weight-loss", WEIGHT_LOSS],
      ["/", "experiencerella.com"],
      ["/", "www.experiencerella.com"],
    ] as const) {
      expect(proxy(req(path, host)).headers.get("x-middleware-rewrite")).toBeNull();
    }
  });
});

describe("release-origin host matching", () => {
  it("matches the base release host and suffixed variants", () => {
    expect(isReleaseOriginHost(RELEASE)).toBe(true);
    expect(isReleaseOriginHost("rella-napa-botox-release-a1b2c3.vercel.app")).toBe(true);
    expect(isReleaseOriginHost(RELEASE.toUpperCase())).toBe(true);
    expect(isReleaseOriginHost(`${RELEASE}:443`)).toBe(true);
  });

  it("does NOT match ordinary preview aliases or the public host", () => {
    for (const h of [
      "rella-aesthetics.vercel.app",
      "rella-aesthetics-hblc.vercel.app",
      "rella-nextjs.vercel.app",
      "rella-aesthetics-git-prep-2026-07-27-5e5411-zwagner19s-projects.vercel.app",
      "rella-aesthetics-2mjynxd6g-zwagner19s-projects.vercel.app",
      "experiencerella.com",
      "www.experiencerella.com",
      "localhost:3000",
      // Suffix attack: the anchored pattern must reject this.
      "rella-napa-botox-release.vercel.app.evil.com",
      "evil-rella-napa-botox-release.vercel.app",
    ]) {
      expect(isReleaseOriginHost(h), `must not match: ${h}`).toBe(false);
    }
  });
});

describe("BLOCKED on the release alias — the whole application surface", () => {
  const BLOCKED = [
    "/", "/studio", "/studio/anything", "/studio/desk/post",
    "/api/leads", "/api/revalidate", "/booking",
    "/locations/napa", "/services/botox", "/wp-admin/", "/napa/botox/extra",
    "/about", "/contact", "/blog", "/membership", "/gallery",
    "/napa/botoxx", "/brand/other.svg", "/_next/image", "/sitemap.xml",
  ];
  for (const p of BLOCKED) {
    it(`404s ${p}`, () => {
      const res = proxy(req(p, RELEASE));
      expect(res.status, p).toBe(404);
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      // No redirect — a 3xx would leak that the route exists and where it lives.
      expect(res.headers.get("location")).toBeNull();
    });
  }

  it("the blocked body contains no application detail", async () => {
    const body = await proxy(req("/studio", RELEASE)).text();
    expect(body).toBe("Not Found");
    for (const leak of ["studio", "sanity", "next", "api", "stack", "Error"]) {
      expect(body.toLowerCase()).not.toContain(leak.toLowerCase());
    }
  });

  it("API and Studio requests are intercepted, never executed", () => {
    // A 404 from the guard means the route handler never ran.
    for (const p of ["/api/leads", "/api/revalidate", "/studio"]) {
      expect(proxy(req(p, RELEASE)).status).toBe(404);
    }
  });

  it("traversal into the asset prefix is blocked", () => {
    expect(isAllowedOnReleaseOrigin("/_next/static/../../etc/passwd")).toBe(false);
  });
});

describe("ALLOWED on the release alias — exactly the campaign surface", () => {
  for (const p of ["/napa/botox", "/napa/botox/", "/brand/rella-logo-black.svg",
                   "/favicon.ico", "/_next/static/chunks/a.js", "/_next/static/media/f.woff2"]) {
    it(`permits ${p}`, () => {
      expect(isAllowedOnReleaseOrigin(p), p).toBe(true);
      expect(proxy(req(p, RELEASE)).status).not.toBe(404);
    });
  }
});

describe("no other host is affected", () => {
  const HOSTS = ["experiencerella.com", "www.experiencerella.com", "rella-aesthetics.vercel.app", "localhost:3000"];
  for (const h of HOSTS) {
    it(`${h} keeps full application access`, () => {
      for (const p of ["/", "/studio", "/api/leads", "/napa/botox/", "/services/botox"]) {
        expect(proxy(req(p, h)).status, `${h}${p}`).not.toBe(404);
      }
    });
  }
  it("a missing Host header is treated as non-release (no accidental lockout)", () => {
    const r = new NextRequest("https://example.com/studio");
    r.headers.delete("host");
    expect(proxy(r).status).not.toBe(404);
  });
});
