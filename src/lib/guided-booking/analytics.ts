import type { GuidedBookingAnalyticsEvent } from "./types";

/**
 * Funnel analytics for the guided booking shell.
 * Opens and confirmed bookings are tracked separately.
 * Never include PII or treatment-sensitive details in payloads.
 */

export type AnalyticsSink = (event: GuidedBookingAnalyticsEvent) => void;

const SAFE_OPEN = "rella_guided_booking_open";
const SAFE_CONFIRMED = "rella_guided_booking_confirmed";

export function emitGuidedBookingEvent(
  event: GuidedBookingAnalyticsEvent,
  sink: AnalyticsSink = defaultSink,
): void {
  sink(event);
}

function defaultSink(event: GuidedBookingAnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const detail = detailFor(event);

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

function detailFor(event: GuidedBookingAnalyticsEvent): {
  event: string;
  hasLocation?: boolean;
  hasService?: boolean;
  hasCategory?: boolean;
  confirmationPresent?: boolean;
} {
  switch (event.type) {
    case "booking_open":
      return {
        event: SAFE_OPEN,
        hasLocation: Boolean(event.intent.location),
        hasService: Boolean(event.intent.service),
        hasCategory: Boolean(event.intent.category),
      };
    case "booking_confirmed":
      return {
        event: SAFE_CONFIRMED,
        confirmationPresent: Boolean(event.confirmationId),
      };
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}
