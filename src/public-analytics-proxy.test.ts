import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch, unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { config, proxy } from "./proxy";
import nextConfig from "../next.config";
import legacyRedirects from "../legacy-redirects.json";

const ORIGIN = "https://analytics.experiencerella.com";
const request = (path: string, host = "analytics.experiencerella.com") =>
  new NextRequest(`${ORIGIN}${path}`, { headers: { host } });

describe("isolated analytics origin", () => {
  it("excludes the exact analytics host from every configured legacy redirect", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toHaveLength(legacyRedirects.length * 2);
    for (const { source, destination } of legacyRedirects) {
      for (const path of [source, `${source}/`]) {
        const redirect = redirects.find(rule => rule.source === path);
        expect(redirect, path).toMatchObject({
          destination, permanent: true,
          missing: [{ type: "host", value: "analytics\\.experiencerella\\.com" }],
        });
      }
    }
  });

  it.each(["/botox", "/botox/", "/napa", "/napa/", "/sitemap_index.xml"])(
    "reaches the analytics guard without a config redirect for %s",
    async path => {
      const response = await unstable_getResponseFromNextConfig({
        url: `${ORIGIN}${path}`, nextConfig,
      });
      expect(response.headers.get("location")).toBeNull();
      expect(proxy(request(path)).status).toBe(404);
    },
  );

  it.each([
    "experiencerella.com", "www.experiencerella.com", "weightloss.experiencerella.com",
    "rella-napa-botox-release.vercel.app", "rella-aesthetics.vercel.app",
    "analytics.experiencerella.com.evil.com", "analyticsXexperiencerellaXcom",
  ])("preserves the legacy redirect and query on other hosts: %s", async host => {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://${host}/botox/?utm_source=google`, nextConfig,
    });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`https://${host.toLowerCase()}/services/botox?utm_source=google`);
  });

  it.each(["/api/public-analytics/frame", "/api/public-analytics/clear"])(
    "permits only the exact document endpoint %s",
    path => {
      const response = proxy(request(path));
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(response.headers.get("location")).toBeNull();
    },
  );

  it.each([
    "/", "/contact", "/booking", "/locations/napa", "/studio", "/studio/desk",
    "/api/leads", "/api/revalidate", "/_next/static/chunks/app.js",
    "/_next/image?url=%2Fimages%2Fhero.jpg&w=640&q=75", "/favicon.ico",
    "/sitemap.xml", "/api/public-analytics/frame/", "/api/public-analytics/clear/",
    "/api/public-analytics/frame?source=unknown", "/robots.txt?query=unknown",
  ])("blocks application or variant path %s without redirecting", async path => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: `${ORIGIN}${path}` })).toBe(true);
    const response = proxy(request(path));
    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBeNull();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe("Not Found");
  });

  it("serves only a nonindexable disallow-all robots document", async () => {
    const response = proxy(request("/robots.txt"));
    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).toBe("User-agent: *\nDisallow: /\n");
  });

  it("fails closed on URL/Host disagreements and insecure origin", () => {
    for (const req of [
      request("/api/public-analytics/frame", "experiencerella.com"),
      new NextRequest("https://experiencerella.com/api/public-analytics/frame", {
        headers: { host: "analytics.experiencerella.com" },
      }),
      new NextRequest("http://analytics.experiencerella.com/api/public-analytics/frame", {
        headers: { host: "analytics.experiencerella.com" },
      }),
    ]) expect(proxy(req).status).toBe(404);
  });

  it("preserves the previous image optimizer bypass on all other hosts", () => {
    for (const host of [
      "experiencerella.com", "www.experiencerella.com", "weightloss.experiencerella.com",
      "rella-napa-botox-release.vercel.app", "rella-aesthetics.vercel.app",
    ]) {
      const response = proxy(new NextRequest(`https://${host}/_next/image?url=%2Fhero.jpg&w=640&q=75`, {
        headers: { host },
      }));
      expect(response.headers.get("x-middleware-next"), host).toBe("1");
    }
  });
});
