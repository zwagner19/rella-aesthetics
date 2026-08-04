import type { Metadata } from "next";
import { NapaCampaignHub } from "@/components/pages/NapaCampaignLandingPage";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";
import "./botox/napa-botox.css";

const CANONICAL = "https://experiencerella.com/napa";

export const metadata: Metadata = {
  title: "Napa Med Spa — Physician-Owned",
  description:
    "Explore physician-owned aesthetic and wellness care at Rella Aesthetics Napa, 1541 3rd St, with direct booking for Botox, filler, laser, HydraFacial, and sweating care.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Rella Aesthetics — Napa",
    description:
      "Physician-owned aesthetic and wellness care with direct booking paths and current public pricing in downtown Napa.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function NapaCampaignPage() {
  return <NapaCampaignHub />;
}
