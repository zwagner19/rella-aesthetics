"use client";

import { useBoulevardOpen } from "@/components/integrations/BoulevardBooking";

interface BookingCtaProps {
  serviceId?: string;
  serviceName: string;
  className?: string;
}

export function BookingCta({ serviceId, serviceName, className = "" }: BookingCtaProps) {
  const openBooking = useBoulevardOpen();

  return (
    <button
      onClick={() => openBooking(serviceId)}
      className={`inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 ${className}`}
    >
      Book {serviceName}
    </button>
  );
}
