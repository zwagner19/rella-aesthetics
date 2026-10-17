export const treatmentCategories = [
  {
    id: "injectables",
    number: "01",
    label: "Injectables",
    href: "/services/botox",
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "A Rella Aesthetics team member holding Botox and Dysport vials",
    services: ["Botox & Dysport", "Dermal Fillers"],
  },
  {
    id: "skin",
    number: "02",
    label: "Skin",
    href: "/services/hydrafacial",
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "A Rella provider using a facial-treatment handpiece on a patient's cheek",
    services: ["HydraFacial", "Facials", "Chemical Peels", "Microneedling"],
  },
  {
    id: "lasers",
    number: "03",
    label: "Lasers",
    href: "/services/laser-treatments",
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "A Rella provider performing a device-based skin treatment",
    services: ["IPL", "Laser hair removal", "Resurfacing"],
  },
  {
    id: "wellness",
    number: "04",
    label: "Wellness",
    href: "/services/iv-hydration",
    image: "/images/treatments/iv-hydration.webp",
    imageAlt: "A Rella-branded IV hydration bag prepared in the clinic",
    services: ["IV Hydration"],
  },
  {
    id: "weight-management",
    number: "05",
    label: "Weight Management",
    href: "/services/weight-loss",
    image: "/images/treatments/medical-weight-loss.webp",
    imageAlt: "A gloved Rella team member holding three prepared syringes in the clinic",
    services: ["Medical Weight Loss"],
  },
] as const;

export type TreatmentCategoryId = (typeof treatmentCategories)[number]["id"];
