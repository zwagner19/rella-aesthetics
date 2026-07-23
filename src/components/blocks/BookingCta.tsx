import Link from "next/link";
import { BOOKING_URL_DEFAULT, bookingUrlForService } from "@/lib/booking-links";

interface BookingCtaProps {
  /** @deprecated Reserved for future Boulevard service-id mapping */
  serviceId?: string;
  serviceName: string;
  /** Service page slug — routed through the verified deep-link map; unverified slugs fall back to the generic widget. */
  serviceSlug?: string;
  className?: string;
}

export function BookingCta({
  serviceName,
  serviceSlug,
  className = "",
}: BookingCtaProps) {
  return (
    <Link
      href={serviceSlug ? bookingUrlForService(serviceSlug) : BOOKING_URL_DEFAULT}
      className={`inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 ${className}`}
    >
      Book {serviceName}
    </Link>
  );
}
