import type { Metadata } from "next";
import { LocationServicePage } from "@/components/pages/LocationServicePage";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";

export const metadata: Metadata = {
  title: "Napa Med Spa",
  description:
    "Physician-owned med spa in downtown Napa at 1541 3rd St. Explore Botox, fillers, laser treatments, skin care, and medical weight management.",
  alternates: { canonical: "/locations/napa" },
  openGraph: {
    title: "Napa Med Spa | Rella Aesthetics",
    description: "Physician-owned aesthetic and wellness care in downtown Napa, California.",
    url: "/locations/napa",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const loc = locations.napa;

export default function NapaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema(loc)).replace(/</g, "\\u003c"),
        }}
      />
      <LocationServicePage location={loc} slug="napa" />
    </>
  );
}
