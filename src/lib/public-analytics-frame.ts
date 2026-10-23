export const PUBLIC_ANALYTICS_ORIGIN = "https://analytics.experiencerella.com";
export const PUBLIC_ANALYTICS_FRAME_PATH = "/api/public-analytics/frame";
export const PUBLIC_ANALYTICS_CLEAR_PATH = "/api/public-analytics/clear";
export const PUBLIC_ANALYTICS_MESSAGE_TYPE = "rella-public-analytics-v1";
export const PUBLIC_ANALYTICS_MEASUREMENT_ID = "G-WKDS1158Y1";

export const PUBLIC_ANALYTICS_PARENT_ORIGINS = [
  "https://experiencerella.com",
  "https://www.experiencerella.com",
] as const;

export const PUBLIC_ANALYTICS_PAGE_GROUPS = [
  "homepage", "napa", "vacaville", "treatments", "about", "team",
  "contact", "membership", "other_public",
] as const;
export const PUBLIC_ANALYTICS_SOURCES = [
  "direct_or_unknown", "google", "google_business_profile", "bing", "yahoo",
  "duckduckgo", "facebook", "instagram", "tiktok", "youtube", "linkedin",
  "email", "newsletter", "sms", "partner", "referral", "other",
] as const;
export const PUBLIC_ANALYTICS_MEDIA = [
  "none", "unknown", "organic", "cpc", "ppc", "paid_search", "social", "paid_social", "email",
  "sms", "referral",
] as const;

export type PublicAnalyticsPageGroup = typeof PUBLIC_ANALYTICS_PAGE_GROUPS[number];
export type PublicAnalyticsSource = typeof PUBLIC_ANALYTICS_SOURCES[number];
export type PublicAnalyticsMedium = typeof PUBLIC_ANALYTICS_MEDIA[number];

export type PublicAnalyticsPageViewMessage = {
  type: typeof PUBLIC_ANALYTICS_MESSAGE_TYPE;
  action: "page_view";
  navigationId: string;
  pageGroup: PublicAnalyticsPageGroup;
  source: PublicAnalyticsSource;
  medium: PublicAnalyticsMedium;
};
export type PublicAnalyticsDisposeMessage = {
  type: typeof PUBLIC_ANALYTICS_MESSAGE_TYPE;
  action: "dispose";
};

const PAGE_METADATA: Record<PublicAnalyticsPageGroup, { location: string; title: string }> = {
  homepage: { location: "https://experiencerella.com/", title: "Rella Aesthetics" },
  napa: { location: "https://experiencerella.com/locations/napa", title: "Rella Aesthetics Napa" },
  vacaville: { location: "https://experiencerella.com/locations/vacaville", title: "Rella Aesthetics Vacaville" },
  treatments: { location: "https://experiencerella.com/services", title: "Rella Aesthetics Treatments" },
  about: { location: "https://experiencerella.com/about", title: "About Rella Aesthetics" },
  team: { location: "https://experiencerella.com/team", title: "Rella Aesthetics Team" },
  contact: { location: "https://experiencerella.com/contact", title: "Contact Rella Aesthetics" },
  membership: { location: "https://experiencerella.com/membership", title: "Rella Aesthetics Membership" },
  other_public: { location: "https://experiencerella.com/", title: "Rella Aesthetics" },
};

export const PUBLIC_ANALYTICS_COOKIE_NAMES = ["_ga", "_ga_WKDS1158Y1"] as const;
export const PUBLIC_ANALYTICS_MAX_PENDING = 32;
export const PUBLIC_ANALYTICS_MAX_NAVIGATIONS = 256;

export function isPublicAnalyticsOrigin(origin: string | null): boolean {
  return PUBLIC_ANALYTICS_PARENT_ORIGINS.some(allowed => origin === allowed);
}

export function isPublicAnalyticsRequest(request: Request): boolean {
  try {
    const url = new URL(request.url);
    const suppliedHost = request.headers.get("host");
    return url.origin === PUBLIC_ANALYTICS_ORIGIN && !url.username && !url.password
      && !url.search && !url.hash
      && (!suppliedHost || suppliedHost.toLowerCase() === url.host);
  } catch {
    return false;
  }
}

export function publicAnalyticsBaseHeaders(): Headers {
  return new Headers({
    "Cache-Control": "no-store, private, max-age=0, must-revalidate",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  });
}

export function publicAnalyticsFrameHeaders(nonce: string): Headers {
  const headers = publicAnalyticsBaseHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Content-Security-Policy", [
    "default-src 'none'",
    `script-src 'nonce-${nonce}' https://www.googletagmanager.com`,
    "connect-src https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://region1.analytics.google.com https://www.googletagmanager.com",
    "img-src https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    `frame-ancestors ${PUBLIC_ANALYTICS_PARENT_ORIGINS.join(" ")}`,
    "frame-src 'none'", "form-action 'none'", "base-uri 'none'", "object-src 'none'",
  ].join("; "));
  return headers;
}

/** This document has no app UI or identifiers beyond its own consented GA cookies. */
export function renderPublicAnalyticsFrame(nonce: string): string {
  if (!/^[A-Za-z0-9+/_-]{16,128}={0,2}$/.test(nonce)) throw new Error("Invalid analytics nonce");
  const config = JSON.stringify({
    origin: PUBLIC_ANALYTICS_ORIGIN,
    parents: PUBLIC_ANALYTICS_PARENT_ORIGINS,
    namespace: PUBLIC_ANALYTICS_MESSAGE_TYPE,
    measurementId: PUBLIC_ANALYTICS_MEASUREMENT_ID,
    pages: PAGE_METADATA,
    sources: PUBLIC_ANALYTICS_SOURCES,
    media: PUBLIC_ANALYTICS_MEDIA,
    cookies: PUBLIC_ANALYTICS_COOKIE_NAMES,
    maxPending: PUBLIC_ANALYTICS_MAX_PENDING,
    maxNavigations: PUBLIC_ANALYTICS_MAX_NAVIGATIONS,
  });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>Rella analytics</title></head><body><script nonce="${nonce}">
(function () {
  "use strict";
  var settings = ${config};
  if (window.location.origin !== settings.origin || window.parent === window) return;
  var disposed = false;
  var loading = false;
  var loaded = false;
  var loader = null;
  var pending = [];
  var seen = new Set();
  var navigationPattern = /^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/;
  var deniedConsent = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

  function ownKeys(value, expected) {
    return value && typeof value === "object" && !Array.isArray(value)
      && Object.keys(value).length === expected.length
      && expected.every(function (key) { return Object.prototype.hasOwnProperty.call(value, key); });
  }
  function clearCookies() {
    settings.cookies.forEach(function (name) {
      document.cookie = name + "=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; SameSite=Lax";
    });
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    window["ga-disable-" + settings.measurementId] = true;
    pending.length = 0;
    if (window.gtag) window.gtag("consent", "update", deniedConsent);
    clearCookies();
    if (loader) loader.remove();
    window.removeEventListener("message", receive);
  }
  function metadata(message) {
    var page = settings.pages[message.pageGroup];
    var fields = { page_location: page.location, page_title: page.title, page_referrer: "" };
    if (message.source !== "direct_or_unknown") {
      fields.campaign_source = message.source;
      fields.campaign_medium = message.medium;
    }
    return fields;
  }
  function send(message) {
    if (disposed) return;
    var fields = metadata(message);
    // Automatic session/engagement events inherit only this bounded context.
    window.gtag("set", fields);
    window.gtag("event", "page_view", Object.assign({ send_to: settings.measurementId }, fields));
  }
  function load(first) {
    if (loading || loaded || disposed) return;
    loading = true;
    window.dataLayer = [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window["ga-disable-" + settings.measurementId] = false;
    window.gtag("consent", "default", deniedConsent);
    window.gtag("set", Object.assign({ allow_google_signals: false,
      allow_ad_personalization_signals: false, ads_data_redaction: true, url_passthrough: false }, metadata(first)));
    window.gtag("js", new Date());
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("config", settings.measurementId, { send_page_view: false,
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: "none", cookie_flags: "SameSite=Lax;Secure", cookie_expires: 2592000,
      cookie_update: false });
    loader = document.createElement("script");
    loader.async = true;
    loader.referrerPolicy = "no-referrer";
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + settings.measurementId;
    loader.onload = function () {
      if (disposed) return;
      loaded = true;
      loading = false;
      var queued = pending;
      pending = [];
      queued.forEach(send);
    };
    loader.onerror = dispose;
    document.head.appendChild(loader);
  }
  function receive(event) {
    if (disposed || event.source !== window.parent || settings.parents.indexOf(event.origin) === -1) return;
    var message = event.data;
    if (ownKeys(message, ["type", "action"]) && message.type === settings.namespace && message.action === "dispose") {
      dispose();
      return;
    }
    if (!ownKeys(message, ["type", "action", "navigationId", "pageGroup", "source", "medium"])
      || message.type !== settings.namespace || message.action !== "page_view"
      || typeof message.navigationId !== "string" || !navigationPattern.test(message.navigationId)
      || typeof message.pageGroup !== "string" || typeof message.source !== "string" || typeof message.medium !== "string"
      || !Object.prototype.hasOwnProperty.call(settings.pages, message.pageGroup)
      || settings.sources.indexOf(message.source) === -1 || settings.media.indexOf(message.medium) === -1
      || seen.has(message.navigationId) || seen.size >= settings.maxNavigations
      || (!loaded && pending.length >= settings.maxPending)) return;
    seen.add(message.navigationId);
    if (loaded) send(message);
    else { pending.push(message); load(message); }
  }
  window.addEventListener("message", receive);
  settings.parents.forEach(function (origin) {
    window.parent.postMessage({ type: settings.namespace, action: "ready" }, origin);
  });
})();
</script></body></html>`;
}
