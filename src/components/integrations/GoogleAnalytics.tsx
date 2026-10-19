import Script from "next/script";

/** Reject malformed values before embedding an environment variable in JS. */
export const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,}$/;

/**
 * Only the real public site may send data to the shared GA4 property.
 * Vercel production/preview hosts (*.vercel.app), localhost, and any other
 * staging domain would otherwise pollute Rella's live analytics.
 */
export const GA_ALLOWED_HOSTNAMES = ["experiencerella.com", "www.experiencerella.com"];

const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_ID =
  RAW_GA_ID && GA_MEASUREMENT_ID_PATTERN.test(RAW_GA_ID.trim())
    ? RAW_GA_ID.trim()
    : undefined;

/**
 * Queue GA4 commands immediately in the page's JavaScript context. This is the
 * standard gtag bootstrap and does not depend on a React effect running after
 * hydration. The guard prevents duplicate configuration after route remounts.
 *
 * gtag.js is injected here (instead of a separate <Script src>) so that
 * nothing loads or sends on hosts outside GA_ALLOWED_HOSTNAMES. A no-op
 * window.gtag is still defined on other hosts so booking-intent calls never
 * throw.
 */
function buildGoogleAnalyticsBootstrap(measurementId: string) {
  return `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
    var host = (window.location && window.location.hostname || "").toLowerCase();
    var allowed = ${JSON.stringify(GA_ALLOWED_HOSTNAMES)}.indexOf(host) !== -1;
    if (allowed) {
      var alreadyConfigured = window.dataLayer.some(function(entry) {
        return entry && entry[0] === "config" && entry[1] === "${measurementId}";
      });
      if (!alreadyConfigured) {
        window.gtag("js", new Date());
        window.gtag("config", "${measurementId}");
        if (window.document && window.document.createElement) {
          var s = window.document.createElement("script");
          s.async = true;
          s.id = "google-analytics-loader";
          s.src = "https://www.googletagmanager.com/gtag/js?id=${measurementId}";
          window.document.head.appendChild(s);
        }
      }
    }
  `;
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <Script id="google-analytics-bootstrap" strategy="afterInteractive">
      {buildGoogleAnalyticsBootstrap(GA_ID)}
    </Script>
  );
}
