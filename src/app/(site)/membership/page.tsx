import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TierCard } from "@/components/blocks/TierCard";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { membershipTiers } from "@/lib/data";

export const metadata: Metadata = {
  title: "VIP Membership",
  description:
    "Join the 2026 Rella Tox Membership for $30/month with preferred Botox and Dysport pricing and a one-year commitment.",
  alternates: { canonical: "/membership" },
};

const faq = [
  { question: "How does the 2026 Tox Membership work?", answer: "The membership is $30/month with a one-year commitment. It provides the approved member rates for Botox and Dysport." },
  { question: "What are the member rates?", answer: "Members pay $13/unit for Botox and $4.40/unit for Dysport. Standard pricing is $18/unit for Botox and $6/unit for Dysport." },
  { question: "Is there a commitment?", answer: "Yes. The 2026 aesthetic membership has a one-year commitment. Review the complete membership terms before enrolling." },
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
            VIP Membership
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            Elevated Care, Every Month
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Straightforward 2026 member pricing for patients who plan to maintain Botox or Dysport treatment over the year.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="2026 Public Plan"
            title="Tox Membership"
            description="One current new-patient membership, published with the same pricing used across Rella's website and Napa Tox campaign."
          />
          <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-6">
            {membershipTiers.map((tier) => (
              <TierCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                benefits={[...tier.benefits]}
                featured={false}
                ctaHref={resolveBookingHref({ service: "botox" })}
                ctaText="Book a Tox Consultation"
              />
            ))}
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
