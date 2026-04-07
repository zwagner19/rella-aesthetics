"use client";

import { useEffect, useCallback } from "react";

interface BoulevardBookingProps {
  businessId?: string;
  serviceId?: string;
}

declare global {
  interface Window {
    BoulevardBooking?: {
      open: (config: { businessId: string; serviceId?: string }) => void;
    };
  }
}

const BOULEVARD_SCRIPT_URL = "https://booking.boulevard.io/widget.js";
const DEFAULT_BUSINESS_ID = process.env.NEXT_PUBLIC_BOULEVARD_BUSINESS_ID ?? "";

export function BoulevardBooking({
  businessId = DEFAULT_BUSINESS_ID,
  serviceId,
}: BoulevardBookingProps) {
  useEffect(() => {
    if (!businessId) return;
    if (document.querySelector(`script[src="${BOULEVARD_SCRIPT_URL}"]`)) return;

    const script = document.createElement("script");
    script.src = BOULEVARD_SCRIPT_URL;
    script.async = true;
    script.dataset.businessId = businessId;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [businessId]);

  const handleOpen = useCallback(() => {
    if (!businessId) {
      console.warn("Boulevard: businessId not configured. Set NEXT_PUBLIC_BOULEVARD_BUSINESS_ID in .env.local");
      return;
    }
    window.BoulevardBooking?.open({
      businessId,
      ...(serviceId && { serviceId }),
    });
  }, [businessId, serviceId]);

  return (
    <button
      onClick={handleOpen}
      className="inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-[18px] hover:bg-rose-dark transition-colors duration-150 disabled:opacity-50"
      aria-label="Open booking widget"
    >
      Book Now
    </button>
  );
}

export function useBoulevardOpen(businessId = DEFAULT_BUSINESS_ID) {
  return useCallback(
    (serviceId?: string) => {
      if (!businessId) {
        console.warn("Boulevard: businessId not configured");
        return;
      }
      window.BoulevardBooking?.open({
        businessId,
        ...(serviceId && { serviceId }),
      });
    },
    [businessId]
  );
}
