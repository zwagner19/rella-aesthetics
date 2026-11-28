import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import { SkinCategoryPage } from "@/components/pages/SkinCategoryPage";

const defaultMetadata: Metadata = {
  title: "Skin | Facials, HydraFacial, Peels & Microneedling",
  description:
    "Explore skin-care options at Rella Aesthetics by concern — texture, hydration, congestion, pigment, and maintenance — with facials, HydraFacial, peels, and microneedling in Vacaville and Napa.",
  alternates: { canonical: "/services/skin" },
};

export default function SkinCategoryRoute() {
  return <SkinCategoryPage />;
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/services/skin", defaultMetadata);
}
