import Image from "next/image";
import Link from "next/link";

const benefits = [
  "Member rates on injectable treatments",
  "Complimentary HydraFacial with qualifying membership terms",
  "Retail savings on select products",
] as const;

export function HomeMembership() {
  return (
    <section
      className="rella-site-reveal border-y border-rule/50 bg-ivory py-20 md:py-28"
      aria-labelledby="membership-heading"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
        <div className="relative aspect-[4/5] overflow-hidden bg-oat">
          <Image
            src="/images/clinic/rella-sidewalk-sign.webp"
            alt="A Rella Aesthetics sidewalk sign welcoming patients outside the clinic"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </div>
        <div>
          <p className="rella-editorial-eyebrow mb-5">Rella membership</p>
          <h2
            id="membership-heading"
            className="text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
          >
            A little more Rella.
          </h2>
          <p className="mt-6 max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            Membership is built for patients who want thoughtful care on a rhythm that fits their
            year — clear benefits, no SaaS-style plan cards here.
          </p>
          <ul className="mt-8 max-w-[28rem] space-y-0 border-t border-rule">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="border-b border-rule py-4 text-sm font-light leading-relaxed text-ink md:text-base"
              >
                {benefit}
              </li>
            ))}
          </ul>
          <Link href="/membership" className="rella-cta-rect rella-cta-rect--filled mt-10">
            Explore membership
          </Link>
        </div>
      </div>
    </section>
  );
}
