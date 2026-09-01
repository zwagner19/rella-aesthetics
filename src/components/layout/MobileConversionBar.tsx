"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  resolveMobileBookingDestination,
  shouldShowMobileConversionBar,
} from "@/lib/conversion-tracking";
import { isWeightLossLandingPath } from "@/lib/site-hosts";

export function MobileConversionBar({
  weightLossExperience = false,
}: {
  weightLossExperience?: boolean;
}) {
  const pathname = usePathname();
  const booking =
    weightLossExperience && isWeightLossLandingPath(pathname)
      ? {
          href: "#consultation-options",
          label: "See Call Times",
          cta: "booking-flow-start",
        }
      : resolveMobileBookingDestination(pathname);

  if (!shouldShowMobileConversionBar(pathname)) return null;

  return (
    <nav
      aria-label="Quick booking actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.38fr_0.62fr] gap-2 border-t border-rose/35 bg-white/90 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-rose xl:hidden"
    >
      <a
        href="tel:+17073582928"
        data-cta="phone"
        className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-white px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-rose"
      >
        Call Rella
      </a>
      <Link
        href={booking.href}
        data-cta={booking.cta}
        className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white"
      >
        {booking.label}
      </Link>
    </nav>
  );
}
