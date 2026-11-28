"use client";
import { useEffect, useRef } from "react";
import {
  BLACK_FRIDAY_2026,
  BOULEVARD_CHECKOUT,
  boulevardWidgetParams,
  type ClinicId,
  type GiftCardOffer,
} from "@/lib/gift-cards/config";
import s from "./gift.module.css";

type BlvdWidgetParams = ReturnType<typeof boulevardWidgetParams>;
type Blvd = {
  init: (o: { businessId: string }) => void;
  openBookingWidget: (o: { urlParams: BlvdWidgetParams }) => void;
};
declare global {
  interface Window {
    blvd?: Blvd;
  }
}

let loading: Promise<Blvd> | null = null;

/**
 * Loads Boulevard's booking-widget script once, only when this route asks for
 * it (never site-wide). Rejects after a timeout so Purchase can fail closed.
 */
export function loadBoulevardWidget(timeoutMs = 15_000): Promise<Blvd> {
  if (typeof window === "undefined") return Promise.reject(Error("no-window"));
  if (loading) return loading;
  loading = new Promise<Blvd>((resolve, reject) => {
    const ready = () => {
      const b = window.blvd;
      if (!b || typeof b.init !== "function" || typeof b.openBookingWidget !== "function") return false;
      b.init({ businessId: BOULEVARD_CHECKOUT.businessId });
      resolve(b);
      return true;
    };
    const timer = window.setTimeout(() => {
      loading = null;
      reject(Error("blvd-timeout"));
    }, timeoutMs);
    const el = document.createElement("script");
    el.src = BOULEVARD_CHECKOUT.injectorSrc;
    el.async = true;
    el.dataset.bfBoulevard = "1";
    el.onload = () => {
      window.clearTimeout(timer);
      if (!ready()) {
        loading = null;
        reject(Error("blvd-missing"));
      }
    };
    el.onerror = () => {
      window.clearTimeout(timer);
      loading = null;
      el.remove();
      reject(Error("blvd-load-failed"));
    };
    document.head.appendChild(el);
  });
  return loading;
}

/** Opens the Boulevard widget on the chosen package. Throws if unavailable. */
export async function openBoulevardPackage(offer: GiftCardOffer, clinic: ClinicId): Promise<void> {
  const urlParams = boulevardWidgetParams(offer.id, clinic);
  const blvd = await loadBoulevardWidget();
  blvd.openBookingWidget({ urlParams });
}

const ADDRESS: Record<ClinicId, string> = {
  napa: BLACK_FRIDAY_2026.locations.find((l) => l.name.includes("Napa"))?.address ?? "",
  vacaville: BLACK_FRIDAY_2026.locations.find((l) => l.name.includes("Vacaville"))?.address ?? "",
};

/** Small clinic chooser shown before Boulevard checkout (credit is bought per location). */
export function ClinicChooser({
  offer,
  busy,
  ownCheckout = false,
  onChoose,
  onClose,
}: {
  offer: GiftCardOffer;
  busy: boolean;
  /** Rella's own checkout follows on this page (instead of Boulevard's pop-up). */
  ownCheckout?: boolean;
  onChoose: (clinic: ClinicId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    first.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = dialog.current.querySelectorAll<HTMLElement>("button:not([disabled])");
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={`${s.root} ${s.overlay} ${s.chooserOverlay}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={dialog} className={`${s.modal} ${s.chooser}`} role="dialog" aria-modal="true" aria-labelledby="clinic-title" aria-describedby="clinic-desc">
        <button type="button" className={s.close} onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className={s.chooserEyebrow}>{offer.title}</p>
        <h2 id="clinic-title" className={`${s.chooserTitle} ${s.italic}`}>
          Choose your clinic
        </h2>
        <p id="clinic-desc" className={s.chooserBody}>
          Select the Rella location for this purchase.
        </p>
        <div className={s.chooserOptions}>
          {BOULEVARD_CHECKOUT.clinics.map((c, i) => (
            <button
              key={c.id}
              ref={i === 0 ? first : undefined}
              type="button"
              className={s.chooserOption}
              disabled={busy}
              onClick={() => onChoose(c.id)}
            >
              <span className={s.chooserName}>{c.name}</span>
              <span className={s.chooserAddr}>{ADDRESS[c.id]}</span>
            </button>
          ))}
        </div>
        <p className={s.chooserFoot} role="status" aria-live="polite">
          {busy ? "Opening secure checkout…" : ownCheckout ? "Your account credit is added at the clinic you choose." : "Checkout opens in Boulevard, our booking system."}
        </p>
      </div>
    </div>
  );
}
