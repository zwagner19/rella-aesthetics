import Link from "next/link";
import { BOOKING_URL_DEFAULT } from "@/lib/booking-links";

interface BookingCtaProps {
  /** @deprecated Reserved for future Boulevard service-id mapping */
  serviceId?: string;
  serviceName: string;
  /** @deprecated No longer used; booking links go to the external calendar */
  serviceSlug?: string;
  className?: string;
}

export function BookingCta({
  serviceName,
  className = "",
}: BookingCtaProps) {
  return (
    <Link
      href={BOOKING_URL_DEFAULT}
      className={`inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 ${className}`}
    >
      Book {serviceName}
    </Link>
  );
}
