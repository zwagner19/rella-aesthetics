import type { Metadata } from "next";
import {
  NapaLocalServicePage,
  napaCanonical,
  type NapaLocalServiceContent,
} from "@/components/pages/NapaLocalServicePage";

// Preserves the live WordPress /napa/filler/ page: title, description, facts,
// prices, and questions as published there on 2026-10-08.
const content: NapaLocalServiceContent = {
  slug: "filler",
  service: "dermal-fillers",
  eyebrow: "Dermal Filler · Napa",
  heading: "Lip & dermal filler in Napa.",
  lede: "Subtle, balanced, personalized — enhancement that still looks like you.",
  image: {
    src: "/images/service-fillers.jpg",
    alt: "A provider administering a lip injectable treatment to a reclining patient",
  },
  schemaName: "Napa Lip & Dermal Filler",
  schemaServiceType: "Dermal filler consultation and treatment",
  cards: [
    {
      title: "Lip filler",
      body: "Natural shapes and proportions, built gradually. Half-syringe options available for a subtle first step.",
    },
    {
      title: "Cheek, jawline & facial balancing",
      body: "Restore volume and structure with a balanced, whole-face approach. Facial balancing consultations map it out before anything is injected.",
    },
    {
      title: "The Rella philosophy",
      body: "Subtle and balanced — never overdone. Numbing cream is included, and every treatment is charted in your medical record by an expert injector.",
    },
  ],
  price: {
    headline: "Fillers from $700/syringe",
    detail: "Half syringe from $600 · Members from $500.",
  },
  faqs: [
    {
      question: "Will it look fake?",
      answer:
        "Not here. Our whole philosophy is subtle and balanced — most people just look rested, not ‘done.’",
    },
    {
      question: "How long does filler last?",
      answer: "Depending on product and area, typically 6–18 months.",
    },
    {
      question: "Does it hurt?",
      answer:
        "Numbing cream is included; most patients find it very tolerable.",
    },
    {
      question: "Can filler be dissolved?",
      answer:
        "Yes — hyaluronic-acid fillers are reversible, which is part of why we like them.",
    },
    {
      question: "How much will I need?",
      answer:
        "Your free consultation determines the plan — often less than you think.",
    },
  ],
  closing: {
    heading: "Still you. Just balanced.",
    body: "Book online in under a minute, or call and we’ll find a time that works.",
  },
  guide: {
    href: "/services/dermal-fillers",
    label: "Read the full dermal filler guide",
  },
  description:
    "Subtle, natural lip and dermal filler from a physician-led team in downtown Napa. Balanced, personalized results that still look like you. Book a free consultation.",
};

export const metadata: Metadata = {
  title: "Lip Filler & Dermal Filler in Napa, CA",
  description: content.description,
  alternates: { canonical: napaCanonical(content.slug) },
  openGraph: {
    title: "Lip & Dermal Filler in Napa | Rella Aesthetics",
    description: content.description,
    url: napaCanonical(content.slug),
    type: "website",
    images: [{ url: content.image.src, alt: content.image.alt }],
  },
};

export default function NapaFillerPage() {
  return <NapaLocalServicePage content={content} />;
}
