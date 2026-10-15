import { membershipTiers } from "@/lib/data";

export function HomeMembership() {
  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-10 md:py-16"
      aria-labelledby="membership-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <p className="rella-editorial-eyebrow mb-4">Rella membership</p>
        <h2
          id="membership-heading"
          className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
        >
          A little more Rella
        </h2>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {membershipTiers.map((tier) => (
            <li key={tier.name} className="border border-rule px-5 py-5">
              <h3 className="text-lg font-medium tracking-[-0.01em] text-ink">{tier.name}</h3>
              <p className="mt-2 text-sm text-ink">
                <span className="font-medium">{tier.price}</span>
                <span className="font-light text-silver">/{tier.period}</span>
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-rule pt-4">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="text-sm font-light leading-relaxed text-silver">
                    {benefit}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[40rem] text-xs font-light leading-relaxed text-silver">
          Each membership is a one-year commitment. The included HydraFacial can be redeemed after
          six months of on-time payments, or immediately when the full membership year is paid in
          advance.
        </p>

        <a href="tel:7073582928" className="rella-cta-rect rella-cta-rect--filled mt-8">
          Questions? Give us a call
        </a>
      </div>
    </section>
  );
}
