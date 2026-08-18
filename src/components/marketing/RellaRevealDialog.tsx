"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  REVEAL_DESKTOP_MIN_WIDTH_PX,
  REVEAL_INTEREST_OPTIONS,
  REVEAL_OFFER_DETAIL,
  REVEAL_OFFER_HEADLINE,
  REVEAL_SCROLL_THRESHOLD,
  REVEAL_TIME_DELAY_MS,
  buildRevealLeadMessage,
  buildRevealThankYouPath,
  getRevealInterestOption,
  hasRevealSessionCap,
  isRevealEligiblePath,
  markRevealDismissed,
  markRevealViewed,
  REVEAL_LEAD_SOURCE,
  type RevealInterestId,
} from "@/lib/reveal-popup";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function RellaRevealDialog() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [interestId, setInterestId] = useState<RevealInterestId | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const armedRef = useRef(false);

  const resetFlow = useCallback(() => {
    setStep(1);
    setInterestId(null);
    setStatus("idle");
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    resetFlow();
    markRevealDismissed();
    document.body.style.overflow = "";
    triggerRef.current?.focus();
  }, [resetFlow]);

  const openDialog = useCallback(() => {
    if (armedRef.current || hasRevealSessionCap() || !isRevealEligiblePath(pathname)) return;
    armedRef.current = true;
    triggerRef.current = document.activeElement as HTMLElement | null;
    markRevealViewed();
    resetFlow();
    setOpen(true);
    document.body.style.overflow = "hidden";
  }, [pathname, resetFlow]);

  useEffect(() => {
    if (!isRevealEligiblePath(pathname) || hasRevealSessionCap()) return;

    armedRef.current = false;
    setOpen(false);
    resetFlow();

    const timer = window.setTimeout(openDialog, REVEAL_TIME_DELAY_MS);

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      if (doc.scrollTop / max >= REVEAL_SCROLL_THRESHOLD) openDialog();
    }

    function onExitIntent(e: MouseEvent) {
      if (window.innerWidth < REVEAL_DESKTOP_MIN_WIDTH_PX) return;
      if (e.clientY > 0) return;
      openDialog();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onExitIntent);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onExitIntent);
    };
  }, [pathname, openDialog, resetFlow]);

  useEffect(() => {
    if (!open) return;

    const focusTarget = dialogRef.current?.querySelector<HTMLElement>(
      step === 1 ? "button[data-reveal-interest]" : "#reveal-email",
    );
    focusTarget?.focus();

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
  }, [open, close, step]);

  function handleInterestSelect(id: RevealInterestId) {
    setInterestId(id);
    setStep(2);
    setStatus("idle");
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!interestId) return;

    setStatus("sending");
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    const interest = getRevealInterestOption(interestId);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          service: interest.serviceLabel,
          source: REVEAL_LEAD_SOURCE,
          message: buildRevealLeadMessage(interest),
          tags: ["rella-reveal"],
        }),
      });
      if (!res.ok) throw new Error("Failed");
      markRevealDismissed();
      setOpen(false);
      document.body.style.overflow = "";
      router.push(buildRevealThankYouPath(interestId));
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
        className="relative w-full max-w-md bg-white border border-silver-pale p-6 sm:p-8 rella-dialog-enter max-h-[90vh] overflow-y-auto"
        data-reveal-step={step}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center text-silver-dark"
          aria-label="Close"
        >
          &times;
        </button>

        {step === 1 ? (
          <>
            <p className="text-eyebrow mb-3">Personalized plan + $50 credit</p>
            <h2 id="rella-reveal-title" className="text-display text-xl sm:text-2xl mb-3">
              {REVEAL_OFFER_HEADLINE}
            </h2>
            <p className="text-silver text-sm leading-relaxed mb-6">{REVEAL_OFFER_DETAIL}</p>

            <p className="text-sm font-medium text-ink mb-3">Tell us what you&apos;re most interested in:</p>
            <div className="flex flex-col gap-2" role="group" aria-label="Treatment interests">
              {REVEAL_INTEREST_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  data-reveal-interest={option.id}
                  onClick={() => handleInterestSelect(option.id)}
                  className="min-h-11 w-full border border-silver-light px-4 py-3 text-left text-sm text-ink hover:border-rose transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-eyebrow mb-3">Almost there</p>
            <h2 id="rella-reveal-title" className="font-medium text-xl text-ink mb-3 leading-snug">
              Great, we help with that every day.
            </h2>
            <p className="text-silver text-sm leading-relaxed mb-6">
              Enter your email so we can send your Rella Reveal and $50 credit.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="reveal-email" className="block text-sm font-medium text-ink mb-1">
                  Email
                </label>
                <input
                  id="reveal-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
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

              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={status === "sending"} className="w-full">
                  {status === "sending" ? "Sending..." : "Send My Rella Reveal"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-11 text-sm text-silver hover:text-ink transition-colors"
                >
                  &larr; Choose a different interest
                </button>
              </div>
            </form>
          </>
        )}

        <p className="mt-4 text-xs text-silver leading-relaxed">
          $50 credit applies to your first visit over $250. By submitting, you agree to our{" "}
          <Link href="/privacy-policy" className="underline hover:text-ink">
            Privacy Policy
          </Link>
          . We&apos;ll use your email to send your plan and offer — not for unrelated marketing.
        </p>
      </div>
    </div>
  );
}
