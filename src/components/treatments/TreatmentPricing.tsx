import Link from "next/link";
import type { TreatmentPricingRow } from "@/lib/treatment-editorial";

interface TreatmentPricingProps {
  id: string;
  body: string;
  note?: string;
  rows?: readonly TreatmentPricingRow[];
  showMembershipLink?: boolean;
}

export function TreatmentPricing({
  id,
  body,
  note,
  rows,
  showMembershipLink = false,
}: TreatmentPricingProps) {
  return (
    <section
      id="pricing"
      className="rella-site-reveal scroll-mt-28 bg-ivory py-28 md:py-36"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-[880px] px-6 md:px-8">
        <p className="rella-editorial-eyebrow mb-6">Investment</p>
        <h2
          id={id}
          className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          Pricing
        </h2>

        {rows && rows.length > 0 ? (
          <div className="mt-14 space-y-0 border-t border-rule">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule py-8"
              >
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver">
                  {row.label}
                </span>
                <span className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink">
                  {row.amount}
                  {row.unit ? (
                    <span className="ml-1 text-base font-light tracking-normal text-silver">
                      {row.unit}
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <p
          className={`max-w-[40rem] text-base font-light leading-relaxed text-silver md:text-lg ${rows && rows.length > 0 ? "mt-10" : "mt-14"}`}
        >
          {body}
        </p>
        {note ? (
          <p className="mt-6 max-w-[40rem] text-sm font-light leading-relaxed text-silver">
            {note}
          </p>
        ) : null}
        {showMembershipLink ? (
          <Link href="/membership" className="rella-cta-rect rella-cta-rect--ghost mt-12">
            Explore membership
          </Link>
        ) : null}
      </div>
    </section>
  );
}
