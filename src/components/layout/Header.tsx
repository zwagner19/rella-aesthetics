"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveBookingHref } from "@/lib/booking-routes";
import { useRef, useState } from "react";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "VIP Membership" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Education" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isWeightLossPage = pathname === "/services/weight-loss";
  const bookingHref = isWeightLossPage ? "#consultation-options" : resolveBookingHref({});
  const bookingLabel = isWeightLossPage ? "See Call Times" : "Book Consultation";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-silver-pale">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-[72px]">
          <Link href="/" className="flex items-center gap-3" aria-label="Rella Aesthetics — Home">
            <span className="flex flex-col leading-none">
              <span className="font-light text-xl tracking-[0.12em] text-ink">rella</span>
              <span className="font-bold text-[0.5rem] tracking-[0.25em] uppercase text-silver">
                Aesthetics
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (pathname?.startsWith(`${link.href}/`) ?? false);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`font-medium text-xs tracking-[0.1em] uppercase py-1 border-b-2 transition-all duration-150 ${
                    active
                      ? "text-ink border-rose"
                      : "text-silver-dark border-transparent hover:text-rose-text hover:border-rose"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={bookingHref}
            data-cta={isWeightLossPage ? "booking-flow-start" : undefined}
            className="hidden lg:inline-flex min-h-11 items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-ink px-7 py-3 hover:bg-rose-dark transition-colors duration-150"
          >
            {bookingLabel}
          </Link>

          <button
            ref={menuTriggerRef}
            type="button"
            className="lg:hidden flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span className="block w-6 h-0.5 bg-silver-dark" />
            <span className="block w-6 h-0.5 bg-silver-dark" />
            <span className="block w-6 h-0.5 bg-silver-dark" />
          </button>
        </div>
      </header>

      <MobileNav
        links={navLinks}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        menuTriggerRef={menuTriggerRef}
      />
    </>
  );
}
