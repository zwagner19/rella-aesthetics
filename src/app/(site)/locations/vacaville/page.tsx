import type { Metadata } from "next";
import { LocationServicePage } from "@/components/pages/LocationServicePage";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";

export const metadata: Metadata = {
  title: "Vacaville Med Spa",
  description:
    "Med spa in downtown Vacaville at 542 Main St. Explore Botox, fillers, laser treatments, skin care, and medical weight management.",
  alternates: { canonical: "/locations/vacaville" },
  openGraph: {
    title: "Vacaville Med Spa | Rella Aesthetics",
    description: "Aesthetic and wellness care in downtown Vacaville, California.",
    url: "/locations/vacaville",
    images: [DEFAULT_SOCIAL_IMAGE],
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
