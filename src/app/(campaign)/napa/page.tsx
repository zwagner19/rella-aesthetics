import type { Metadata } from "next";
import { NapaCampaignHub } from "@/components/pages/NapaCampaignLandingPage";
import "./botox/napa-botox.css";

const CANONICAL = "https://experiencerella.com/napa/";

export const metadata: Metadata = {
  title: "Napa Med Spa — Physician-Owned",
  description:
    "Explore physician-owned aesthetic and wellness care at Rella Aesthetics Napa, 1541 3rd St. Direct paths for Botox, filler, laser, HydraFacial, and excessive-sweating care.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Rella Aesthetics — Napa",
    description:
      "Physician-owned aesthetic and wellness care with direct booking paths and current public pricing in downtown Napa.",
    url: CANONICAL,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function NapaCampaignPage() {
  return <NapaCampaignHub />;
}
