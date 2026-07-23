import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TierCard } from "@/components/blocks/TierCard";
import { FaqAccordion, FaqSchema } from "@/components/blocks/FaqAccordion";
import { membershipTiers } from "@/lib/data";
import { BOOKING_URL_DEFAULT } from "@/lib/booking-links";

export const metadata: Metadata = {
  title: "VIP Membership",
  description:
    "Join Rella Aesthetics' VIP Membership for preferred pricing on Botox, fillers, and skincare products. Three tiers to fit your aesthetic goals.",
};

const faq = [
  { question: "How does the membership work?", answer: "Choose your tier and pay a low monthly fee. Your membership unlocks preferred pricing on treatments and products. There is no minimum commitment — cancel anytime after 3 months." },
  { question: "Can I switch tiers?", answer: "Yes. You can upgrade or downgrade your membership tier at any time. Changes take effect on your next billing cycle." },
  { question: "Is there a contract?", answer: "We ask for a 3-month minimum commitment to ensure you experience the full benefits. After that, you can cancel anytime with 30 days' notice." },
  { question: "Do membership benefits stack with promotions?", answer: "Membership pricing is already our best rate. Promotional discounts may not be combined with membership benefits unless explicitly stated." },
  { question: "Can I share my membership?", answer: "Memberships are individual and non-transferable. Each household member would need their own membership." },
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
            Become a Rella VIP and access preferred pricing, exclusive perks, and a membership
            designed around your aesthetic journey.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Choose Your Tier"
            title="Membership Plans"
            description="Select the plan that matches your treatment goals. All memberships include preferred pricing and skincare product discounts."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipTiers.map((tier) => (
              <TierCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                benefits={[...tier.benefits]}
                featured={"featured" in tier && tier.featured === true}
                ctaHref={BOOKING_URL_DEFAULT}
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
