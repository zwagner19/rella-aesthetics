import Link from "next/link";
import { resolveBookingHref, type BookingLocation } from "@/lib/booking-routes";

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
  const href = resolveBookingHref({ location, service: serviceSlug ?? serviceName });

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 ${className}`}
    >
      Book {serviceName}
    </Link>
  );
}
