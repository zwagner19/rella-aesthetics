/**
 * Review-only experience enhancements.
 *
 * The public experiencerella.com host must never inherit an unapproved popup.
 * Local development is included so the exact preview experience can be tested
 * before a Vercel deployment exists.
 */
export function isPreviewExperienceHost(
  host: string | null | undefined,
  environment = process.env.NODE_ENV,
): boolean {
  if (!host) return false;

  const value = host.trim().toLowerCase().replace(/\.$/, "");
  const hostname = value.startsWith("[")
    ? value.slice(1, value.indexOf("]"))
    : value.replace(/:\d+$/, "");

  if (hostname.endsWith(".vercel.app")) return true;
  return (
    environment !== "production" &&
    (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1")
  );
}

const CAMPAIGN_PATHS = new Set([
  "/napa",
  "/napa/botox",
  "/napa/filler",
  "/napa/hydrafacial",
  "/napa/hyperhidrosis",
  "/napa/laser",
]);

const SENSITIVE_PATH_PREFIXES = [
  "/book",
  "/booking",
  "/cancellation-policy",
  "/contact",
  "/giveaway-terms-and-conditions",
  "/privacy-policy",
  "/services/weight-loss",
  "/studio",
  "/terms",
  "/weight-loss",
] as const;

const CAMPAIGN_QUERY_FIELDS = [
  "gclid",
  "gbraid",
  "wbraid",
  "gclsrc",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "campaignid",
  "adgroupid",
  "keyword",
  "matchtype",
  "device",
  "network",
  "gad_campaignid",
  "gad_adgroupid",
  "gad_keyword",
  "gad_matchtype",
  "gad_device",
  "gad_network",
] as const;

function normalizePathname(pathname: string | null | undefined): string {
  const path = (pathname || "/").trim().toLowerCase().split(/[?#]/, 1)[0];
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.length > 1
    ? withLeadingSlash.replace(/\/+$/, "")
    : withLeadingSlash;
}

/** Keep the chooser out of booking, lead forms, weight loss, and paid campaigns. */
export function shouldOfferPreviewClinicChooser(
  pathname: string | null | undefined,
  search = "",
): boolean {
  const path = normalizePathname(pathname);

  if (CAMPAIGN_PATHS.has(path)) return false;
  if (
    SENSITIVE_PATH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    )
  ) {
    return false;
  }

  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return !CAMPAIGN_QUERY_FIELDS.some((field) => query.has(field));
}
