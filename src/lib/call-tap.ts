/**
 * Phone-link tap reporting for ordinary site routes.
 *
 * When a visitor taps the clinic phone link, the site reports one small,
 * fixed-shape message to Rella's booking host: the visit's UTM tags, which
 * kind of ad click ID was present (never the ID itself), the referring site's
 * host name, the landing page, and the current page. Rella HQ later pairs the
 * tap with the RingCentral call that starts right after it, only when the
 * pairing is one-to-one. No cookies are set and nothing identifies the person.
 */
export const CALL_TAP_ENDPOINT = "https://book.experiencerella.com/api/booking-v2/call-tap";
export const CALL_TAP_ALLOWED_HOSTNAMES = ["experiencerella.com", "www.experiencerella.com"];
export const CALL_TAP_LANDING_KEY = "rella_call_tap_landing_v1";
/** Both clinics share this line. */
export const CLINIC_LINE_DIGITS = "7073582928";

export type CallTapLanding = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  clickIdType: "google" | "microsoft" | "meta" | null;
  referrerHost: string | null;
  landingPath: string | null;
};

const TOKEN_RE = /^[A-Za-z0-9_ .:+|()/-]{1,100}$/;
const HOST_RE = /^[a-z0-9.-]{1,253}$/;
const PATH_RE = /^\/[A-Za-z0-9_./~%-]{0,300}$/;

function token(value: string | null): string | null {
  const trimmed = value?.trim().slice(0, 100) ?? "";
  return trimmed && TOKEN_RE.test(trimmed) ? trimmed : null;
}

export function safePath(pathname: string): string | null {
  const path = pathname.slice(0, 301);
  return PATH_RE.test(path) ? path : null;
}

/** Builds the landing summary from the first page of a tab session. */
export function landingFromLocation(href: string, referrer: string): CallTapLanding {
  const url = new URL(href);
  const params = url.searchParams;
  const clickIdType = params.has("gclid") || params.has("gbraid") || params.has("wbraid")
    ? "google"
    : params.has("msclkid") ? "microsoft"
    : params.has("fbclid") ? "meta"
    : null;
  let referrerHost: string | null = null;
  try {
    if (referrer) {
      const parsed = new URL(referrer);
      const host = parsed.protocol === "android-app:" ? parsed.host || parsed.pathname.replace(/^\/\//, "") : parsed.hostname;
      const lower = host.toLowerCase();
      referrerHost = HOST_RE.test(lower) ? lower : null;
    }
  } catch {
    referrerHost = null;
  }
  return {
    utmSource: token(params.get("utm_source")),
    utmMedium: token(params.get("utm_medium")),
    utmCampaign: token(params.get("utm_campaign")),
    clickIdType,
    referrerHost,
    landingPath: safePath(url.pathname),
  };
}

export function isClinicLine(href: string): boolean {
  if (!href.toLowerCase().startsWith("tel:")) return false;
  const digits = href.replace(/\D/g, "");
  return digits.endsWith(CLINIC_LINE_DIGITS);
}

export function readLanding(raw: string | null): CallTapLanding | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    const pick = (key: string, re: RegExp) =>
      typeof value[key] === "string" && re.test(value[key] as string) ? (value[key] as string) : null;
    const click = value.clickIdType;
    return {
      utmSource: pick("utmSource", TOKEN_RE),
      utmMedium: pick("utmMedium", TOKEN_RE),
      utmCampaign: pick("utmCampaign", TOKEN_RE),
      clickIdType: click === "google" || click === "microsoft" || click === "meta" ? click : null,
      referrerHost: pick("referrerHost", HOST_RE),
      landingPath: pick("landingPath", PATH_RE),
    };
  } catch {
    return null;
  }
}

/** Visitors who opt out of ad data, or send Global Privacy Control, are never reported. */
export function callTapAllowed(args: { hostname: string; globalPrivacyControl: boolean; cookie: string }): boolean {
  if (!CALL_TAP_ALLOWED_HOSTNAMES.includes(args.hostname)) return false;
  if (args.globalPrivacyControl) return false;
  return !/(?:^|;\s*)rella_ad_user_data_denied=/.test(args.cookie);
}

export function callTapBody(landing: CallTapLanding | null, pagePath: string) {
  return {
    v: 1 as const,
    utmSource: landing?.utmSource ?? null,
    utmMedium: landing?.utmMedium ?? null,
    utmCampaign: landing?.utmCampaign ?? null,
    clickIdType: landing?.clickIdType ?? null,
    referrerHost: landing?.referrerHost ?? null,
    landingPath: landing?.landingPath ?? null,
    pagePath: safePath(pagePath),
  };
}
