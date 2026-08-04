import type { Metadata } from "next";
import { NapaCampaignHub } from "@/components/pages/NapaCampaignLandingPage";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";
import "./botox/napa-botox.css";

const CANONICAL = "https://experiencerella.com/napa";

export const metadata: Metadata = {
  title: "Napa Med Spa Services",
  description:
    "Explore physician-owned aesthetic and wellness care at Rella Aesthetics Napa, with focused paths for Botox, filler, laser, facials, HydraFacial, and sweating care.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Napa Med Spa Services | Rella Aesthetics",
    description:
      "Physician-owned aesthetic and wellness care with focused local service and booking paths in downtown Napa.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function NapaCampaignPage() {
  return <NapaCampaignHub />;
}
