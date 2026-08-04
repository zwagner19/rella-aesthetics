import type { Metadata } from "next";
import { NapaCampaignLandingPage } from "@/components/pages/NapaCampaignLandingPage";
import { NAPA_CAMPAIGN_SERVICES } from "@/lib/napa-campaign-services";
import "../botox/napa-botox.css";

const service = NAPA_CAMPAIGN_SERVICES.filler;
const canonical = "https://experiencerella.com/napa/filler/";

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical },
  openGraph: {
    title: `${service.metaTitle} | Rella Aesthetics`,
    description: service.metaDescription,
    url: canonical,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function NapaFillerPage() {
  return <NapaCampaignLandingPage service={service} />;
}
