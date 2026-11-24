import { BLACK_FRIDAY_2026, COPY, VIP_EXPERIENCES } from "@/lib/gift-cards/config";
import { RellaMark } from "./RellaMark";
import s from "./gift.module.css";

type Props = {
  passId: string;
  /** Teaser hides the experiences (landing page). */
  teaser?: boolean;
  className?: string;
};

export function VipPass({ passId, teaser = false, className }: Props) {
  return (
    <article className={`${s.pass} ${className ?? ""}`} aria-label="Rella VIP Guest Pass" data-pass-id={teaser ? undefined : passId}>
      <div className={s.passFrame}>
        <div className={s.passInner}>
          <div className={s.passHead}>
            <RellaMark size={40} color="#1A1A1A" title="Rella" />
            <div className={s.passId}>
              Pass ID
              <strong>{passId}</strong>
            </div>
          </div>
          <p className={s.passBrand}>{COPY.pass.brand}</p>
          <p className={s.passTitle}>{COPY.pass.title}</p>
          <hr className={s.goldRule} />
          <p className={`${s.passLine} ${s.italic}`}>{COPY.pass.line}</p>
          {teaser ? (
            <div className={s.teaserVeil}>
              <ul className={s.teaserBars} aria-hidden="true">
                {[78, 64, 86, 58, 70, 82].map((w, i) => (
                  <li key={i}>
                    <span style={{ width: `${w}%` }} />
                  </li>
                ))}
              </ul>
              <p className={s.teaserCaption}>Six experiences · revealed with your purchase</p>
            </div>
          ) : (
            <>
              <p className={s.passHeading}>{COPY.pass.heading}</p>
              <ul className={s.perks}>
                {VIP_EXPERIENCES.map((e) => (
                  <li key={e.id}>{e.label}</li>
                ))}
              </ul>
              <p className={s.chooseOne}>
                Your guest chooses <strong>one</strong> experience.
              </p>
              <hr className={s.perf} />
              <div className={s.dates}>
                <span>
                  Book by<strong>{BLACK_FRIDAY_2026.pass.bookBy.label}</strong>
                </span>
                <span style={{ textAlign: "right" }}>
                  Redeem by<strong>{BLACK_FRIDAY_2026.pass.redeemBy.label}</strong>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
