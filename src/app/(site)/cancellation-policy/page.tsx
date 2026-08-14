import type { Metadata } from "next";
import Link from "next/link";
import { CANCELLATION_POLICY } from "@/lib/napa-botox-facts";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "Review Rella Aesthetics' current cancellation and booking-deposit policy before your appointment.",
  alternates: { canonical: "/cancellation-policy" },
};

export default function CancellationPolicyPage() {
  return (
    <>
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/70">
            Before Your Visit
          </p>
          <h1 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase text-rose-text mb-5">
            Cancellation Policy
          </h1>
          <p className="max-w-[680px] text-lg font-light leading-relaxed text-ink/70">
            We reserve appointment time specifically for you. Advance notice helps our team care
            for every client and offer openings to people waiting to visit.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
          <div className="prose prose-lg max-w-none space-y-6 text-ink/70">
            <h2 className="font-medium text-xl text-silver-dark">Current Policy</h2>
            <p>
              Please give at least 48 hours&apos; notice if you need to cancel. Rella may retain the
              applicable booking deposit for cancellations within 48 hours. Emergencies are
              reviewed individually.
            </p>

            <h2 className="font-medium text-xl text-silver-dark mt-8">
              Napa New-Patient Tox Appointments
            </h2>
            <p>{CANCELLATION_POLICY}</p>
            <p>
              A $50 booking deposit is charged when the appointment is confirmed. The
              deposit is separate from per-unit treatment pricing.
            </p>

            <h2 className="font-medium text-xl text-silver-dark mt-8">Need to Make a Change?</h2>
            <p>
              Call Rella at{" "}
              <a href="tel:+17073582928" className="text-rose-text hover:underline">
                707.358.2928
              </a>{" "}
              as soon as possible. For other appointment-specific questions, review the details
              shown during booking or{" "}
              <Link href="/contact" className="text-rose-text hover:underline">
                contact our team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
