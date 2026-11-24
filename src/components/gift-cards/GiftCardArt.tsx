import { RellaLogo } from "./RellaMark";
import s from "./gift.module.css";

/**
 * Digital gift card. PENDING Zach's reference photo of the physical card:
 * colors, logo placement and type live only in this component + .card* CSS.
 */
export function GiftCardArt({ value, meta, kicker = "Gift Card" }: { value: string; meta?: string; kicker?: string }) {
  return (
    <div className={s.card} role="img" aria-label={`Rella gift card, ${value}${meta ? `, ${meta}` : ""}`} data-pending-reference-photo="true">
      <div className={s.cardTop}>
        <RellaLogo height={40} color="#FFFFFF" title="" />
        <span className={s.cardKicker}>{kicker}</span>
      </div>
      <div>
        <div className={s.cardValue}>{value}</div>
        {meta ? <div className={s.cardMeta}>{meta}</div> : null}
      </div>
    </div>
  );
}
