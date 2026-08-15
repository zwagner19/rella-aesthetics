import type { Metadata } from "next";

import { CherryFinancingWidget } from "@/components/integrations/CherryFinancingWidget";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment Plans",
  description:
    "Ask Rella Aesthetics about current payment-plan availability through Cherry and its lending partners.",
  alternates: { canonical: "/payment-plans" },
};

export default function PaymentPlansPage() {
  return (
    <>
      <section className="bg-ink py-24 text-white md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-white">
            Plan Your Visit
          </p>
          <h1 className="max-w-[760px] text-4xl font-bold uppercase leading-[1.08] tracking-[0.08em] md:text-6xl">
            Payment Plans
          </h1>
          <p className="mt-6 max-w-[640px] text-lg font-light leading-relaxed text-white/75">
            Rella currently makes patient-financing information available through Cherry. Ask the
            team which current services or purchases may be eligible before making a decision.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="cherry-options-heading">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
            Cherry Financing
          </p>
          <h2
            id="cherry-options-heading"
            className="text-3xl font-bold uppercase leading-[1.12] tracking-[0.07em] text-ink md:text-5xl"
          >
            Explore current options
          </h2>
          <p className="mb-10 mt-6 max-w-[720px] leading-8 text-ink/70">
            Use the current Cherry experience below to review how financing works, estimate a
            payment, read common questions, and continue to Cherry if you choose to apply.
          </p>
          <CherryFinancingWidget />
        </div>
      </section>

      <section className="bg-rose/15 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
              Current Partner
            </p>
            <h2 className="text-3xl font-bold uppercase leading-[1.12] tracking-[0.07em] text-ink md:text-5xl">
              Questions before you apply?
            </h2>
            <p className="mt-6 max-w-[620px] leading-8 text-ink/70">
              Payment plans are offered through Cherry and its lending partners. Eligibility is
              subject to approval, and terms and conditions apply. Rella does not promise an
              approval, rate, payment amount, credit limit, or repayment term.
            </p>
            <div className="mt-9">
              <Button href="/contact?intent=payment-plans">Ask About Payment Plans</Button>
            </div>
          </div>

          <aside className="border-y border-ink/15 bg-rose/20 py-8 lg:px-8" aria-label="Payment plan disclosure">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">Before proceeding</p>
            <p className="mt-5 leading-8 text-ink/70">
              Review the current lender disclosures presented during any application. Rella can
              answer questions about its services, but financing eligibility and terms come from
              the applicable lender disclosures.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
