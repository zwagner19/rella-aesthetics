import type { Metadata } from "next";
import { LocationServicePage } from "@/components/pages/LocationServicePage";
import { locations } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schemas";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/social-card";

export const metadata: Metadata = {
  title: "Rella Aesthetics Napa | Hours, Address & Booking",
  description:
    "Find Rella Aesthetics Napa at 1541 3rd St. View Tuesday–Saturday hours, directions, phone, service guides, and city-pinned booking.",
  alternates: { canonical: "/locations/napa" },
  openGraph: {
    title: "Rella Aesthetics Napa | Hours, Address & Booking",
    description: "Clinic details, directions, hours, and booking for Rella Aesthetics in downtown Napa.",
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
