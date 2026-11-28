import Link from "next/link";
import { COPY } from "@/lib/gift-cards/config";
import s from "./gift.module.css";

/** Shown ONLY after the email provider accepted the recipient email. */
export function GiftConfirmation({ recipientFirstName }: { recipientFirstName: string }) {
  return (
    <section className={s.sent} aria-live="polite">
      <svg className={s.envelope} viewBox="0 0 96 96" aria-hidden="true">
        <rect x="14" y="34" width="68" height="46" rx="6" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
        <path className={s.envHeart} d="M48 56c-6-5-12-8.5-12-14a6.5 6.5 0 0 1 12-3.4A6.5 6.5 0 0 1 60 42c0 5.5-6 9-12 14z" fill="#F7A19A" />
        <path d="M14 78 40 56M82 78 56 56" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
        <path className={s.envFlap} d="M14 36 48 60 82 36" fill="#F7F4EF" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <h2 id="gift-confirmation-title" className={`${s.h1} ${s.italic}`}>{COPY.sent.headline}</h2>
      <p className={s.lede}>{COPY.sent.body(recipientFirstName)}</p>
      <Link className={s.btn} href="/">
        {COPY.sent.back}
      </Link>
    </section>
  );
}
