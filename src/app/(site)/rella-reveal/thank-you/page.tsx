import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  getRevealInterestOption,
  isRevealInterestId,
  resolveRevealInterestBookingHref,
  REVEAL_OFFER_DETAIL,
} from "@/lib/reveal-popup";

export const metadata: Metadata = {
  title: "Your Rella Reveal",
  description: "Your personalized Rella Skin & Confidence Plan is on its way.",
  robots: { index: false, follow: false },
};

interface ThankYouPageProps {
  searchParams: Promise<{ interest?: string }>;
}

export default async function RellaRevealThankYouPage({ searchParams }: ThankYouPageProps) {
  const { interest: interestParam } = await searchParams;
  if (!interestParam || !isRevealInterestId(interestParam)) notFound();

  const interest = getRevealInterestOption(interestParam);
  const bookingHref = resolveRevealInterestBookingHref(interestParam);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[640px] px-6 md:px-8 lg:px-12 text-center">
        <p className="text-eyebrow mb-4">Rella Reveal</p>
        <h1 className="text-display text-3xl md:text-4xl mb-4">Check your inbox</h1>
        <p className="text-silver leading-relaxed mb-4">
          We&apos;re sending your personalized skin &amp; confidence plan for{" "}
          <span className="text-ink">{interest.serviceLabel.toLowerCase()}</span>, plus your $50
          treatment credit details.
        </p>
        <p className="text-sm text-silver mb-10">{REVEAL_OFFER_DETAIL}</p>

        <Button href={bookingHref} className="w-full sm:w-auto">
          Book Now
        </Button>

        <p className="mt-8 text-sm text-silver">
          Prefer to talk first?{" "}
          <Link href="/contact" className="text-rose-text underline underline-offset-2 hover:text-ink">
            Contact our team
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
