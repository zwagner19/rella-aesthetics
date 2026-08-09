"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { resolveGlobalBookingAction } from "@/lib/site-experience";
import { MobileNav } from "./MobileNav";

const mainNavLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Memberships" },
  { href: "/gallery", label: "Results" },
  { href: "/blog", label: "Education" },
  { href: "/contact", label: "Contact" },
];

function weightLossNavLinks(pathname: string | null) {
  const root = pathname === "/" ? "" : "/";
  return [
    { href: `${root}#weight-loss-reviews-heading`, label: "Reviews" },
    { href: `${root}#how-it-works`, label: "How It Works" },
    { href: `${root}#weight-loss-faq`, label: "FAQ" },
    { href: `${root}#consultation-options`, label: "Clinics" },
  ];
}

export function Header({ weightLossExperience = false }: { weightLossExperience?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const booking = resolveGlobalBookingAction(pathname, weightLossExperience, "Book Consultation");
  const navLinks = weightLossExperience ? weightLossNavLinks(pathname) : mainNavLinks;
  const closeMobileNav = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-silver/25 bg-paper">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:px-8 lg:h-[88px] lg:px-10 xl:px-12">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Rella Aesthetics — Home">
            <Image
              src="/brand/rella-logo-black.svg"
              alt=""
              width={360}
              height={176}
              priority
              className="h-[54px] w-auto lg:h-[64px]"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
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
            href={booking.href}
            data-cta={booking.cta}
            className="hidden items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-rose/70 lg:inline-flex xl:px-7"
          >
            {booking.label}
          </Link>

          <button
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-silver/35 p-2 lg:hidden"
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

      <MobileNav
        links={navLinks}
        isOpen={mobileOpen}
        onClose={closeMobileNav}
        weightLossExperience={weightLossExperience}
      />
    </>
  );
}
