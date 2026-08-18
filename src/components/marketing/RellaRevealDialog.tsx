"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import {
  REVEAL_TIME_DELAY_MS,
  REVEAL_SCROLL_THRESHOLD,
  isRevealEligiblePath,
  hasRevealSessionCap,
  markRevealDismissed,
} from "@/lib/reveal-popup";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function RellaRevealDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const armedRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    markRevealDismissed();
    document.body.style.overflow = "";
    triggerRef.current?.focus();
  }, []);

  const tryOpen = useCallback(() => {
    if (armedRef.current || hasRevealSessionCap() || !isRevealEligiblePath(pathname)) return;
    armedRef.current = true;
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    document.body.style.overflow = "hidden";
  }, [pathname]);

  useEffect(() => {
    if (!isRevealEligiblePath(pathname) || hasRevealSessionCap()) return;

    armedRef.current = false;
    setOpen(false);

    const timer = window.setTimeout(tryOpen, REVEAL_TIME_DELAY_MS);

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      if (doc.scrollTop / max >= REVEAL_SCROLL_THRESHOLD) tryOpen();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, tryOpen]);

  useEffect(() => {
    if (!open) return;

    const firstInput = dialogRef.current?.querySelector<HTMLElement>("input, button");
    firstInput?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
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

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          service: "Complimentary Consultation",
          message: "Rella Reveal popup — consultation request",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      markRevealDismissed();
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 motion-safe:transition-opacity"
        aria-label="Close dialog"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rella-reveal-title"
        className="relative w-full max-w-md bg-white border border-silver-pale p-6 sm:p-8 rella-dialog-enter"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center text-silver-dark"
          aria-label="Close"
        >
          &times;
        </button>

        <p className="text-eyebrow mb-3">Complimentary Consultation</p>
        <h2 id="rella-reveal-title" className="text-display text-xl sm:text-2xl mb-3">
          Begin With a Complimentary Consultation
        </h2>
        <p className="text-silver text-sm leading-relaxed mb-6">
          Schedule a no-pressure consultation with our team in Vacaville or Napa. We&apos;ll listen to
          your goals and recommend treatments that fit you — never a one-size-fits-all menu.
        </p>

        {status === "sent" ? (
          <div className="space-y-4">
            <p className="text-ink font-medium">Thank you — we&apos;ll reach out shortly.</p>
            <Button href={resolveBookingHref({})} className="w-full">
              Or Book Online Now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reveal-name" className="block text-sm font-medium text-ink mb-1">
                Full Name
              </label>
              <input
                id="reveal-name"
                name="name"
                required
                className="w-full min-h-11 border border-silver-light px-4 py-3 text-ink bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
            <div>
              <label htmlFor="reveal-email" className="block text-sm font-medium text-ink mb-1">
                Email
              </label>
              <input
                id="reveal-email"
                name="email"
                type="email"
                required
                className="w-full min-h-11 border border-silver-light px-4 py-3 text-ink bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
            <div>
              <label htmlFor="reveal-phone" className="block text-sm font-medium text-ink mb-1">
                Phone <span className="text-silver font-normal">(optional)</span>
              </label>
              <input
                id="reveal-phone"
                name="phone"
                type="tel"
                className="w-full min-h-11 border border-silver-light px-4 py-3 text-ink bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-rose-dark">
                Something went wrong. Please try again or{" "}
                <Link href="/contact" className="underline">
                  contact us
                </Link>
                .
              </p>
            )}

            <Button type="submit" disabled={status === "sending"} className="w-full">
              {status === "sending" ? "Sending..." : "Request Consultation"}
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-silver leading-relaxed">
          By submitting, you agree to our{" "}
          <Link href="/privacy-policy" className="underline hover:text-ink">
            Privacy Policy
          </Link>
          . We&apos;ll use your details to respond — not for unrelated marketing.
        </p>
      </div>
    </div>
  );
}
