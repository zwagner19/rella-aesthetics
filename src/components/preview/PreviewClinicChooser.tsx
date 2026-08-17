"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveBookingHref } from "@/lib/booking-routes";
import { shouldOfferPreviewClinicChooser } from "@/lib/preview-experience";

export const PREVIEW_CLINIC_CHOOSER_SESSION_KEY =
  "rella_preview_clinic_chooser_seen_v1";
export const PREVIEW_CLINIC_CHOOSER_DELAY_MS = 1400;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function hasSeenChooser(): boolean {
  try {
    return window.sessionStorage.getItem(PREVIEW_CLINIC_CHOOSER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberChooser(): void {
  try {
    window.sessionStorage.setItem(PREVIEW_CLINIC_CHOOSER_SESSION_KEY, "1");
  } catch {
    // The review remains usable when storage is unavailable.
  }
}

export function PreviewClinicChooser() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const hasOpenedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeChooser = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    } else {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const eligible = shouldOfferPreviewClinicChooser(
      pathname,
      window.location.search,
    );

    if (!eligible) {
      if (dialogRef.current?.open) dialogRef.current.close();
      return;
    }
    if (hasOpenedRef.current || hasSeenChooser()) return;

    const timer = window.setTimeout(() => {
      if (!shouldOfferPreviewClinicChooser(pathname, window.location.search)) return;
      hasOpenedRef.current = true;
      rememberChooser();
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setIsOpen(true);
    }, PREVIEW_CLINIC_CHOOSER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [closeChooser, pathname]);

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

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => element.tabIndex >= 0 && !element.hidden);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

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

  const napaBookingHref = resolveBookingHref({ location: "napa" });
  const vacavilleBookingHref = resolveBookingHref({ location: "vacaville" });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="preview-clinic-chooser-title"
      aria-describedby="preview-clinic-chooser-description"
      className="rella-preview-dialog"
      onCancel={(event) => {
        event.preventDefault();
        closeChooser();
      }}
      onClose={handleDialogClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeChooser();
      }}
      onKeyDown={handleDialogKeyDown}
      tabIndex={-1}
    >
      <div className="overflow-hidden rounded-t-[1.75rem] bg-white md:rounded-[2rem]">
        <div className="relative bg-rose px-6 pb-7 pt-8 text-ink sm:px-8 md:px-10 md:pb-8 md:pt-10">
          <button
            type="button"
            aria-label="Close clinic chooser"
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-ink bg-white text-ink transition-transform duration-200 hover:scale-[1.04] focus-visible:scale-[1.04]"
            onClick={closeChooser}
            autoFocus
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <p className="mb-3 pr-12 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink">
            Two local clinics
          </p>
          <h2
            id="preview-clinic-chooser-title"
            className="max-w-[30rem] pr-10 text-3xl font-bold uppercase leading-[1.08] tracking-[0.05em] text-ink md:text-4xl"
          >
            Choose your Rella clinic
          </h2>
        </div>

        <div className="px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-8 md:px-10 md:pb-10 md:pt-8">
          <p
            id="preview-clinic-chooser-description"
            className="mb-6 max-w-[34rem] text-[0.9375rem] font-light leading-7 text-ink/70 md:text-base"
          >
            Start with the location that works for you. You&apos;ll see that clinic&apos;s booking options next.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={napaBookingHref}
              data-cta="location-booking"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-[1.5px] border-ink bg-rose px-5 text-center text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-rose/85"
            >
              Continue with Napa
            </a>
            <a
              href={vacavilleBookingHref}
              data-cta="location-booking"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-[1.5px] border-ink bg-white px-5 text-center text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-rose"
            >
              Continue with Vacaville
            </a>
          </div>

          <button
            type="button"
            className="mx-auto mt-5 block min-h-11 px-3 text-xs font-medium text-ink underline decoration-rose decoration-2 underline-offset-4"
            onClick={closeChooser}
          >
            Keep exploring the site
          </button>
        </div>
      </div>
    </dialog>
  );
}
