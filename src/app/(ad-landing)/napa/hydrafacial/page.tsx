import type { Metadata } from "next";
import {
  NapaLocalServicePage,
  napaCanonical,
  type NapaLocalServiceContent,
} from "@/components/pages/NapaLocalServicePage";

// Preserves the live WordPress /napa/hydrafacial/ page: title, description, facts,
// prices, and questions as published there on 2026-10-08.
const content: NapaLocalServiceContent = {
  slug: "hydrafacial",
  service: "hydrafacial",
  eyebrow: "HydraFacial · Napa",
  heading: "HydraFacial in Napa.",
  lede: "The instant-glow, zero-downtime facial — steps from downtown Napa.",
  image: {
    src: "/images/service-hydrafacial.jpg",
    alt: "A handheld facial-treatment device applied near a patient's cheek",
  },
  schemaName: "Napa HydraFacial",
  schemaServiceType: "HydraFacial treatment",
  cards: [
    {
      title: "What it does",
      body: "Cleanse, extract, and hydrate in one ~45-minute medical-grade treatment. Walk out glowing — zero downtime.",
    },
    {
      title: "Visiting Napa?",
      body: "Get event-ready before the tasting, the wedding, or the weekend. Same-week appointments available.",
    },
    {
      title: "Love your glow?",
      body: "Ask about laser + skincare plans and Rella memberships at your visit.",
    },
  ],
  price: {
    headline: "New patients: $50 off the Deluxe HydraFacial",
    detail: "Book online and mention the new-patient offer at check-in.",
  },
  faqs: [
    {
      question: "Does it hurt?",
      answer: "No — most people find it genuinely relaxing.",
    },
    {
      question: "How long do results last?",
      answer:
        "The glow peaks for about a week; monthly treatments keep skin consistently clear and hydrated.",
    },
    {
      question: "How often should I come?",
      answer: "Monthly is ideal for maintained results.",
    },
    {
      question: "What add-ons are available?",
      answer: "Ask about boosters and targeted perks at booking.",
    },
  ],
  closing: {
    heading: "Glow now. Zero downtime.",
    body: "Book online in under a minute, or call and we’ll find a time that works.",
  },
  guide: {
    href: "/services/hydrafacial",
    label: "Read the full HydraFacial guide",
  },
  description:
    "The signature HydraFacial steps from downtown Napa at 1541 3rd St. Deep cleanse, exfoliation and hydration with zero downtime. Book your HydraFacial today.",
};

export const metadata: Metadata = {
  title: "HydraFacial in Napa, CA | Instant Glow, No Downtime",
  description: content.description,
  alternates: { canonical: napaCanonical(content.slug) },
  openGraph: {
    title: "HydraFacial in Napa | Rella Aesthetics",
    description: content.description,
    url: napaCanonical(content.slug),
    type: "website",
    images: [{ url: content.image.src, alt: content.image.alt }],
  },
};

export default function NapaHydrafacialPage() {
  return <NapaLocalServicePage content={content} />;
}
