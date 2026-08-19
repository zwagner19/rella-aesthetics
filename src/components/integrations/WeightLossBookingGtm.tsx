import Script from "next/script";
import { GTM_ID_PATTERN } from "@/components/integrations/CampaignGtm";

/**
 * Google Tag Manager for the first-party weight-loss booking app
 * (`book.rellaweightloss.com`) only.
 *
 * Uses the same container as the marketing site so cross-domain Conversion
 * Linker settings apply consistently. Legacy AW-11321678537 tags stay in the
 * container untouched; the confirmed-booking conversion uses a separate
 * AW-6868918996 tag wired to `weight_loss_booking_confirmed`.
 *
 * Set `NEXT_PUBLIC_WEIGHT_LOSS_GTM_ID=GTM-N4R7NHBJ` on the booking deployment.
 * Renders nothing when unset so staging stays tracker-free.
 */
export const WEIGHT_LOSS_GTM_ENV_VAR = "NEXT_PUBLIC_WEIGHT_LOSS_GTM_ID";

const RAW_GTM_ID = process.env.NEXT_PUBLIC_WEIGHT_LOSS_GTM_ID;
const GTM_ID =
  RAW_GTM_ID && GTM_ID_PATTERN.test(RAW_GTM_ID.trim())
    ? RAW_GTM_ID.trim()
    : undefined;

export function WeightLossBookingGtm() {
  if (!GTM_ID) return null;
  return (
    <Script id="weight-loss-booking-gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function WeightLossBookingGtmNoScript() {
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
