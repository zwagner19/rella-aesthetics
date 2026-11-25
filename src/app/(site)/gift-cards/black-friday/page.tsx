import type { Metadata } from "next";
import { BlackFridayLanding } from "@/components/gift-cards/BlackFridayLanding";
import { blackFridayCheckoutMode, boulevardWidgetCheckoutEnabled } from "@/lib/gift-cards/config";

export const metadata: Metadata = {
  title: "Black Friday Gift Cards",
  description:
    "The Black Friday Event, November 27 – December 1. A $1,000 Rella Gift Card for $800 or a $2,100 Rella Gift Card for $1,600, each with a Rella VIP Guest Pass to share.",
  alternates: { canonical: "/gift-cards/black-friday" },
  // Not indexed until the owner approves the offer terms and opens checkout.
  robots: { index: false, follow: true },
};

export default function BlackFridayGiftCardsPage() {
  return <BlackFridayLanding checkout={blackFridayCheckoutMode()} widgetFallback={boulevardWidgetCheckoutEnabled()} />;
}
