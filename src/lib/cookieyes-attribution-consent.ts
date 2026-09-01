import type { AttributionConsentState } from "./attribution-consent";

export type CookieYesConsentGetter = () => unknown;

/** Read only CookieYes's public API; never infer consent from cookie text. */
export function readCookieYesAttributionConsent(
  getConsent: CookieYesConsentGetter | null | undefined,
): AttributionConsentState {
  if (typeof getConsent !== "function") return "unknown";
  try {
    const snapshot = getConsent();
    if (!snapshot || typeof snapshot !== "object") return "unknown";
    const consent = snapshot as Record<string, unknown>;
    if (consent.isUserActionCompleted !== true) return "unknown";
    const categories = consent.categories;
    if (!categories || typeof categories !== "object") return "unknown";
    const advertisement = (categories as Record<string, unknown>).advertisement;
    if (advertisement === true) return "granted";
    if (advertisement === false) return "denied";
    return "unknown";
  } catch {
    return "unknown";
  }
}

declare global {
  interface Window {
    getCkyConsent?: CookieYesConsentGetter;
  }
}
