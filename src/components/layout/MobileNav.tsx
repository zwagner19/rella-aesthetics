"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { resolveBookingHref } from "@/lib/booking-routes";

interface MobileNavProps {
  links: readonly { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const bookingHref = resolveBookingHref({});

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
    function handleKey(event: KeyboardEvent) {
      if (!isOpen) return;

      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current?.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
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
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-paper px-6 pb-8 pt-6 text-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex shrink-0 items-start justify-between border-b border-rose/35 pb-5">
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
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-rose/50 p-2 text-2xl font-light leading-none text-ink"
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
            className="border-b border-rose/30 py-4 text-lg font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-rose/20"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href={bookingHref}
        onClick={onClose}
        className="mt-7 inline-flex min-h-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-rose bg-rose px-10 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink"
      >
        Book Consultation
      </Link>
    </div>
  );
}
