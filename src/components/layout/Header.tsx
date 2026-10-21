"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { resolveBookingHref } from "@/lib/booking-routes";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";
import { MobileNav } from "./MobileNav";

/** Public navigation. About, Payment Plans, and Private Parties stay off the menu. */
export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/locations/vacaville", label: "Vacaville" },
  { href: "/locations/napa", label: "Napa" },
  { href: "/contact", label: "Contact" },
] as const;

const linkClass =
  "border-b border-transparent py-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:border-rose";

export function Header() {
  const pathname = usePathname();
  /** Dark full-bleed heroes that can carry light navigation. */
  const isEditorialHeroRoute =
    pathname === "/services/botox" || pathname === "/services/dermal-fillers";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isEditorialHeroRoute);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    window.requestAnimationFrame(() => {
      if (document.querySelector(
        '[role="dialog"][aria-modal="true"]:not(#mobile-navigation):not([hidden]):not([aria-hidden="true"])',
      )) return;
      mobileMenuButtonRef.current?.focus();
    });
  }, []);
  const bookingHref = resolveBookingHref({});

  useEffect(() => {
    if (!isEditorialHeroRoute) {
      // Scroll state only affects editorial heroes; ordinary pages already
      // derive their solid header from isEditorialHeroRoute.
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
        {/* Desktop: links · logo · book */}
        <div className="mx-auto hidden h-[84px] w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:grid xl:px-12">
          <nav className={`flex items-center gap-4 xl:gap-6 ${navTone}`} aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`${linkClass} whitespace-nowrap`}>
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
            <BookTrigger intent={{}} data-booking-fallback={bookingHref} className="rella-cta-rect rella-cta-rect--filled">
              Book
            </BookTrigger>
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
            <BookTrigger
              intent={{}}
              className="rella-cta-rect rella-cta-rect--filled px-4 py-3 text-[0.625rem] tracking-[0.12em]"
            >
              Book
            </BookTrigger>
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
