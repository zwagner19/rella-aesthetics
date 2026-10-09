import type { Metadata } from "next";
import {
  NapaLocalServicePage,
  napaCanonical,
  type NapaLocalServiceContent,
} from "@/components/pages/NapaLocalServicePage";

// Preserves the live WordPress /napa/hyperhidrosis/ page: title, description, facts,
// and questions as published there on 2026-10-08. Prices follow the
// Rella pricing canon used on the Vacaville pages (decided 2026-10-09).
const content: NapaLocalServiceContent = {
  slug: "hyperhidrosis",
  service: "hyperhidrosis",
  eyebrow: "Hyperhidrosis · Napa",
  heading: "Excessive sweating treatment in Napa.",
  lede: "One quick office visit can reduce underarm sweating for months. Discreet, judgment-free, physician-owned care.",
  image: {
    src: "/images/service-botox.jpg",
    alt: "A provider administering an injectable treatment to a patient's forehead",
  },
  schemaName: "Napa Hyperhidrosis Treatment",
  schemaServiceType: "Underarm hyperhidrosis treatment",
  cards: [
    {
      title: "How it works",
      body: "Botox blocks the signal to overactive sweat glands — an established, FDA-approved medical use. Results are typically noticeable within about a week and commonly last several months.",
    },
    {
      title: "What treatment looks like",
      body: "A private consultation, then a quick series of small injections in the underarm. About 30 minutes total, then back to your day.",
    },
    {
      title: "Who it’s for",
      body: "Adults whose underarm sweating interferes with daily life despite clinical antiperspirants. A free, private consultation determines whether treatment is right for you.",
    },
  ],
  price: {
    headline: "Botox $18/unit · Members $13/unit",
    detail: "Free private consultation first — always.",
  },
  faqs: [
    {
      question: "How long does it last?",
      answer:
        "Commonly several months per treatment; many patients treat about twice a year.",
    },
    {
      question: "Does it hurt?",
      answer:
        "The injections are quick and shallow; most patients are surprised how easy it is.",
    },
    {
      question: "Is it covered by insurance?",
      answer: "We’re a cash-pay practice — payment plans are available.",
    },
    {
      question: "Is it safe?",
      answer:
        "It’s an established medical use of Botox. Your provider reviews everything at your consult.",
    },
  ],
  closing: {
    heading: "Meetings, workouts, wine country — without the second shirt.",
    body: "Book online in under a minute, or call and we’ll find a time that works.",
  },
  guide: {
    href: "/services/botox",
    label: "Read the full Botox guide",
  },
  description:
    "One quick office visit can reduce underarm sweating for months. Discreet, judgment-free, physician-owned care.",
};

export const metadata: Metadata = {
  title: "Excessive Sweating Treatment in Napa",
  description: content.description,
  alternates: { canonical: napaCanonical(content.slug) },
  openGraph: {
    title: "Excessive Sweating Treatment in Napa | Rella Aesthetics",
    description: content.description,
    url: napaCanonical(content.slug),
    type: "website",
    images: [{ url: content.image.src, alt: content.image.alt }],
  },
};

export default function NapaHyperhidrosisPage() {
  return <NapaLocalServicePage content={content} />;
}
