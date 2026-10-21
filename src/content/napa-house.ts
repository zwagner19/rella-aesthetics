/**
 * Verified Napa House location facts for the PLACE page prototype.
 * Sources: repo `locations.napa`, `content/team`, `service-data.availableLocations`,
 * and read-only live-site audit notes. Do not invent amenities, parking, or hours.
 */
import { locations } from "@/lib/data";

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
  /** Owner-approved hours shared with contact copy and structured data. */
  hours: locations.napa.hours,
} as const;

/**
 * Category education links for Napa-available care.
 * Peels + microneedling remain Vacaville-only in service-data — not claimed here as Napa exclusives.
 */
export const napaHouseCategories = [
  { label: "Injectables", href: "/napa/botox/", ariaLabel: "Injectables: Botox and Dysport in Napa" },
  { label: "Skin", href: "/napa/facials", ariaLabel: "Skin: Facials in Napa" },
  { label: "Lasers", href: "/napa/laser/", ariaLabel: "Lasers: Laser treatments in Napa" },
  { label: "Wellness" },
  { label: "Weight" },
] as const;

/**
 * Owner-approved Napa team preview, using the existing team-directory records.
 * Equal visual weight; no staffing notes.
 */
export const napaHousePeople = [
  {
    name: "Dr. Zachary Wagner",
    role: "Founder · Medical Weight Loss",
    image: "/images/dr-zachary-wagner.jpg",
  },
  {
    name: "Warda Harchaoui",
    role: "PA-C",
    image: "/images/team/warda-harchaoui.jpg",
  },
  {
    name: "Devyn Pickett",
    role: "Aesthetic RN",
    image: "/images/team/devyn.jpg",
  },
  {
    name: "Marisa Avalos",
    role: "Aesthetic RN",
    image: "/images/team/marisa-avalos.jpg",
  },
  {
    name: "Natalie",
    role: "Esthetician",
    image: "/images/team/natalie.jpg",
  },
  {
    name: "Hailey Butler",
    role: "Medical Assistant",
    image: "/images/team/hailey-butler.jpg",
  },
] as const;

/**
 * Photography for Napa House.
 * New interiors are native 680×1020 — do not upscale; cap display for sharpness.
 */
export const napaHouseVisuals = {
  /** Hero / CTA — older reception lounge frame (still highest-res Napa interior on hand). */
  lounge: {
    src: "/images/clinic/napa-reception.jpg",
    alt: "The lounge inside Rella Aesthetics Napa House",
    nativeWidth: 800,
    nativeHeight: 1200,
  },
  /**
   * Arrival dominant — hospitality first (desk + fireplace).
   * Equal native dims to treatment room; chosen for “Come in” atmosphere.
   */
  receptionInterior: {
    src: "/images/clinic/napa-reception-interior.jpg",
    alt: "Reception desk and stone fireplace inside Napa House",
    nativeWidth: 680,
    nativeHeight: 1020,
  },
  /** Arrival supporting — treatment room with chair and devices. */
  treatmentRoom: {
    src: "/images/clinic/napa-treatment-room.jpg",
    alt: "Treatment room with chair and aesthetic devices at Napa House",
    nativeWidth: 680,
    nativeHeight: 1020,
  },
} as const;
