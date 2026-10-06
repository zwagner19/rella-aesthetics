import type {
  GuidedBookingAnalyticsEvent,
} from "./types";

/**
 * Funnel analytics for the guided booking shell.
 * Opens and handoffs are tracked separately from verified confirmations.
 * Never include PII or treatment-sensitive details in payloads.
 */

export type AnalyticsSink = (event: GuidedBookingAnalyticsEvent) => void;

const SAFE_OPEN = "rella_guided_booking_open";
const SAFE_HANDOFF = "rella_guided_booking_handoff";
const SAFE_CONFIRMED = "rella_guided_booking_confirmed";

export function emitGuidedBookingEvent(
  event: GuidedBookingAnalyticsEvent,
  sink: AnalyticsSink = defaultSink,
): void {
  sink(event);
}

function defaultSink(event: GuidedBookingAnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const detail =
    event.type === "booking_open"
      ? {
          event: SAFE_OPEN,
          hasLocation: Boolean(event.intent.location),
          hasService: Boolean(event.intent.service),
          hasCategory: Boolean(event.intent.category),
        }
      : event.type === "booking_handoff"
        ? {
            event: SAFE_HANDOFF,
            location: event.locationSlug,
            // service slug is a public catalog key, not clinical notes
            service: event.serviceSlug,
          }
        : {
            event: SAFE_CONFIRMED,
            // opaque id only — no patient fields
            confirmationPresent: Boolean(event.confirmationId),
          };

  window.dispatchEvent(
    new CustomEvent("rella:guided-booking", { detail }),
  );

  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer?.push({ ...detail, at: event.at });
  if (typeof w.gtag === "function") {
    w.gtag("event", detail.event, detail);
  }
}
