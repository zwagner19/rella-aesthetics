"use client";

import { useEffect } from "react";
import { withWeightLossAttribution } from "@/lib/weight-loss-attribution";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Measures only privacy-safe intent on the weight-loss page. A booking click
 * is deliberately not reported as a completed appointment.
 */
export function WeightLossConversionTracker() {
  useEffect(() => {
    function preservePaidAttribution(link: HTMLAnchorElement) {
      const attributedHref = withWeightLossAttribution(
        link.href,
        window.location.search,
      );
      if (attributedHref !== link.href) link.href = attributedHref;
    }

    document
      .querySelectorAll<HTMLAnchorElement>('a[href^="https://book.rellaweightloss.com/"]')
      .forEach(preservePaidAttribution);

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[data-cta]");
      if (!link) return;

      // Re-read the address bar at action time so a paid click can never lose
      // its Google identifier at the cross-domain booking handoff.
      preservePaidAttribution(link);

      const isBookingIntent = link.dataset.cta === "weight-loss-consult";
      const intent = isBookingIntent ? "booking_intent" : "booking_flow_start";
      const location = link.dataset.location;

      window.gtag?.("event", "select_content", {
        content_type: "conversion_intent",
        item_id: intent,
        ...(location ? { location } : {}),
      });

      window.fbq?.("trackCustom", isBookingIntent ? "RellaBookingIntent" : "RellaFunnelStart", {
        ...(location ? { location } : {}),
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
