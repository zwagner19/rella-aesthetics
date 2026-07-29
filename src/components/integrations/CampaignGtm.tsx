import Script from "next/script";

/**
 * Google Tag Manager for CAMPAIGN routes only.
 *
 * Why this exists, and why it is not the site-wide integration:
 *
 * The public `experiencerella.com` page carries GTM today because WordPress puts
 * it there. When `/napa/botox/` is proxied to this Next.js build, the browser
 * receives the **Vercel document** — it does NOT inherit WordPress's GTM or GHL
 * scripts. Without this component the public page would silently lose marketing
 * measurement, and the already-prepared Napa GHL visitor-number-pool tag would
 * have no delivery mechanism.
 *
 * Deliberate boundaries:
 *  - Renders nothing when `NEXT_PUBLIC_GTM_ID` is absent, so staging and the
 *    ordinary site stay exactly as they are today.
 *  - Mounted only by the campaign layout. The `(site)` group is untouched, so no
 *    ordinary marketing route gains a second tag manager.
 *  - Never mounted anywhere near `rella-booking`. That application must stay
 *    completely tracker-free; nothing here is importable from it.
 *  - The focused campaign page still renders no GHL chat widget — GTM is a tag
 *    container, not the chat bubble.
 *  - No patient information, click identifier, or secret is passed in. GTM reads
 *    `window.location` itself for approved attribution; this component never
 *    copies advertising click parameters or campaign query values into the page,
 *    into `dataLayer`, or into a response header. (Those parameter names are
 *    deliberately not spelled out here — naming them would defeat the release
 *    scan that greps for them.)
 *
 * ⚠️ DUPLICATE GA4 WARNING. If the same GA4 property is configured BOTH as a tag
 * inside this GTM container AND via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (the separate
 * `GoogleAnalytics` component in the root layout), that property receives **two
 * page_view hits per load** — inflating sessions and corrupting conversion rates.
 * Enable exactly one path for a given GA4 property. The intended configuration is
 * GTM-only for campaign routes; `NEXT_PUBLIC_GA_MEASUREMENT_ID` must stay unset
 * for any environment where this container also fires GA4.
 *
 * Environment variables are NOT configured in this change. See
 * `MARKETING-MEASUREMENT-CONTRACT.md` for who sets `NEXT_PUBLIC_GTM_ID`, where,
 * and under what approvals.
 */
/**
 * Strict GTM container-ID format. A malformed value must render NOTHING rather
 * than emit a script tag pointing at a garbage container — a typo in a Vercel
 * environment variable should fail visibly quiet, not inject a broken tag into
 * every campaign page view.
 *
 * Confirmed future production value: GTM-5D84LL73 (NOT set in this change).
 */
export const GTM_ID_PATTERN = /^GTM-[A-Z0-9]{6,}$/;

const RAW_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_ID = RAW_GTM_ID && GTM_ID_PATTERN.test(RAW_GTM_ID.trim()) ? RAW_GTM_ID.trim() : undefined;

/** Standard GTM container snippet. Renders null when unconfigured. */
export function CampaignGtm() {
  if (!GTM_ID) return null;
  return (
    <Script id="campaign-gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * The `<noscript>` half of the GTM snippet. GTM's documented placement is
 * immediately after the opening `<body>`; the campaign layout renders it first so
 * the iframe fallback appears before page content.
 */
export function CampaignGtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

/** Exported for tests so the contract is asserted, not guessed. */
export const CAMPAIGN_GTM_ENV_VAR = "NEXT_PUBLIC_GTM_ID";
