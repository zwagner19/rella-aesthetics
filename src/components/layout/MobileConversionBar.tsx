"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveMobileBookingDestination } from "@/lib/conversion-tracking";

export function MobileConversionBar() {
  const pathname = usePathname();
  const booking = resolveMobileBookingDestination(pathname);

  return (
    <nav
      aria-label="Quick booking actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.38fr_0.62fr] border-t border-silver-pale bg-white/96 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(43,43,43,0.12)] backdrop-blur lg:hidden"
    >
      <a
        href="tel:+17073582928"
        data-cta="phone"
        className="inline-flex min-h-12 items-center justify-center border border-silver-light px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-silver-dark"
      >
        Call Rella
      </a>
      <Link
        href={booking.href}
        data-cta={booking.cta}
        className="inline-flex min-h-12 items-center justify-center bg-rose px-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rose-dark"
      >
        {booking.label}
      </Link>
    </nav>
  );
}
