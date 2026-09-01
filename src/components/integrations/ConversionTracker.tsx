"use client";

import { useEffect } from "react";
import {
  classifyConversionHref,
  CONVERSION_EVENT_NAME,
  conversionMeasurement,
  type ConversionIntent,
} from "@/lib/conversion-tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function measure(intent: ConversionIntent) {
  const signal = conversionMeasurement(intent);

  window.gtag?.("event", signal.gaEvent, {
    content_type: "conversion_intent",
    item_id: intent,
  });

  if (signal.metaStandard) {
    window.fbq?.("track", signal.metaEvent);
  } else {
    window.fbq?.("trackCustom", signal.metaEvent);
  }
}

export function ConversionTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const intent = classifyConversionHref(
        link.getAttribute("href") ?? "",
        link.dataset.cta,
      );
      if (intent) measure(intent);
    }

    function handleConversion(event: Event) {
      const intent = (event as CustomEvent<ConversionIntent>).detail;
      if (intent) measure(intent);
    }

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener(CONVERSION_EVENT_NAME, handleConversion);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener(CONVERSION_EVENT_NAME, handleConversion);
    };
  }, []);

  return null;
}
