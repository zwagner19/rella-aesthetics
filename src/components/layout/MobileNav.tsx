"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveBookingHref } from "@/lib/booking-routes";
import { useEffect, useRef } from "react";

interface MobileNavProps {
  links: { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
  menuTriggerRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileNav({ links, isOpen, onClose, menuTriggerRef }: MobileNavProps) {
  const pathname = usePathname();
  const isWeightLossPage = pathname === "/services/weight-loss";
  const bookingHref = isWeightLossPage ? "#consultation-options" : resolveBookingHref({});
  const bookingLabel = isWeightLossPage ? "See Call Times" : "Book Consultation";
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        menuTriggerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, menuTriggerRef]);

  if (!isOpen) return null;

  function handleClose() {
    onClose();
    menuTriggerRef.current?.focus();
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[200] bg-white flex flex-col px-6 pt-24 pb-6 gap-2 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="absolute top-3 right-4 flex min-h-11 min-w-11 items-center justify-center text-2xl text-silver-dark"
        onClick={handleClose}
        aria-label="Close menu"
      >
        &times;
      </button>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={handleClose}
          className="flex min-h-11 items-center font-medium text-lg tracking-[0.06em] uppercase text-silver-dark py-2 border-b border-silver-pale hover:text-rose-text transition-colors"
        >
          {link.label}
        </Link>
      ))}

      <Link
        href={bookingHref}
        data-cta={isWeightLossPage ? "booking-flow-start" : undefined}
        onClick={handleClose}
        className="mt-4 inline-flex min-h-11 items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-ink px-10 py-3 hover:bg-rose-dark transition-colors"
      >
        {bookingLabel}
      </Link>
    </div>
  );
}
