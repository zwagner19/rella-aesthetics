import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Rella Aesthetics website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
        <h1 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase text-rose-text mb-8">
          Terms &amp; Conditions
        </h1>
        <div className="prose prose-lg text-ink/70 max-w-none space-y-6">
          <p>
            <strong className="text-ink">Last Updated:</strong> April 2026
          </p>
          <p>
            By accessing and using the Rella Aesthetics website, you agree to be bound by these
            Terms and Conditions. If you do not agree, please do not use our website.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Use of Website</h2>
          <p>
            This website is provided for informational purposes and to facilitate appointment
            scheduling. Content on this site does not constitute medical advice. Always consult with
            a qualified healthcare provider for medical decisions.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Appointment Policy</h2>
          <p>
            Appointments booked through our website are subject to confirmation. Deposit and
            appointment-specific terms are shown during booking or in an applicable agreement.
            Please review our current{" "}
            <Link href="/cancellation-policy" className="text-rose-text hover:underline">
              Cancellation Policy
            </Link>{" "}
            before confirming your appointment.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, and design — is the
            property of Rella Aesthetics and may not be reproduced without written permission.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:info@experiencerella.com" className="text-rose-text hover:underline">
              info@experiencerella.com
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
