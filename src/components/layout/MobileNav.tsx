"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BOOKING_URL_DEFAULT } from "@/lib/booking-links";

interface MobileNavProps {
  links: { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-white flex flex-col px-6 pt-24 pb-6 gap-6"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <button
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
        href={BOOKING_URL_DEFAULT}
        onClick={onClose}
        className="mt-4 inline-flex items-center justify-center font-bold text-[0.6875rem] tracking-[0.18em] uppercase bg-rose text-white px-10 py-4 hover:bg-rose-dark transition-colors"
      >
        Book Consultation
      </Link>
    </div>
  );
}
