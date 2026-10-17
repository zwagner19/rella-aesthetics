"use client";

import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";

interface BookingCtaProps {
  /** @deprecated Reserved for future Boulevard service-id mapping */
  serviceId?: string;
  serviceName: string;
  /** Canonical service slug (same as the service page slug). */
  serviceSlug?: string;
  /** Location, when the CTA is location-specific. Omit for generic CTAs. */
  location?: BookingLocation;
  className?: string;
}

export function BookingCta({
  serviceName,
  serviceSlug,
  location,
  className = "",
}: BookingCtaProps) {
  // Centralized, safety-guarded routing (never silently routes to Napa Tox).
  // Keep resolver for fail-closed destination parity / no-JS fallback inside BookTrigger.
  void resolveBookingHref({ location, service: serviceSlug ?? serviceName });

  return (
    <BookTrigger
      intent={{ location, service: serviceSlug ?? serviceName }}
      className={`inline-flex items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-10 py-[18px] text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-rose/85 ${className}`}
    >
      Book {serviceName}
    </BookTrigger>
  );
}
