export const HOME_LOCATION_VISUALS = [
  {
    slug: "napa",
    name: "Napa",
    address: "1541 3rd St",
    image: "/images/clinic/napa-reception.webp",
    imageAlt: "The welcoming reception area inside the Rella Aesthetics Napa clinic",
    imagePosition: "object-center",
    frameAspect: "aspect-[4/5]",
  },
  {
    slug: "vacaville",
    name: "Vacaville",
    address: "542 Main St",
    image: "/images/clinic/vacaville-exterior.webp",
    imageAlt: "The Rella Aesthetics storefront and pink entrance at the Vacaville clinic",
    imagePosition: "object-center",
    frameAspect: "aspect-[4/5]",
  },
] as const;

export type HomeLocationSlug = (typeof HOME_LOCATION_VISUALS)[number]["slug"];
