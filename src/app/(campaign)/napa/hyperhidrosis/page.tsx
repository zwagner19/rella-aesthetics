import type { Metadata } from "next";
import { NapaCampaignLandingPage } from "@/components/pages/NapaCampaignLandingPage";
import { NAPA_CAMPAIGN_SERVICES } from "@/lib/napa-campaign-services";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";
import "../botox/napa-botox.css";

const service = NAPA_CAMPAIGN_SERVICES.hyperhidrosis;
const canonical = "https://experiencerella.com/napa/hyperhidrosis";

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical },
  openGraph: {
    title: `${service.metaTitle} | Rella Aesthetics`,
    description: service.metaDescription,
    url: canonical,
    type: "website",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function NapaHyperhidrosisPage() {
  return <NapaCampaignLandingPage service={service} />;
}
