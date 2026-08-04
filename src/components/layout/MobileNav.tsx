"use client";

import Link from "next/link";
import { resolveBookingHref } from "@/lib/booking-routes";
import { useEffect, useRef } from "react";

interface MobileNavProps {
  links: { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
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
      className="fixed inset-0 z-[200] bg-white flex flex-col px-6 pt-24 pb-6 gap-6"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-6 text-2xl text-silver-dark p-2"
        onClick={onClose}
        aria-label="Close menu"
      >
        &times;
      </button>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="font-medium text-lg tracking-[0.06em] uppercase text-silver-dark py-3 border-b border-silver-pale hover:text-rose-text transition-colors"
        >
          {link.label}
        </Link>
      ))}

      <Link
        href={resolveBookingHref({})}
        onClick={onClose}
        className="mt-4 inline-flex items-center justify-center bg-rose-cta px-10 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-rose-dark"
      >
        Book Consultation
      </Link>
    </div>
  );
}
