"use client";
import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/gift-cards/config";
import { Confetti } from "./Confetti";
import { GiftConfirmation } from "./GiftConfirmation";
import { GiftingForm, type GiftSubmit } from "./GiftingForm";
import { VipPass } from "./VipPass";
import { downloadPassPng } from "./pass-png";
import s from "./gift.module.css";

type Props = {
  passId: string;
  purchaserName: string;
  onSubmit: GiftSubmit;
  onSendLater: () => Promise<{ ok: boolean; message: string }>;
  /** Pass already sent (returning visitor): skip straight to status. */
  initialSentTo?: string | null;
  banner?: React.ReactNode;
  onClose?: () => void;
  /** DEMO route only: play confetti even with reduced motion; bump to replay. */
  demoConfetti?: { replay: number };
};

/**
 * Celebration after a SERVER-VERIFIED payment. Callers must not render this
 * for pending/failed/cancelled purchases; the page decides from server state.
 */
export function CelebrationModal({ passId, purchaserName, onSubmit, onSendLater, initialSentTo = null, banner, onClose, demoConfetti }: Props) {
  const [sentTo, setSentTo] = useState<string | null>(initialSentTo);
  const [open, setOpen] = useState(true);
  const [downloadError, setDownloadError] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const close = () => (onClose ? onClose() : setOpen(false));

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.focus({ preventScroll: true });
    dialog.current?.parentElement?.scrollTo({ top: 0 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);

  if (!open) {
    return (
      <div className={s.passActions}>
        <button type="button" className={s.btn} onClick={() => setOpen(true)}>
          View my VIP Guest Pass
        </button>
      </div>
    );
  }

  return (
    <div className={`${s.root} ${s.overlay}`}>
      {sentTo ? null : <Confetti key={demoConfetti?.replay ?? 0} ignoreReducedMotion={Boolean(demoConfetti)} />}
      <div ref={dialog} className={s.modal} role="dialog" aria-modal="true" aria-labelledby="celebration-title" tabIndex={-1}>
        {banner}
        <button type="button" className={s.close} onClick={close} aria-label="Close">
          ×
        </button>
        {sentTo ? (
          <GiftConfirmation recipientFirstName={sentTo} />
        ) : (
          <>
            <h1 id="celebration-title" className={`${s.h1} ${s.italic}`}>
              {COPY.celebration.headline}
            </h1>
            <p className={s.lede}>{COPY.celebration.body}</p>
            <p className={`${s.secondary} ${s.italic}`}>{COPY.celebration.secondary}</p>
            <div className={s.reveal}>
              <VipPass passId={passId} />
            </div>
            <div className={s.passActions}>
              <button
                type="button"
                className={s.linkBtn}
                onClick={() => downloadPassPng(passId).then(() => setDownloadError(false), () => setDownloadError(true))}
              >
                Save pass as image
              </button>
            </div>
            {downloadError ? <p className={s.small} role="alert">We couldn&apos;t create the image on this device. A screenshot works too.</p> : null}
            <GiftingForm purchaserName={purchaserName} onSubmit={onSubmit} onSendLater={onSendLater} onSent={setSentTo} />
          </>
        )}
      </div>
    </div>
  );
}
