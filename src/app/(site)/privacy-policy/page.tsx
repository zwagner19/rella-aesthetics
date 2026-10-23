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
        <div className="prose prose-lg text-silver max-w-none space-y-6">
          <p>
            <strong className="text-silver-dark">Last Updated:</strong> October 22, 2026
          </p>
          <p>
            Rella Aesthetics (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is
            committed to protecting the personal information you share with us. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our
            website or use our services.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide when you book an
            appointment, submit a contact form, sign up for our newsletter, or interact with our
            website. This may include your name, email address, phone number, and service interests.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">How We Use Your Information</h2>
          <p>
            We use the information we collect to schedule appointments, respond to inquiries,
            improve our services, send relevant communications, and comply with legal obligations.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Third-Party Services</h2>
          <p>
            We may use third-party services such as Boulevard (booking), GoHighLevel (CRM), and
            analytics providers. These services have their own privacy policies governing the use of
            your information.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Cookies and Measurement</h2>
          <p>
            Rella asks before measuring how you found our website and whether your visit leads to a
            confirmed appointment. If you accept, our first-party booking system saves a limited source
            category, such as search, social media, email, or a referral. We do not send full referring
            URLs, search terms, freeform campaign text, your name, email address, phone number, or
            treatment details in this measurement request.
          </p>
          <p>
            If you accept, Google Analytics also counts visits, sessions, and views of general page
            groups, such as our homepage or a clinic page. It runs in a separate, invisible document
            that cannot read our booking or contact forms. Google receives general page labels and
            limited traffic-source categories, along with its browser and session identifiers and
            standard connection information. We do not send treatment-specific page addresses,
            search text, booking details, contact information, or payment information to this visitor
            analytics service. Its cookies last up to 30 days; advertising signals and personalization
            are disabled for this collection.
          </p>
          <p>
            For Google ad visits, one approved click identifier may also be stored in encrypted form.
            An eligible confirmed booking may be reported to Google using that identifier, a generic
            booking timestamp, and an opaque conversion reference. Patient contact information,
            treatment details, and payment information are not included in that export.
          </p>
          <p>
            A first-party cookie records your choice for up to 30 days. An opaque first-party handle
            supports withdrawal without placing the ad click identifier in a cookie or booking link.
            If you decline or later turn cookies off, Rella does not capture a new traffic source or ad
            click identifier and asks the booking system to revoke the measurement covered by that
            choice. Visitor analytics stops and its cookies are cleared. Your ability to
            view the page, request care, and book an appointment does not depend on accepting.
          </p>

          <h2 className="font-medium text-xl text-silver-dark mt-8">Contact Us</h2>
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
