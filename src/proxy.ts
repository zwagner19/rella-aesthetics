import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAestheticsHost,
  isCrossSiteLegacyWeightLossHost,
  isLegacyWeightLossHost,
  isWeightLossCityLandingPath,
  isWeightLossHost,
  WEIGHT_LOSS_HOST,
  WEIGHT_LOSS_ORIGIN,
} from "@/lib/site-hosts";
export {
  isCrossSiteLegacyWeightLossHost,
  isLegacyWeightLossHost,
  isWeightLossCityLandingPath,
  isWeightLossHost,
} from "@/lib/site-hosts";

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
const WEIGHT_LOSS_SEO_DOCUMENTS = new Set(["/robots.txt", "/sitemap.xml", "/sitemap-0.xml"]);
const WEIGHT_LOSS_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${WEIGHT_LOSS_ORIGIN}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`;
const RETIRED_PUBLIC_PATHS = new Set(["/events", "/upcoming-events"]);
const ATTRIBUTION_QUERY_KEYS = [
  "gclid", "gbraid", "wbraid", "gclsrc", "campaignid", "adgroupid",
  "gad_campaignid", "gad_adgroupid", "utm_source", "utm_medium",
  "utm_campaign", "utm_content", "utm_term", "keyword", "matchtype",
  "device", "network", "gad_keyword", "gad_matchtype", "gad_device",
  "gad_network",
] as const;

function stripAttributionQuery(url: URL) {
  for (const key of ATTRIBUTION_QUERY_KEYS) url.searchParams.delete(key);
}

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

/** Match only the two owner-retired public paths, with an optional trailing slash. */
export function isRetiredPublicPath(pathname: string): boolean {
  if (RETIRED_PUBLIC_PATHS.has(pathname)) return true;
  return pathname.endsWith("/") && RETIRED_PUBLIC_PATHS.has(pathname.slice(0, -1));
}

/** Preserve Next's prior slashless canonical behavior after opting out globally. */
export function shouldNormalizeTrailingSlash(pathname: string): boolean {
  if (pathname === "/" || !pathname.endsWith("/")) return false;
  const slashless = pathname.slice(0, -1);
  const finalSegment = slashless.split("/").at(-1) ?? "";
  return !finalSegment.includes(".");
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (isLegacyWeightLossHost(host)) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = WEIGHT_LOSS_HOST;
    canonicalUrl.port = "";
    if (isCrossSiteLegacyWeightLossHost(host)) {
      stripAttributionQuery(canonicalUrl);
    }
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (isWeightLossHost(host)) {
    const { pathname } = request.nextUrl;

    if (pathname.endsWith("/") && WEIGHT_LOSS_SEO_DOCUMENTS.has(pathname.slice(0, -1))) {
      const canonicalUrl = new URL(request.url);
      canonicalUrl.pathname = canonicalUrl.pathname.slice(0, -1);
      return NextResponse.redirect(canonicalUrl, 308);
    }

    if (pathname === "/robots.txt") {
      return new NextResponse(
        `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /studio/\nSitemap: ${WEIGHT_LOSS_ORIGIN}/sitemap.xml\n`,
        { headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }

    if (pathname === "/sitemap.xml" || pathname === "/sitemap-0.xml") {
      return new NextResponse(WEIGHT_LOSS_SITEMAP, {
        headers: { "content-type": "application/xml; charset=utf-8" },
      });
    }

    if (
      pathname === "/" ||
      isWeightLossCityLandingPath(pathname) ||
      isWeightLossAsset(pathname)
    ) {
      return NextResponse.next();
    }

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
    stripAttributionQuery(mainSiteUrl);
    return NextResponse.redirect(mainSiteUrl, 308);
  }

  if (!isReleaseOriginHost(host)) {
    if (
      isAestheticsHost(host) &&
      (request.nextUrl.pathname === "/services/weight-loss" ||
        request.nextUrl.pathname === "/services/weight-loss/")
    ) {
      const weightLossUrl = request.nextUrl.clone();
      weightLossUrl.protocol = "https:";
      weightLossUrl.hostname = WEIGHT_LOSS_HOST;
      weightLossUrl.port = "";
      weightLossUrl.pathname = "/";
      stripAttributionQuery(weightLossUrl);
      return NextResponse.redirect(weightLossUrl, 308);
    }
    if (isWeightLossCityLandingPath(request.nextUrl.pathname)) {
      if (isAestheticsHost(host)) {
        const weightLossUrl = request.nextUrl.clone();
        weightLossUrl.protocol = "https:";
        weightLossUrl.hostname = WEIGHT_LOSS_HOST;
        weightLossUrl.port = "";
        stripAttributionQuery(weightLossUrl);
        return NextResponse.redirect(weightLossUrl, 308);
      }
      return new NextResponse("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (isRetiredPublicPath(request.nextUrl.pathname)) {
      return new NextResponse("Gone", {
        status: 410,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (shouldNormalizeTrailingSlash(request.nextUrl.pathname)) {
      const canonicalUrl = new URL(request.url);
      canonicalUrl.pathname = canonicalUrl.pathname.slice(0, -1);
      return NextResponse.redirect(canonicalUrl, 308);
    }
    return NextResponse.next();
  }

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
