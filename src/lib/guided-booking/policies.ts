/**
 * Approved Rella booking policy copy for the guided review step.
 * Sourced from the public cancellation-policy page / Napa tox facts — never Nude.
 */

export const GUIDED_CANCELLATION_SUMMARY =
  "Please give at least 48 hours’ notice if you need to cancel. Rella may retain the applicable booking deposit for cancellations within 48 hours. Emergencies are reviewed individually.";

export const GUIDED_DEPOSIT_SUMMARY =
  "Deposits apply per appointment that requires one, even when treatments are booked together. Your total deposit is charged when you confirm your booking; it is separate from the full treatment price.";

/**
 * Owner-approved phone-contact copy, with inquiry/booking context for this site.
 * Show both when a phone number is collected.
 */
export const ASSESSMENT_CONTACT_CONSENT =
  "I ask Rella Aesthetics to contact me by phone, email, or text about my inquiry, booking, or requested services. Messages may be sent using automated technology. Message and data rates may apply. Reply STOP to stop texts or HELP for help. This consent applies only to contact about my inquiry, booking, or requested services.";

export const MARKETING_CONSENT =
  "Send me occasional deals and promotions. (Optional)";

export const CONTACT_CONSENT_POLICY_VERSION = "rella-booking-consent-2026-10-19-v2";

/** Preserve exact receipt text for forms already open during the copy rollout. */
export const CONTACT_CONSENT_POLICIES = {
  "rella-booking-consent-2026-10-19-v1": {
    operational: ASSESSMENT_CONTACT_CONSENT,
    marketing: "Optional: I agree to receive recurring promotional calls and text messages, including through automated technology, from Rella Aesthetics at the number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
  },
  [CONTACT_CONSENT_POLICY_VERSION]: { operational: ASSESSMENT_CONTACT_CONSENT, marketing: MARKETING_CONSENT },
} as const;

export const GUIDED_PHONE_DISPLAY = "707.358.2928";
export const GUIDED_PHONE_HREF = "tel:+17073582928";
