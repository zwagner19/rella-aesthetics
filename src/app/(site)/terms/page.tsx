import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Rella Aesthetics website and services.",
};

export default function TermsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
        <h1 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase text-rose-text mb-8">
          Terms &amp; Conditions
        </h1>
        <div className="prose prose-lg text-silver max-w-none space-y-6">
          <p>
            <strong className="text-silver-dark">Last Updated:</strong> April 2026
          </p>
          <p>
            By accessing and using the Rella Aesthetics website, you agree to be bound by these
            Terms and Conditions. If you do not agree, please do not use our website.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Use of Website</h2>
          <p>
            This website is provided for informational purposes and to facilitate appointment
            scheduling. Content on this site does not constitute medical advice. Always consult with
            a qualified healthcare provider for medical decisions.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Appointment Policy</h2>
          <p>
            Appointments booked through our website are subject to confirmation. We require 24 hours&apos;
            notice for cancellations. Late cancellations or no-shows may be subject to a fee.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, and design — is the
            property of Rella Aesthetics and may not be reproduced without written permission.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:hello@experiencerella.com" className="text-rose-text hover:underline">
              hello@experiencerella.com
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
