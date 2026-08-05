import Script from "next/script";

/** Reject malformed values before embedding an environment variable in JS. */
export const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,}$/;

const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_ID =
  RAW_GA_ID && GA_MEASUREMENT_ID_PATTERN.test(RAW_GA_ID.trim())
    ? RAW_GA_ID.trim()
    : undefined;

/**
 * Queue GA4 commands immediately in the page's JavaScript context. This is the
 * standard gtag bootstrap and does not depend on a React effect running after
 * hydration. The guard prevents duplicate configuration after route remounts.
 */
function buildGoogleAnalyticsBootstrap(measurementId: string) {
  return `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
    var alreadyConfigured = window.dataLayer.some(function(entry) {
      return entry && entry[0] === "config" && entry[1] === "${measurementId}";
    });
    if (!alreadyConfigured) {
      window.gtag("js", new Date());
      window.gtag("config", "${measurementId}");
    }
  `;
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-bootstrap" strategy="afterInteractive">
        {buildGoogleAnalyticsBootstrap(GA_ID)}
      </Script>
    </>
  );
}
