import Link from "next/link";

interface BookingCtaProps {
  /** @deprecated Reserved for future Boulevard service-id mapping */
  serviceId?: string;
  serviceName: string;
  /** URL slug for `?service=` pre-match (e.g. same as service page slug) */
  serviceSlug?: string;
  className?: string;
}

export function BookingCta({
  serviceName,
  serviceSlug,
  className = "",
}: BookingCtaProps) {
  const slug =
    serviceSlug ??
    serviceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const href =
    slug.length > 0
      ? `/booking?service=${encodeURIComponent(slug)}`
      : "/booking";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 ${className}`}
    >
      Book {serviceName}
    </Link>
  );
}
