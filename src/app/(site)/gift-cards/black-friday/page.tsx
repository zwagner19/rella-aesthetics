import type { Metadata } from "next";
import { BlackFridayLanding } from "@/components/gift-cards/BlackFridayLanding";
import { blackFridayCheckoutMode, blackFridayDeepLink, boulevardWidgetCheckoutEnabled } from "@/lib/gift-cards/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Black Friday Gift Cards",
  description:
    "The Black Friday Event, November 27 – December 1. A $1,000 Rella Gift Card for $800 or a $2,100 Rella Gift Card for $1,600, each with a Rella VIP Guest Pass to share.",
  alternates: { canonical: "/gift-cards/black-friday" },
  robots: { index: false, follow: false },
};

export default async function BlackFridayGiftCardsPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BlackFridayLanding checkout={blackFridayCheckoutMode()} widgetFallback={boulevardWidgetCheckoutEnabled()}
    initialSelection={blackFridayDeepLink(await searchParams)} />;
}
