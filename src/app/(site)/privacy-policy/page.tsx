import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Rella Aesthetics privacy policy — how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
        <h1 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase text-rose-text mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-lg text-ink/70 max-w-none space-y-6">
          <p>
            <strong className="text-ink">Last Updated:</strong> April 2026
          </p>
          <p>
            Rella Aesthetics (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is
            committed to protecting the personal information you share with us. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our
            website or use our services.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide when you book an
            appointment, submit a contact form, sign up for our newsletter, or interact with our
            website. This may include your name, email address, phone number, and service interests.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">How We Use Your Information</h2>
          <p>
            We use the information we collect to schedule appointments, respond to inquiries,
            improve our services, send relevant communications, and comply with legal obligations.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Third-Party Services</h2>
          <p>
            We may use third-party services such as Boulevard (booking), GoHighLevel (CRM), and
            analytics providers. These services have their own privacy policies governing the use of
            your information.
          </p>

          <h2 className="font-medium text-xl text-ink mt-8">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:info@experiencerella.com" className="text-rose-text hover:underline">
              info@experiencerella.com
            </a>{" "}
            or call <a href="tel:+17073582928" className="text-rose-text hover:underline">707.358.2928</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
