import type { Metadata } from "next";
import {
  NapaLocalServicePage,
  napaCanonical,
  type NapaLocalServiceContent,
} from "@/components/pages/NapaLocalServicePage";

// Preserves the live WordPress /napa/laser/ page: title, description, facts,
// prices, and questions as published there on 2026-10-08.
const content: NapaLocalServiceContent = {
  slug: "laser",
  service: "laser",
  eyebrow: "Laser & Pigmentation · Napa",
  heading: "Laser skin treatments in Napa.",
  lede: "Sun damage, pigment, redness, texture, fine lines — the right laser starts with the right diagnosis.",
  image: {
    src: "/images/service-laser.jpg",
    alt: "A provider performing a device-based facial treatment for a reclining patient",
  },
  schemaName: "Napa Laser Skin Treatments",
  schemaServiceType: "IPL photofacial and CO2 laser resurfacing",
  cards: [
    {
      title: "Sun spots & pigmentation",
      body: "Napa sun is real. IPL/photofacial targets brown spots and uneven tone with minimal downtime — spots typically darken, then flake away over days.",
    },
    {
      title: "CoolPeel & CO2 resurfacing",
      body: "For deeper texture, fine lines, and acne scars. Expect several days of redness and peeling — we plan treatment timing around your calendar and summer sun exposure.",
    },
    {
      title: "Which laser is right for me?",
      body: "It depends on your skin tone, goals, and downtime tolerance. That’s why every laser plan starts with a free consultation with our medical team.",
    },
  ],
  price: {
    headline: "CoolPeel from $700 · CO2 from $800",
    detail: "Exact plan and pricing confirmed at your free skin consultation.",
  },
  faqs: [
    {
      question: "How many sessions will I need?",
      answer:
        "IPL usually takes a short series; resurfacing is often a single treatment. Your consult maps the exact plan.",
    },
    {
      question: "Can I do laser in summer?",
      answer:
        "Yes, with proper planning and SPF discipline — some treatments we deliberately schedule around sun exposure.",
    },
    {
      question: "Does it hurt?",
      answer:
        "Most treatments feel like quick snaps of heat; numbing and cooling keep it very manageable.",
    },
    {
      question: "What does it cost?",
      answer:
        "CoolPeel from ~$700 and CO2 resurfacing from ~$800; your exact quote comes with your free consult.",
    },
  ],
  closing: {
    heading: "Undo a little sun. Keep the glow.",
    body: "Book online in under a minute, or call and we’ll find a time that works.",
  },
  guide: {
    href: "/services/lasers",
    label: "Compare Rella laser options",
  },
  description:
    "CO2 laser resurfacing and IPL photofacials in downtown Napa for sun damage, pigment, redness, texture and fine lines. Free consultation at Rella Aesthetics.",
};

export const metadata: Metadata = {
  title: "CO2 & IPL Laser Skin Treatments in Napa, CA",
  description: content.description,
  alternates: { canonical: napaCanonical(content.slug) },
  openGraph: {
    title: "Laser Skin Treatments in Napa | Rella Aesthetics",
    description: content.description,
    url: napaCanonical(content.slug),
    type: "website",
    images: [{ url: content.image.src, alt: content.image.alt }],
  },
};

export default function NapaLaserPage() {
  return <NapaLocalServicePage content={content} />;
}
