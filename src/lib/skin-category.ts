/**
 * Skin category discovery content — verified from service-data (facials,
 * hydrafacial, chemical-peels, microneedling), laser category overlap for
 * pigment/texture, and approved Transform House skin results.
 * Do not invent rankings or concern→treatment promises.
 */

export interface SkinConcern {
  id: string;
  label: string;
  summary: string;
  possibleTreatments: readonly {
    name: string;
    href: string;
  }[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

export interface SkinPath {
  id: string;
  name: string;
  job: string;
  href: string;
}

export interface SkinFaqItem {
  question: string;
  answer: string;
}

export const FACIALS_HREF = "/services/facials";
export const HYDRAFACIAL_HREF = "/services/hydrafacial";
export const PEELS_HREF = "/services/chemical-peels";
export const MICRONEEDLING_HREF = "/services/microneedling";
export const LASERS_CATEGORY_HREF = "/services/lasers";
export const LASERS_DETAIL_HREF = "/services/laser-treatments";

export const SKIN_CONCERNS: readonly SkinConcern[] = [
  {
    id: "texture",
    label: "Texture",
    summary:
      "Uneven texture may be supported with peels, microneedling, or professional facials depending on your skin and recovery window. Deeper texture concerns may also point toward laser resurfacing — reviewed on the Lasers page.",
    possibleTreatments: [
      { name: "Chemical peels", href: PEELS_HREF },
      { name: "Microneedling", href: MICRONEEDLING_HREF },
      { name: "Facials", href: FACIALS_HREF },
      { name: "Lasers", href: LASERS_CATEGORY_HREF },
    ],
    image: "/images/treatments/microneedling-aftercare.webp",
    imageAlt: "A patient checking her skin in a mirror after treatment",
    imagePosition: "object-center",
  },
  {
    id: "hydration-dullness",
    label: "Hydration & dullness",
    summary:
      "HydraFacial and professional facials may be considered when cleansing, exfoliation, and hydration are the priority. Peels may also be discussed for a dull or lackluster complexion after assessment.",
    possibleTreatments: [
      { name: "HydraFacial", href: HYDRAFACIAL_HREF },
      { name: "Facials", href: FACIALS_HREF },
      { name: "Chemical peels", href: PEELS_HREF },
    ],
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "A Rella provider using a facial-treatment handpiece on a patient's cheek",
    imagePosition: "object-center",
  },
  {
    id: "congestion",
    label: "Congestion",
    summary:
      "Congested or dull-looking skin may point toward HydraFacial or a provider-guided facial — with extractions or targeted steps only when included and appropriate for that day.",
    possibleTreatments: [
      { name: "HydraFacial", href: HYDRAFACIAL_HREF },
      { name: "Facials", href: FACIALS_HREF },
    ],
    image: "/images/treatments/facial.webp",
    imageAlt: "A patient receiving red-light therapy during a facial",
    imagePosition: "object-center",
  },
  {
    id: "pigment",
    label: "Pigment",
    summary:
      "Sun damage and uneven tone may be supported with peels when the formulation and recovery fit. Light-based options such as IPL are explored on the Lasers page when pigment is the primary concern.",
    possibleTreatments: [
      { name: "Chemical peels", href: PEELS_HREF },
      { name: "Lasers / IPL", href: LASERS_CATEGORY_HREF },
    ],
    image: "/images/treatments/chemical-peel.webp",
    imageAlt: "A Rella provider applying an in-clinic facial treatment",
    imagePosition: "object-center",
  },
  {
    id: "acne-scarring",
    label: "Acne & scarring",
    summary:
      "The appearance of post-acne marks may be discussed with peels; facial acne scars and deeper texture may point toward microneedling. Laser resurfacing options for acne scars are covered under Lasers.",
    possibleTreatments: [
      { name: "Microneedling", href: MICRONEEDLING_HREF },
      { name: "Chemical peels", href: PEELS_HREF },
      { name: "Lasers", href: LASERS_CATEGORY_HREF },
    ],
    image: "/images/service-microneedling.jpg",
    imageAlt: "Microneedling treatment context at Rella Aesthetics",
    imagePosition: "object-top",
  },
  {
    id: "fine-lines",
    label: "Fine lines",
    summary:
      "Fine lines and early texture changes may be supported with peels or microneedling when appropriate. Resurfacing lasers are another path when recovery and indication fit — see Lasers for those tools.",
    possibleTreatments: [
      { name: "Chemical peels", href: PEELS_HREF },
      { name: "Microneedling", href: MICRONEEDLING_HREF },
      { name: "Lasers", href: LASERS_CATEGORY_HREF },
    ],
    image: "/images/treatments/chemical-peel.webp",
    imageAlt: "A Rella provider applying an in-clinic facial treatment",
    imagePosition: "object-[center_40%]",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    summary:
      "Ongoing skin-care visits — facials or HydraFacial — may support maintenance between other services when timing and skin response allow. Frequency is individualized, not a fixed schedule.",
    possibleTreatments: [
      { name: "Facials", href: FACIALS_HREF },
      { name: "HydraFacial", href: HYDRAFACIAL_HREF },
    ],
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "A Rella provider using a facial-treatment handpiece on a patient's cheek",
    imagePosition: "object-[center_30%]",
  },
] as const;

/** Editorial treatment-path rows — maintenance vs deeper reset framing. */
export const SKIN_PATHS: readonly SkinPath[] = [
  {
    id: "facials",
    name: "Facials",
    job: "Assessment-led skin care for congestion, dullness, sensitivity, and routine maintenance.",
    href: FACIALS_HREF,
  },
  {
    id: "hydrafacial",
    name: "HydraFacial",
    job: "A multi-step cleanse, extract, and hydrate visit — Signature, Deluxe, or Platinum after skin review.",
    href: HYDRAFACIAL_HREF,
  },
  {
    id: "peels",
    name: "Chemical peels",
    job: "Controlled exfoliation for tone, texture, and dullness when recovery fits your calendar.",
    href: PEELS_HREF,
  },
  {
    id: "microneedling",
    name: "Microneedling",
    job: "Controlled microchannels for texture and scar appearance — candidacy and recovery planned first.",
    href: MICRONEEDLING_HREF,
  },
  {
    id: "lasers",
    name: "Lasers & light",
    job: "IPL and resurfacing when pigment or deeper texture needs a light- or energy-based tool.",
    href: LASERS_CATEGORY_HREF,
  },
] as const;

export const SKIN_MAINTENANCE_VS_CORRECTION = {
  eyebrow: "How plans are framed",
  headline: "Maintenance and correction are different jobs.",
  body: "Facials and HydraFacial often support ongoing care and event timing. Peels and microneedling are considered when a more intentional reset fits your skin and recovery. Lasers enter when pigment or deeper texture needs a light- or energy-based option. None of these is ranked “better” — the right path depends on what we see and what you can plan for.",
} as const;

export const SKIN_FAQ: readonly SkinFaqItem[] = [
  {
    question: "Where should I start if I just want better skin?",
    answer:
      "Start with the concern — dullness, congestion, pigment, texture, or maintenance — not the product name. A provider maps what your skin needs today and which visit type fits before you book a series.",
  },
  {
    question: "How is a HydraFacial different from a regular facial?",
    answer:
      "HydraFacial uses a branded handpiece and solutions in a defined cleanse, exfoliate, extract, and hydrate process. Other facials may use different products and techniques; your provider can compare the exact options available at Rella.",
  },
  {
    question: "Do peels and microneedling always mean downtime?",
    answer:
      "Recovery varies by product, depth, device, and your skin response. Temporary redness, sensitivity, flaking, or peeling can occur. Expectations are reviewed before treatment — not after.",
  },
  {
    question: "When should I look at lasers instead of facials or peels?",
    answer:
      "When pigment, redness, or deeper texture may need light- or energy-based care, lasers become part of the conversation. Explore those options on the Lasers page, then confirm suitability in consult.",
  },
  {
    question: "Can I combine skin treatments?",
    answer:
      "Possibly, but order and spacing depend on the exact products and procedures. Your provider should review any combination before it is scheduled.",
  },
] as const;
