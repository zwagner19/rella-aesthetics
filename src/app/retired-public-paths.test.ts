import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  isRetiredPublicPath,
  proxy,
  shouldNormalizeTrailingSlash,
} from "../proxy";

const request = (path: string, host = "experiencerella.com") =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });

describe("owner-retired public event paths", () => {
  it("matches only the exact slash and slashless event URLs", () => {
    for (const path of ["/events", "/events/", "/upcoming-events", "/upcoming-events/"]) {
      expect(isRetiredPublicPath(path), path).toBe(true);
    }

    for (const path of ["/", "/event", "/events/private", "/upcoming-events/archive"]) {
      expect(isRetiredPublicPath(path), path).toBe(false);
    }
  });

  it("returns an index-safe 410 with no redirect on the general website", () => {
    for (const path of ["/events", "/events/", "/upcoming-events", "/upcoming-events/"]) {
      const response = proxy(request(path));
      expect(response.status, path).toBe(410);
      expect(response.headers.get("location"), path).toBeNull();
      expect(response.headers.get("x-robots-tag"), path).toBe("noindex, nofollow");
    }
  });

  it("preserves slashless canonicals for ordinary pages and query strings", () => {
    expect(shouldNormalizeTrailingSlash("/about/")).toBe(true);
    expect(shouldNormalizeTrailingSlash("/")).toBe(false);
    expect(shouldNormalizeTrailingSlash("/favicon.ico/")).toBe(false);

    const response = proxy(request("/about/?utm_source=google"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://experiencerella.com/about?utm_source=google",
    );
  });

  it("does not widen the public 410 rule to the isolated weight-loss host", () => {
    const response = proxy(request("/events", "rellaweightloss.com"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://experiencerella.com/events");
  });

  it("canonicalizes the legacy weight-loss host before applying path policy", () => {
    const response = proxy(request("/events", "weightloss.experiencerella.com"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://rellaweightloss.com/events");
  });
});
