import type { Metadata } from "next";
import { InjectablesCategoryPage } from "@/components/pages/InjectablesCategoryPage";

export const metadata: Metadata = {
  title: "Injectables | Botox, Dysport & Dermal Fillers",
  description:
    "Explore injectable options at Rella Aesthetics by goal — movement lines, volume, lips, and contour — with consultation-led Botox, Dysport, and filler care in Vacaville and Napa.",
  alternates: { canonical: "/services/injectables" },
};

export default function InjectablesCategoryRoute() {
  return <InjectablesCategoryPage />;
}
