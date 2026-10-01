/**
 * Lasers category discovery content — verified from service-data, Vacaville laser LP,
 * live experiencerella.com /laser-treatments/ and /napa/laser/, and public pricing canon.
 * Do not invent modality→concern mappings or downtime rankings beyond these sources.
 */

export interface LasersConcern {
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

export interface LasersTool {
  id: string;
  name: string;
  job: string;
  href: string;
}

export interface LasersFaqItem {
  question: string;
  answer: string;
}

/** Single treatment-detail route for laser modalities today. */
export const LASERS_DETAIL_HREF = "/services/laser-treatments";

export const LASERS_CONCERNS: readonly LasersConcern[] = [
  {
    id: "pigment",
    label: "Sun damage & brown spots",
    summary:
      "IPL photofacials are used for sun damage, brown spots, and uneven tone after an individual assessment.",
    possibleTreatments: [{ name: "IPL", href: LASERS_DETAIL_HREF }],
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "A Rella provider performing a device-based skin treatment",
    imagePosition: "object-center",
  },
  {
    id: "redness",
    label: "Redness",
    summary:
      "IPL is also used when redness is part of the concern — suitability still depends on skin type, history, and the exact indication.",
    possibleTreatments: [{ name: "IPL", href: LASERS_DETAIL_HREF }],
    image: "/images/service-laser.jpg",
    imageAlt: "Laser treatment context at Rella Aesthetics",
    imagePosition: "object-top",
  },
  {
    id: "hair",
    label: "Unwanted hair",
    summary:
      "Laser hair removal is offered for small, medium, and large body and facial areas as part of a consultation-led plan.",
    possibleTreatments: [
      { name: "Laser hair removal", href: LASERS_DETAIL_HREF },
    ],
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "A Rella provider performing a device-based skin treatment",
    imagePosition: "object-[center_30%]",
  },
  {
    id: "veins",
    label: "Spider veins",
    summary:
      "Spider veins and broken capillaries may be addressed with laser or IPL therapy after the area and vessel pattern are reviewed.",
    possibleTreatments: [
      { name: "Spider-vein treatment", href: LASERS_DETAIL_HREF },
    ],
    image: "/images/service-laser.jpg",
    imageAlt: "Laser treatment context at Rella Aesthetics",
    imagePosition: "object-center",
  },
  {
    id: "texture",
    label: "Texture, fine lines & acne scars",
    summary:
      "Erbium resurfacing and CO2 CoolPeel are resurfacing tools considered for deeper texture, fine lines, and acne-scar concerns — with recovery planned around your calendar.",
    possibleTreatments: [
      { name: "Erbium resurfacing", href: LASERS_DETAIL_HREF },
      { name: "CO2 CoolPeel", href: LASERS_DETAIL_HREF },
    ],
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "A Rella provider performing a device-based skin treatment",
    imagePosition: "object-[center_70%]",
  },
] as const;

export const LASERS_TOOLS: readonly LasersTool[] = [
  {
    id: "ipl",
    name: "IPL",
    job: "Light-based care for pigmentation, sun damage, and redness when appropriate for your skin.",
    href: LASERS_DETAIL_HREF,
  },
  {
    id: "coolpeel",
    name: "CO2 CoolPeel",
    job: "Resurfacing for texture and fine-line concerns, planned with recovery and sun exposure in mind.",
    href: LASERS_DETAIL_HREF,
  },
  {
    id: "co2",
    name: "CO2 resurfacing",
    job: "Deeper resurfacing discussed when texture or scarring needs more than a light-based option.",
    href: LASERS_DETAIL_HREF,
  },
  {
    id: "erbium",
    name: "Erbium",
    job: "Laser skin resurfacing used for texture, tone, fine lines, sun damage, and acne scars after assessment.",
    href: LASERS_DETAIL_HREF,
  },
  {
    id: "lhr",
    name: "Laser hair removal",
    job: "Long-term hair reduction planned by treatment area — small, medium, or large.",
    href: LASERS_DETAIL_HREF,
  },
] as const;

/**
 * Downtime copy stays qualitative — no invented day counts or modality rankings.
 * Sources: live FAQ, Napa laser LP, service-data laser body.
 */
export const LASERS_DOWNTIME = {
  eyebrow: "Recovery",
  headline: "Downtime depends on the tool — not a single answer.",
  body: "Recovery varies by treatment and intensity. Light-based options such as IPL are often described with minimal downtime; resurfacing such as CoolPeel or CO2 can mean several days of redness and peeling. Your consult sets realistic expectations and written aftercare before you book.",
} as const;

export const LASERS_FAQ: readonly LasersFaqItem[] = [
  {
    question: "Which laser is right for me?",
    answer:
      "It depends on your skin tone, goals, and downtime tolerance. Every laser plan at Rella starts with a consultation so the team can match the concern to an appropriate modality — not the other way around.",
  },
  {
    question: "Do I need a consultation before laser treatment?",
    answer:
      "Yes for light- and laser-based care. Vacaville's online laser menu currently lists an Initial Laser Consult before IPL; the consult reviews suitability, concerns, and the available treatment path before a procedure is selected.",
  },
  {
    question: "How many sessions will I need?",
    answer:
      "The number and spacing of procedures depend on the modality, indication, treatment area, settings, individual response, and goals. IPL often involves a short series; resurfacing is often planned as a single treatment. Your provider explains the proposed plan without promising a fixed series or result.",
  },
  {
    question: "What downtime should I expect?",
    answer:
      "Downtime varies by treatment and intensity. We provide written aftercare and realistic expectations before you book — including sun guidance when it matters for healing.",
  },
  {
    question: "Can laser treatments be done on all skin types?",
    answer:
      "Safety and suitability depend on the device, wavelength, settings, treatment goal, and your skin type. A consultation is required to identify the appropriate option.",
  },
] as const;
