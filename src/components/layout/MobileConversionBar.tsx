"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  resolveBookingHref,
  type BookingIntent,
  type BookingLocation,
} from "@/lib/booking-routes";
import { WEIGHT_LOSS_HOST } from "@/lib/site-hosts";

const EXCLUDED_PATHS = new Set([
  "/booking",
  "/cancellation-policy",
  "/contact",
  "/giveaway-terms-and-conditions",
  "/napa/botox",
  "/privacy-policy",
  "/services/weight-loss",
  "/terms",
  "/wpbc-booking-received",
]);

function subscribeToHost(onStoreChange: () => void) {
  const timeout = window.setTimeout(onStoreChange, 0);
  window.addEventListener("pageshow", onStoreChange);
  return () => {
    window.clearTimeout(timeout);
    window.removeEventListener("pageshow", onStoreChange);
  };
}

const getHostSnapshot = () => window.location.hostname;
const getServerSnapshot = () => WEIGHT_LOSS_HOST;

const BOOKING_LOCATIONS = new Set<BookingLocation>(["napa", "vacaville"]);

export function bookingIntentForPath(pathname: string): BookingIntent {
  const [section, first, second] = pathname.split("/").filter(Boolean);

  if (section === "locations" && BOOKING_LOCATIONS.has(first as BookingLocation)) {
    return { location: first as BookingLocation };
  }

  if (BOOKING_LOCATIONS.has(section as BookingLocation) && first && !second) {
    return { location: section as BookingLocation, service: first };
  }

  if (section === "services" && first && !second) {
    return { service: first };
  }

  return {};
}

export function shouldShowMobileConversionBar(pathname: string, hostname: string): boolean {
  return hostname !== WEIGHT_LOSS_HOST && !EXCLUDED_PATHS.has(pathname);
}

export function MobileConversionBar() {
  const pathname = usePathname();
  const hostname = useSyncExternalStore(
    subscribeToHost,
    getHostSnapshot,
    getServerSnapshot,
  );

  if (!shouldShowMobileConversionBar(pathname, hostname)) {
    return null;
  }

  const bookingHref = resolveBookingHref(bookingIntentForPath(pathname));

  return (
    <nav
      aria-label="Quick booking actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.38fr_0.62fr] gap-2 border-t border-rose/35 bg-white/90 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-rose backdrop-blur-sm xl:hidden"
    >
      <a
        href="tel:+17073582928"
        data-cta="phone"
        className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-white px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-rose"
      >
        Call Rella
      </a>
      <Link
        href={bookingHref}
        data-cta="site-booking"
        className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white"
      >
        Book Consultation
      </Link>
    </nav>
  );
}
