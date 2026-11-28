import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import { NapaHousePage } from "@/components/location/NapaHousePage";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";

const defaultMetadata: Metadata = {
  title: "Napa House Med Spa | Downtown Napa",
  description:
    "Visit Rella Aesthetics Napa House at 1541 3rd St in downtown Napa — consultation-led aesthetics, wellness, and hospitality-first care.",
  alternates: { canonical: "/locations/napa" },
  openGraph: {
    title: "Napa House | Rella Aesthetics",
    description:
      "A calm downtown house for consultation-led aesthetics and wellness in Napa, California.",
    url: "/locations/napa",
    images: [
      {
        url: "/images/clinic/napa-reception.jpg",
        alt: "The welcoming reception area inside Rella Aesthetics Napa House",
      },
    ],
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
      <NapaHousePage />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/locations/napa", defaultMetadata);
}
