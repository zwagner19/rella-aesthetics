import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TierCard } from "@/components/blocks/TierCard";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
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
  { question: "Is a booking deposit part of the membership price?", answer: "No. A booking deposit and per-unit treatment prices are separate. Boulevard will show any booking requirement before you confirm an appointment." },
  { question: "What if I already have a different Rella membership?", answer: "Legacy memberships may have different terms. Contact Rella so the team can review the plan attached to your account rather than assuming the 2026 new-member terms apply." },
];

export default function MembershipPage() {
  return (
    <>
      <FaqSchema items={faq} />

      {/* Hero */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            Membership
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            2026 Memberships
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Compare current injectable membership dues, member rates, included benefits, and the terms that matter before you enroll.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="2026 Public Plans"
            title="Injectable Memberships"
            description="Choose Tox, Filler, or the combined plan. Every option below is published with its monthly dues and one-year commitment."
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {membershipTiers.map((tier) => (
              <TierCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                benefits={[...tier.benefits]}
                featured={false}
                ctaHref="/contact"
                ctaText="Ask About Membership"
              />
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-[900px] rounded-[1.25rem] border border-rose-light bg-rose-blush p-6 text-sm leading-7 text-silver-dark md:p-8">
            <p>
              <strong>*Included HydraFacial timing:</strong> redeem after six months of on-time payments, or immediately if the full membership year is paid in advance. Tox and Filler include one Signature HydraFacial; Tox + Filler includes one Deluxe HydraFacial.
            </p>
            <p className="mt-3">
              Member rates apply under the complete membership agreement. Product choice and treatment plans are determined through an individual clinical assessment, and the proposed total is reviewed before treatment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader title="Membership FAQ" />
          <FaqAccordion items={faq} />
        </div>
      </section>
    </>
  );
}
