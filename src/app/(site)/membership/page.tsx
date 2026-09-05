import type { Metadata } from "next";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { membershipTiers } from "@/lib/data";

export const metadata: Metadata = {
  title: "2026 Injectable Memberships",
  description:
    "Compare Rella's 2026 Tox, Filler, and Tox + Filler memberships, including monthly dues, member rates, benefits, and one-year terms.",
  alternates: { canonical: "/membership" },
};

const faq = [
  { question: "Which injectable memberships are available?", answer: "Rella's approved 2026 public injectable options are Tox at $30/month, Filler at $40/month, and Tox + Filler at $50/month. Each has a one-year commitment." },
  { question: "What are the Tox member rates?", answer: "Tox and Tox + Filler members pay $13/unit for Botox and $4.40/unit for Dysport. Standard pricing is $18/unit for Botox and $6/unit for Dysport." },
  { question: "What are the Filler member rates?", answer: "Filler and Tox + Filler members pay $600 per Restylane syringe. Juvederm member rates are $600 or $700 depending on the product; the team can review the exact product-specific rate before treatment." },
  { question: "When can I use the complimentary HydraFacial?", answer: "The included HydraFacial can be redeemed after six months of on-time payments, or immediately when the full membership year is paid in advance. Tox and Filler include a Signature HydraFacial; Tox + Filler includes a Deluxe HydraFacial." },
  { question: "Is there a commitment?", answer: "Yes. These 2026 aesthetic memberships have a one-year commitment. Review the complete membership agreement before enrolling." },
  { question: "Is a booking deposit part of the membership price?", answer: "No. A booking deposit and per-unit treatment prices are separate. Rella's secure booking experience will show any booking requirement before you confirm an appointment." },
  { question: "What if I already have a different Rella membership?", answer: "Legacy memberships may have different terms. Contact Rella so the team can review the plan attached to your account rather than assuming the 2026 new-member terms apply." },
] as const;

export default function MembershipPage() {
  return (
    <>
      <FaqSchema items={faq} />

      <section className="bg-rose py-24 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
            Membership
          </p>
          <h1 className="mb-5 break-words text-[clamp(1.9rem,9vw,2.25rem)] font-bold uppercase leading-[1.08] tracking-[0.04em] text-ink sm:text-4xl sm:tracking-[0.08em] md:text-6xl">
            2026 Memberships
          </h1>
          <p className="max-w-[560px] text-lg font-light leading-relaxed text-ink">
            Compare current injectable membership dues, member rates, included benefits, and the
            terms that matter before you enroll.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-[680px]">
            <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-rose-text">
              2026 Public Plans
            </p>
            <h2 className="mb-5 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] text-rose-text md:text-5xl">
              Injectable Memberships
            </h2>
            <p className="max-w-[620px] leading-relaxed text-ink/70">
              Choose Tox, Filler, or the combined plan. Every option below is published with its
              monthly dues and one-year commitment.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {membershipTiers.map((tier) => (
              <article key={tier.name} className="flex flex-col border border-rose bg-white p-8">
                <h3 className="mb-3 text-xl font-bold uppercase tracking-[0.08em] text-rose-text">
                  {tier.name}
                </h3>
                <p className="mb-2">
                  <span className="text-3xl font-bold text-rose-text">{tier.price}</span>
                  <span className="text-sm font-light text-ink/60">/{tier.period}</span>
                </p>
                <ul className="my-6 flex-1 space-y-0">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="relative border-b border-rose/35 py-3 pl-6 text-sm font-light leading-relaxed text-ink/75"
                    >
                      <span className="absolute left-0 font-bold text-ink" aria-hidden="true">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button href="/contact?intent=membership" variant="ghost" disableHover className="w-full">
                  Ask About Membership
                </Button>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-12 max-w-[900px] border-y border-rose bg-rose-blush p-6 text-sm leading-7 text-ink/70 md:p-8">
            <p>
              <strong className="text-ink">*Included HydraFacial timing:</strong> redeem after six
              months of on-time payments, or immediately if the full membership year is paid in
              advance. Tox and Filler include one Signature HydraFacial; Tox + Filler includes one
              Deluxe HydraFacial.
            </p>
            <p className="mt-3">
              Member rates apply under the complete membership agreement. Product choice and
              treatment plans are determined through an individual clinical assessment, and the
              proposed total is reviewed before treatment.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-rose py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <h2 className="mb-12 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] text-ink md:text-5xl">
            Membership FAQ
          </h2>
          <FaqAccordion items={faq} tone="light" />
        </div>
      </section>
    </>
  );
}
