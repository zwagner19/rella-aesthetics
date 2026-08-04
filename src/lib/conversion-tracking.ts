import { resolveBookingHref } from "@/lib/booking-routes";

export const CONVERSION_EVENT_NAME = "rella:conversion";

export type ConversionIntent =
  | "assessment_intent"
  | "booking_flow_start"
  | "booking_intent"
  | "contact_form_success"
  | "contact_intent"
  | "email_intent"
  | "phone_intent";

export interface ConversionMeasurement {
  gaEvent: "generate_lead" | "select_content";
  metaEvent: "Contact" | "Lead" | "RellaBookingIntent" | "RellaFunnelStart";
  metaStandard: boolean;
}

const BOOKING_HOSTS = new Set([
  "book.experiencerella.com",
  "book.rellaweightloss.com",
  "dashboard.boulevard.io",
  "rella-booking.vercel.app",
]);

/**
 * Classify only revenue-intent actions. Ordinary navigation is intentionally
 * ignored so reporting stays focused and does not inflate conversion counts.
 */
export function classifyConversionHref(
  href: string,
  cta = "",
): ConversionIntent | null {
  const normalizedCta = cta.trim().toLowerCase();

  if (normalizedCta.includes("assessment")) return "assessment_intent";
  if (normalizedCta === "booking-flow-start") return "booking_flow_start";

  if (href.startsWith("tel:")) return "phone_intent";
  if (href.startsWith("mailto:")) return "email_intent";

  const url = new URL(href, "https://experiencerella.com");
  if (BOOKING_HOSTS.has(url.hostname)) {
    return url.pathname.includes("/assessment/")
      ? "assessment_intent"
      : "booking_intent";
  }

  if (url.hostname === "experiencerella.com" && url.pathname === "/contact") {
    return "contact_intent";
  }

  return null;
}

/** Keep analytics payloads deliberately generic; never send form or health data. */
export function conversionMeasurement(
  intent: ConversionIntent,
): ConversionMeasurement {
  if (intent === "contact_form_success") {
    return { gaEvent: "generate_lead", metaEvent: "Lead", metaStandard: true };
  }

  if (intent === "phone_intent" || intent === "email_intent") {
    return { gaEvent: "select_content", metaEvent: "Contact", metaStandard: true };
  }

  if (intent === "booking_intent") {
    return {
      gaEvent: "select_content",
      metaEvent: "RellaBookingIntent",
      metaStandard: false,
    };
  }

  return {
    gaEvent: "select_content",
    metaEvent: "RellaFunnelStart",
    metaStandard: false,
  };
}

export function dispatchConversion(intent: ConversionIntent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ConversionIntent>(CONVERSION_EVENT_NAME, { detail: intent }),
  );
}

export interface MobileBookingDestination {
  href: string;
  label: string;
  cta: string;
}

export function resolveMobileBookingDestination(
  pathname: string | null,
): MobileBookingDestination {
  const currentPath = pathname ?? "";

  if (currentPath === "/blog/botox-cost-napa") {
    return {
      href: resolveBookingHref({ location: "napa", service: "botox" }),
      label: "Book Napa Botox",
      cta: "service-booking",
    };
  }

  if (currentPath === "/services/weight-loss") {
    return {
      href: "#consultation-options",
      label: "See Consult Times",
      cta: "booking-flow-start",
    };
  }

  if (currentPath === "/locations/napa") {
    return {
      href: resolveBookingHref({ location: "napa" }),
      label: "Book Napa",
      cta: "location-booking",
    };
  }

  if (currentPath === "/locations/vacaville") {
    return {
      href: resolveBookingHref({ location: "vacaville" }),
      label: "Book Vacaville",
      cta: "location-booking",
    };
  }

  const serviceSlug = currentPath.match(/^\/services\/([^/]+)$/)?.[1];
  if (serviceSlug) {
    return {
      href: "#book-service",
      label: "Choose a Clinic",
      cta: "booking-flow-start",
    };
  }

  return {
    href: resolveBookingHref({}),
    label: "Book Consultation",
    cta: "site-booking",
  };
}
