"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveGlobalBookingAction } from "@/lib/site-experience";

interface MobileNavProps {
  links: { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
  weightLossExperience?: boolean;
}

export function MobileNav({
  links,
  isOpen,
  onClose,
  weightLossExperience = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const booking = resolveGlobalBookingAction(pathname, weightLossExperience, "Book Consultation");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      ref={dialogRef}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-paper px-6 pb-8 pt-6"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex shrink-0 items-start justify-between border-b border-silver/25 pb-5">
        <Link href="/" onClick={onClose} aria-label="Rella Aesthetics — Home">
          <Image
            src="/brand/rella-logo-black.svg"
            alt=""
            width={360}
            height={176}
            priority
            className="h-[58px] w-auto"
          />
        </Link>
        <button
          ref={closeButtonRef}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-silver/35 p-2 text-2xl font-light leading-none text-ink"
          onClick={onClose}
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>

      <nav
        className="mt-7 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        aria-label="Mobile menu links"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="border-b border-silver/25 py-4 text-lg font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-rose/15"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href={booking.href}
        data-cta={booking.cta}
        onClick={onClose}
        className="mt-7 inline-flex min-h-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-10 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-rose/70"
      >
        {booking.label}
      </Link>
    </div>
  );
}
