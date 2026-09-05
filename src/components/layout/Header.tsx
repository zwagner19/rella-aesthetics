"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { resolveBookingHref } from "@/lib/booking-routes";
import { MobileNav } from "./MobileNav";

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Memberships" },
  { href: "/payment-plans", label: "Payment Plans" },
  { href: "/private-parties", label: "Private Parties" },
  { href: "/gallery", label: "Results" },
  { href: "/blog", label: "Education" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  }, []);
  const bookingHref = resolveBookingHref({});

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rose/25 bg-paper">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:px-8 xl:h-[88px] xl:px-12">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Rella Aesthetics — Home">
            <Image
              src="/brand/rella-logo-black.svg"
              alt=""
              width={360}
              height={176}
              priority
              className="h-[54px] w-auto xl:h-[64px]"
            />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-transparent py-2 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:border-rose"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href={bookingHref}
            className="hidden items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-7 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-rose/75 xl:inline-flex"
          >
            Book Consultation
          </Link>

          <button
            ref={mobileMenuButtonRef}
            type="button"
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-rose/50 p-2 xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span className="block h-px w-5 bg-ink" />
            <span className="block h-px w-5 bg-ink" />
            <span className="block h-px w-5 bg-ink" />
          </button>
        </div>
      </header>

      <MobileNav links={navLinks} isOpen={mobileOpen} onClose={closeMobileNav} />
    </>
  );
}
