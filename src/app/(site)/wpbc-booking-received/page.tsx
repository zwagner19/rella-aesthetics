import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmation Help",
  description:
    "Help for visitors returning to a legacy Rella Aesthetics booking confirmation address.",
  alternates: { canonical: "/wpbc-booking-received" },
  robots: { index: false, follow: true },
};

export default function LegacyBookingConfirmationPage() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[760px] px-6 md:px-8">
        <p className="mb-4 text-sm font-medium italic text-ink">Booking help</p>
        <h1 className="text-4xl font-bold uppercase leading-[1.08] tracking-[0.06em] text-ink md:text-5xl">
          Need help with an earlier booking request?
        </h1>
        <p className="mt-7 text-lg leading-relaxed text-ink/75">
          This address belonged to Rella&apos;s previous booking system. Check the email or text
          message sent when you booked for the current appointment details. If you cannot find a
          confirmation, contact the Rella team before submitting another request.
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <a
            href="tel:+17073582928"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-bold text-white"
          >
            Call 707.358.2928
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-6 py-3 text-sm font-bold text-ink"
          >
            Contact Rella
          </Link>
        </div>
      </div>
    </section>
  );
}
