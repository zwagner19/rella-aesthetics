"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { dispatchConversion } from "@/lib/conversion-tracking";
import {
  resolveCustomBookingEntry,
  WEIGHT_LOSS_BOOKING_ORIGIN,
} from "@/lib/booking-routes";
import { shouldOfferPreviewClinicChooser } from "@/lib/preview-experience";

export const PREVIEW_CLINIC_CHOOSER_SESSION_KEY = "rella_reveal_seen_v1";
export const PREVIEW_CLINIC_CHOOSER_DELAY_MS = 35_000;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const INTERESTS = [
  { label: "Fine lines / wrinkles", service: "botox" },
  { label: "Pigment / sun damage", service: "laser" },
  { label: "Texture / pores", service: "facials" },
  { label: "Body sculpting", service: "body sculpting" },
  { label: "Weight loss", service: "weight loss" },
  { label: "I’m not sure, I need guidance", service: "consultation" },
] as const;

type Interest = (typeof INTERESTS)[number];
type Step = "interest" | "email" | "success";

function hasSeenReveal(): boolean {
  try {
    return window.sessionStorage.getItem(PREVIEW_CLINIC_CHOOSER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberReveal(): void {
  try {
    window.sessionStorage.setItem(PREVIEW_CLINIC_CHOOSER_SESSION_KEY, "1");
  } catch {
    // The offer remains usable when storage is unavailable.
  }
}

function bookingHref(interest: Interest | null): string {
  if (!interest) return "/book";
  if (interest.service === "weight loss") return `${WEIGHT_LOSS_BOOKING_ORIGIN}/book`;
  return resolveCustomBookingEntry({ service: interest.service });
}

export function PreviewClinicChooser() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const hasOpenedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("interest");
  const [interest, setInterest] = useState<Interest | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeReveal = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else setIsOpen(false);
  }, []);

  const openReveal = useCallback(() => {
    if (hasOpenedRef.current || hasSeenReveal()) return;
    hasOpenedRef.current = true;
    rememberReveal();
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const eligible = shouldOfferPreviewClinicChooser(pathname, window.location.search);
    if (!eligible) {
      if (dialogRef.current?.open) dialogRef.current.close();
      return;
    }
    if (hasOpenedRef.current || hasSeenReveal()) return;

    const timer = window.setTimeout(openReveal, PREVIEW_CLINIC_CHOOSER_DELAY_MS);
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.4) openReveal();
    };
    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0 && window.innerWidth >= 768) openReveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseLeave);
    };
  }, [openReveal, pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    if (!dialog.open) dialog.showModal();
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.overscrollBehavior = previousOverscroll;
    };
  }, [isOpen]);

  function handleDialogClose() {
    setIsOpen(false);
    const previous = restoreFocusRef.current;
    restoreFocusRef.current = null;
    if (previous?.isConnected) previous.focus({ preventScroll: true });
  }

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function chooseInterest(next: Interest) {
    setInterest(next);
    setError("");
    setStep("email");
  }

  async function submitReveal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interest) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Rella Reveal Prospect",
          email,
          service: interest.label,
          location: "No preference",
          message: `Rella Reveal interest: ${interest.label}`,
        }),
      });
      if (!response.ok) throw new Error("lead-submit-failed");
      dispatchConversion("contact_form_success");
      setStep("success");
    } catch {
      setError("We couldn’t save that just yet. Please try again or call Rella directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="preview-clinic-chooser-title"
      aria-describedby="preview-clinic-chooser-description"
      className="rella-preview-dialog"
      onCancel={(event) => {
        event.preventDefault();
        closeReveal();
      }}
      onClose={handleDialogClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeReveal();
      }}
      onKeyDown={handleDialogKeyDown}
      tabIndex={-1}
    >
      <div className="overflow-hidden rounded-t-[1.75rem] bg-white md:rounded-[2rem]">
        <div className="relative bg-rose px-6 pb-7 pt-8 text-ink sm:px-8 md:px-10 md:pb-8 md:pt-10">
          <button
            type="button"
            aria-label="Close Rella Reveal"
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-ink bg-white text-ink transition-transform duration-200 hover:scale-[1.04] focus-visible:scale-[1.04]"
            onClick={closeReveal}
            autoFocus
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <p className="mb-3 pr-12 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
            The Rella Reveal
          </p>
          <h2 id="preview-clinic-chooser-title" className="max-w-[34rem] pr-10 text-3xl font-bold uppercase leading-[1.08] tracking-[0.05em] text-ink md:text-4xl">
            {step === "success" ? "Your reveal is ready" : "Unlock your personal plan"}
          </h2>
        </div>

        <div className="px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-8 md:px-10 md:pb-10 md:pt-8">
          {step === "interest" && (
            <>
              <p id="preview-clinic-chooser-description" className="mb-6 max-w-[36rem] text-[0.9375rem] font-light leading-7 text-ink/80 md:text-base">
                Get a personalized skin and confidence plan from our providers, plus a $50 treatment credit on your first visit over $250.
              </p>
              <p className="mb-3 text-sm font-bold text-ink">What are you most interested in?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTERESTS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    className="min-h-12 rounded-full border-[1.5px] border-rose bg-white px-4 py-3 text-left text-sm font-medium text-rose transition-colors hover:bg-rose hover:text-white focus-visible:bg-rose focus-visible:text-white"
                    onClick={() => chooseInterest(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "email" && interest && (
            <form onSubmit={submitReveal}>
              <p id="preview-clinic-chooser-description" className="mb-6 max-w-[35rem] text-[0.9375rem] font-light leading-7 text-ink/80 md:text-base">
                Great, we help with that every day. Enter your email so we can send your Rella Reveal and $50 credit details.
              </p>
              <p className="mb-2 text-sm font-bold text-ink">Your interest</p>
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-ink/20 pb-3 text-sm text-ink">
                <span>{interest.label}</span>
                <button type="button" className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4" onClick={() => setStep("interest")}>Change</button>
              </div>
              <label htmlFor="rella-reveal-email" className="mb-2 block text-sm font-bold text-ink">Email address</label>
              <input id="rella-reveal-email" name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mb-3 min-h-12 w-full rounded-none border border-ink bg-white px-4 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-rose" />
              {error && <p role="alert" className="mb-3 text-sm font-medium text-ink">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border-[1.5px] border-ink bg-rose px-5 text-center text-xs font-bold uppercase tracking-[0.15em] text-ink disabled:cursor-wait disabled:opacity-60">
                {isSubmitting ? "Saving…" : "Send my Rella Reveal"}
              </button>
            </form>
          )}

          {step === "success" && interest && (
            <div>
              <p id="preview-clinic-chooser-description" className="mb-6 max-w-[35rem] text-[0.9375rem] font-light leading-7 text-ink/80 md:text-base">
                We’ll follow up with your personalized plan and credit details. Ready to take the next step?
              </p>
              <a href={bookingHref(interest)} data-cta="booking-flow-start" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border-[1.5px] border-ink bg-rose px-5 text-center text-xs font-bold uppercase tracking-[0.15em] text-ink">
                Book now
              </a>
            </div>
          )}

          <button type="button" className="mx-auto mt-5 block min-h-11 px-3 text-xs font-medium text-ink underline decoration-rose decoration-2 underline-offset-4" onClick={closeReveal}>
            Keep exploring the site
          </button>
        </div>
      </div>
    </dialog>
  );
}
