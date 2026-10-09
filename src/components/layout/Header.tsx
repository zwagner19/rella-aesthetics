"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { resolveBookingHref } from "@/lib/booking-routes";
import { MobileNav } from "./MobileNav";

/** Primary editorial navigation — lean left rail for homepage architecture. */
export const primaryNavLinks = [
  { href: "/services", label: "Treatments" },
  { href: "/about", label: "About" },
  { href: "/#locations", label: "Locations" },
] as const;

/** Full site map for the mobile menu (interior pages stay reachable). */
export const navLinks = [
  { href: "/services", label: "Treatments" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/locations/vacaville", label: "Vacaville" },
  { href: "/locations/napa", label: "Napa" },
  { href: "/membership", label: "Membership" },
  { href: "/gallery", label: "Results" },
  { href: "/blog", label: "Education" },
  { href: "/payment-plans", label: "Payment Plans" },
  { href: "/private-parties", label: "Private Parties" },
  { href: "/contact", label: "Contact" },
] as const;

const linkClass =
  "border-b border-transparent py-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:border-rose";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  /** Full-bleed editorial heroes that share the homepage over-nav treatment. */
  const isEditorialHeroRoute =
    isHome || pathname === "/services/botox" || pathname === "/services/dermal-fillers";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isEditorialHeroRoute);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  }, []);
  const bookingHref = resolveBookingHref({});

  useEffect(() => {
    if (!isEditorialHeroRoute) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isEditorialHeroRoute]);

  const overHero = isEditorialHeroRoute && !scrolled;
  const shellClass = overHero
    ? "border-transparent bg-transparent"
    : "border-rule/50 bg-ivory/95 backdrop-blur-sm";
  const navTone = overHero ? "text-white" : "text-ink";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${shellClass}`}
      >
        {/* Desktop: L links · C logo · R membership + book */}
        <div className="mx-auto hidden h-[84px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-8 lg:grid xl:px-12">
          <nav className={`flex items-center gap-7 ${navTone}`} aria-label="Primary navigation">
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" aria-label="Rella Aesthetics — Home" className="justify-self-center">
            <Image
              src="/brand/rella-logo-rose.svg"
              alt=""
              width={360}
              height={176}
              priority
              className="h-[56px] w-auto"
            />
          </Link>

          <div className={`flex items-center justify-end gap-6 ${navTone}`}>
            <Link href="/membership" className={linkClass}>
              Membership
            </Link>
            <Link href={bookingHref} className="rella-cta-rect rella-cta-rect--filled">
              Book
            </Link>
          </div>
        </div>

        {/* Mobile: logo + menu + Book */}
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-5 md:px-8 lg:hidden">
          <Link href="/" aria-label="Rella Aesthetics — Home" className="shrink-0">
            <Image
              src="/brand/rella-logo-rose.svg"
              alt=""
              width={360}
              height={176}
              priority
              className="h-[48px] w-auto"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={bookingHref}
              className="rella-cta-rect rella-cta-rect--filled px-4 py-3 text-[0.625rem] tracking-[0.12em]"
            >
              Book
            </Link>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] border p-2 ${
                overHero ? "border-white/60" : "border-rose/50"
              }`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span className={`block h-px w-5 ${overHero ? "bg-white" : "bg-rose"}`} />
              <span className={`block h-px w-5 ${overHero ? "bg-white" : "bg-rose"}`} />
              <span className={`block h-px w-5 ${overHero ? "bg-white" : "bg-rose"}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav links={navLinks} isOpen={mobileOpen} onClose={closeMobileNav} />
    </>
  );
}
