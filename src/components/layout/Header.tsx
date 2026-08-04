"use client";

import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { useCallback, useState } from "react";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Memberships" },
  { href: "/gallery", label: "Results" },
  { href: "/blog", label: "Education" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileOpen(false), []);

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-xs tracking-[0.1em] uppercase text-silver-dark hover:text-rose-text border-b-2 border-transparent hover:border-rose transition-all duration-150 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href={resolveBookingHref({})}
            className="hidden lg:inline-flex items-center justify-center bg-rose-cta px-7 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-150 hover:bg-rose-dark"
          >
            Book Consultation
          </Link>

          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
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
        onClose={closeMobileNav}
      />
    </>
  );
}
