/**
 * Verified Napa House location facts for the PLACE page prototype.
 * Sources: repo `locations.napa`, `content/team`, `service-data.availableLocations`,
 * and read-only live-site audit notes. Do not invent amenities, parking, or hours.
 */

export const napaHouseIdentity = {
  brand: "Rella Aesthetics",
  placeName: "Napa House",
  cityLine: "Downtown Napa",
} as const;

/** Address / phone / map — consistent across repo + live site. */
export const napaHousePractical = {
  addressLine: "1541 3rd St",
  cityStateZip: "Napa, CA 94559",
  phoneDisplay: "707.358.2928",
  phoneTel: "+17073582928",
  mapUrl: "https://maps.google.com/?q=1541+3rd+St+Napa+CA+94559",
  googleReviewUrl: "https://g.page/r/CcUDgqqvRr8MEBM/review",
  /**
   * Hours from repo `locations.napa` (what this Next app already publishes).
   * Live WordPress Napa pages also publish Wed–Sat / conflicting schema — flagged in report.
   */
  hours: [
    "Monday–Friday: 9am–5pm",
    "Saturday: 9am–1pm",
    "Sunday: Closed",
  ],
} as const;

/**
 * Categories / services available at Napa House.
 * Excludes `chemical-peels` and `microneedling` (repo: Vacaville-only).
 * Links point to education pages — not Napa campaign LPs.
 */
/** Titles only — education copy lives on treatment pages. */
export const napaHouseOfferings = [
  {
    slug: "botox",
    title: "Botox & Dysport",
    category: "Injectables",
    href: "/services/botox",
  },
  {
    slug: "dermal-fillers",
    title: "Dermal Fillers",
    category: "Injectables",
    href: "/services/dermal-fillers",
  },
  {
    slug: "facials",
    title: "Facials",
    category: "Skin",
    href: "/services/facials",
  },
  {
    slug: "hydrafacial",
    title: "HydraFacial",
    category: "Skin",
    href: "/services/hydrafacial",
  },
  {
    slug: "laser-treatments",
    title: "Laser Treatments",
    category: "Devices",
    href: "/services/laser-treatments",
  },
  {
    slug: "iv-hydration",
    title: "IV Hydration",
    category: "Wellness",
    href: "/services/iv-hydration",
  },
  {
    slug: "weight-loss",
    title: "Medical Weight Loss",
    category: "Wellness",
    href: "/services/weight-loss",
  },
] as const;

/**
 * People who work at Napa House per `content/team` location fields.
 * Primary Napa roster mirrors the team page Napa directory.
 */
export const napaHousePeople = [
  {
    name: "Dr. Zachary Wagner",
    role: "Founder · Medical Weight Loss",
    image: "/images/dr-zachary-wagner.jpg",
    presence: "both" as const,
  },
  {
    name: "Devyn Pickett",
    role: "Aesthetic RN",
    image: "/images/team/devyn.jpg",
    presence: "primary" as const,
  },
  {
    name: "Marisa Avalos",
    role: "Aesthetic RN",
    image: "/images/team/marisa-avalos.jpg",
    presence: "primary" as const,
  },
  {
    name: "Natalie",
    role: "Esthetician",
    image: "/images/team/natalie.jpg",
    presence: "primary" as const,
  },
  {
    name: "Hailey Butler",
    role: "Medical Assistant",
    image: "/images/team/hailey-butler.jpg",
    presence: "primary" as const,
  },
  {
    name: "Ayano",
    role: "Front Desk",
    image: "/images/team/ayano.jpg",
    presence: "primary" as const,
  },
  {
    name: "Warda Harchaoui",
    role: "PA-C · Also serves Napa",
    image: "/images/team/warda-harchaoui.jpg",
    presence: "also" as const,
  },
] as const;

export const napaHouseVisuals = {
  reception: {
    src: "/images/clinic/napa-reception.jpg",
    alt: "The welcoming reception area inside Rella Aesthetics Napa House",
    nativeWidth: 800,
    nativeHeight: 1200,
  },
  teamStorefront: {
    src: "/images/clinic/rella-team-storefront.webp",
    alt: "Rella Aesthetics team gathered outside the Napa clinic",
    nativeWidth: 1600,
    nativeHeight: 900,
  },
  sidewalkSign: {
    src: "/images/clinic/rella-sidewalk-sign.webp",
    alt: "A Rella Aesthetics sidewalk sign welcoming patients outside the clinic",
    nativeWidth: 960,
    nativeHeight: 1200,
    /** Location of this frame is not labeled in-repo; use sparingly and flag. */
    locationCertainty: "unverified" as const,
  },
} as const;
