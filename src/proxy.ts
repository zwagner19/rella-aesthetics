import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isWeightLossHost } from "@/lib/site-hosts";
export { isWeightLossHost } from "@/lib/site-hosts";

/**
 * Release-origin surface guard.
 *
 * The public edge Worker fetches this application from a dedicated release
 * alias. Without this guard that alias would expose the ENTIRE application to
 * anyone who guessed the hostname — `/studio`, `/api/leads`, `/api/revalidate`,
 * the legacy `/booking` page, and every ordinary marketing route.
 *
 * That is not theoretical exposure. `sanity` is a PRODUCTION dependency because
 * Studio is mounted at `/studio`, so the Studio toolchain (including current
 * high-severity transitive advisories) ships in
 * the production tree. Blocking `/studio` on the release alias is what keeps
 * that toolchain unreachable from the public origin.
 *
 * On the release alias the surface is exactly the campaign page and the assets
 * it needs. Everything else is a plain 404 — no redirect (which would leak the
 * existence and location of a route), no body containing application detail, no
 * API execution, no Studio execution.
 *
 * Every other host is untouched: ordinary Vercel previews, the canonical project
 * alias, localhost, and the eventual public `experiencerella.com` all behave
 * exactly as they do today.
 *
 * Uses the Next.js 16 `proxy` file convention (`middleware` is deprecated).
 */

/**
 * Release-origin hostname family. The optional `-[a-z0-9]+` suffix covers a
 * suffixed variant if the base name is unavailable at assignment time.
 * Anchored at both ends so `rella-napa-botox-release.vercel.app.evil.com`
 * cannot match.
 */
const RELEASE_ORIGIN_HOST = /^rella-napa-botox-release(?:-[a-z0-9]+)?\.vercel\.app$/;

/** The only paths the release origin may serve. */
const ALLOWED_EXACT = new Set([
  "/napa/botox",
  "/napa/botox/",
  "/brand/rella-logo-black.svg",
  "/favicon.ico",
]);
const ALLOWED_PREFIXES = ["/_next/static/"];

const WEIGHT_LOSS_ASSET_PREFIXES = ["/_next/", "/brand/", "/images/", "/media/"];
const WEIGHT_LOSS_EXACT_ASSETS = new Set(["/favicon.ico", "/opengraph-image", "/twitter-image"]);
const WEIGHT_LOSS_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://weightloss.experiencerella.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`;

export function isWeightLossAsset(pathname: string): boolean {
  return (
    WEIGHT_LOSS_EXACT_ASSETS.has(pathname) ||
    WEIGHT_LOSS_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix) && !pathname.includes(".."))
  );
}

export function isReleaseOriginHost(host: string | null | undefined): boolean {
  if (!host) return false;
  // Strip any port before matching; compare lowercase.
  return RELEASE_ORIGIN_HOST.test(host.split(":")[0].trim().toLowerCase());
}

export function isAllowedOnReleaseOrigin(pathname: string): boolean {
  if (ALLOWED_EXACT.has(pathname)) return true;
  return ALLOWED_PREFIXES.some((p) => pathname.startsWith(p) && !pathname.includes(".."));
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (isWeightLossHost(host)) {
    const { pathname } = request.nextUrl;

    if (pathname === "/robots.txt") {
      return new NextResponse(
        "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /studio/\nSitemap: https://weightloss.experiencerella.com/sitemap.xml\n",
        { headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }

    if (pathname === "/sitemap.xml" || pathname === "/sitemap-0.xml") {
      return new NextResponse(WEIGHT_LOSS_SITEMAP, {
        headers: { "content-type": "application/xml; charset=utf-8" },
      });
    }

    if (pathname === "/" || isWeightLossAsset(pathname)) return NextResponse.next();

    if (pathname.startsWith("/api/") || pathname.startsWith("/studio")) {
      return new NextResponse("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }

    if (pathname === "/services/weight-loss" || pathname === "/services/weight-loss/") {
      const canonicalWeightLossUrl = request.nextUrl.clone();
      canonicalWeightLossUrl.pathname = "/";
      return NextResponse.redirect(canonicalWeightLossUrl, 308);
    }

    const mainSiteUrl = request.nextUrl.clone();
    mainSiteUrl.protocol = "https:";
    mainSiteUrl.hostname = "experiencerella.com";
    mainSiteUrl.port = "";
    return NextResponse.redirect(mainSiteUrl, 308);
  }

  if (!isReleaseOriginHost(host)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isAllowedOnReleaseOrigin(pathname)) {
    // Allowed campaign surface. The alias-wide noindex still applies via the
    // host-matched header rule in next.config.ts; the edge strips it for the
    // verified public response only.
    return NextResponse.next();
  }

  // Blocked. A plain 404 with no redirect and no application detail in the body.
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  /**
   * Run on everything except Next's internal image/HMR endpoints, so that API
   * routes and Studio are genuinely intercepted rather than bypassed. Static
   * assets still pass through the matcher and are explicitly allowlisted above.
   */
  matcher: ["/((?!_next/image).*)"],
};
