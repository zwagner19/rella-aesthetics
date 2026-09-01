export type AttributionConsentState = "granted" | "denied" | "unknown";

/**
 * The production CMP owns these adapters. `granted` is valid only after an
 * affirmative advertising/marketing attribution choice for the current user.
 */
export interface AttributionConsentAdapter {
  getState(): unknown;
}

export const AESTHETICS_ATTRIBUTION_CONSENT_EVENT =
  "rella:aesthetics-attribution-consent-change";
export const WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT =
  "rella:weight-loss-attribution-consent-change";

export function readAttributionConsent(
  adapter: AttributionConsentAdapter | null | undefined,
): AttributionConsentState {
  if (!adapter) return "unknown";
  try {
    const state = adapter.getState();
    return state === "granted" || state === "denied" ? state : "unknown";
  } catch {
    return "unknown";
  }
}

export interface AttributionConsentTransition {
  changed: boolean;
  captureAllowed: boolean;
  revoke: boolean;
  sessionAccessAllowed: boolean;
  stripClientAttribution: boolean;
}

export function planAttributionConsentTransition(
  previous: AttributionConsentState,
  next: AttributionConsentState,
): AttributionConsentTransition {
  return {
    changed: previous !== next,
    captureAllowed: next === "granted",
    revoke: next === "denied",
    sessionAccessAllowed: next !== "unknown",
    stripClientAttribution: next === "denied",
  };
}

export function isCurrentAttributionCaptureAcknowledgement(args: {
  active: boolean;
  serverAcknowledged: boolean;
  consentState: AttributionConsentState;
  requestGeneration: number;
  currentGeneration: number;
}): boolean {
  return (
    args.active &&
    args.serverAcknowledged &&
    args.consentState === "granted" &&
    args.requestGeneration === args.currentGeneration
  );
}

declare global {
  interface Window {
    __rellaAestheticsAttributionConsent?: AttributionConsentAdapter;
    __rellaWeightLossAttributionConsent?: AttributionConsentAdapter;
  }
}
