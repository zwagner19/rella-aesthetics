import type { Metadata } from "next";
import { LocationServicePage } from "@/components/pages/LocationServicePage";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Vacaville Med Spa",
  description:
    "Physician-owned med spa in downtown Vacaville at 542 Main St. Explore Botox, fillers, laser treatments, skin care, and medical weight management.",
  alternates: { canonical: "/locations/vacaville" },
  openGraph: {
    title: "Vacaville Med Spa | Rella Aesthetics",
    description: "Physician-owned aesthetic and wellness care in downtown Vacaville, California.",
    url: "/locations/vacaville",
  },
};

const loc = locations.vacaville;

export default function VacavillePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(loc)).replace(/</g, "\\u003c"),
        }}
      />
      <LocationServicePage location={loc} slug="vacaville" />
    </>
  );
}
