"use client";

import { useEffect } from "react";
import {
  AESTHETICS_ATTRIBUTION_CONSENT_EVENT,
  WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT,
  type AttributionConsentAdapter,
} from "@/lib/attribution-consent";
import { readCookieYesAttributionConsent } from "@/lib/cookieyes-attribution-consent";

const COOKIEYES_EVENTS = [
  "cookieyes_banner_loaded",
  "cookieyes_banner_load",
  "cookieyes_consent_update",
  "consent_update",
] as const;

/**
 * Adapts an externally managed CookieYes instance without loading or rendering
 * CookieYes UI. Missing API state remains unknown and attribution stays off.
 */
export function CookieYesAttributionConsentBridge() {
  useEffect(() => {
    const adapter: AttributionConsentAdapter = {
      getState: () => readCookieYesAttributionConsent(window.getCkyConsent),
    };
    window.__rellaAestheticsAttributionConsent = adapter;
    window.__rellaWeightLossAttributionConsent = adapter;

    function notifyAttributionClients() {
      window.dispatchEvent(new Event(AESTHETICS_ATTRIBUTION_CONSENT_EVENT));
      window.dispatchEvent(new Event(WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT));
    }

    for (const eventName of COOKIEYES_EVENTS) {
      document.addEventListener(eventName, notifyAttributionClients);
    }
    notifyAttributionClients();

    return () => {
      for (const eventName of COOKIEYES_EVENTS) {
        document.removeEventListener(eventName, notifyAttributionClients);
      }
      if (window.__rellaAestheticsAttributionConsent === adapter) {
        delete window.__rellaAestheticsAttributionConsent;
      }
      if (window.__rellaWeightLossAttributionConsent === adapter) {
        delete window.__rellaWeightLossAttributionConsent;
      }
    };
  }, []);

  return null;
}
