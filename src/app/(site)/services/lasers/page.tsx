import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import { LasersCategoryPage } from "@/components/pages/LasersCategoryPage";

const defaultMetadata: Metadata = {
  title: "Lasers | Skin Concerns & Light-Based Treatments",
  description:
    "Explore laser and light-based options at Rella Aesthetics by concern — IPL, CoolPeel, Erbium, and laser hair removal — starting with your skin in Vacaville and Napa.",
  alternates: { canonical: "/services/lasers" },
};

export default function LasersCategoryRoute() {
  return <LasersCategoryPage />;
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/services/lasers", defaultMetadata);
}
