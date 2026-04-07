export const services = [
  {
    slug: "botox",
    title: "Botox & Dysport",
    category: "Injectables",
    description: "Reduce fine lines and prevent wrinkles with expertly administered neuromodulators.",
    image: "/images/service-botox.jpg",
  },
  {
    slug: "dermal-fillers",
    title: "Dermal Fillers",
    category: "Injectables",
    description: "Restore lost volume in cheeks, lips, and jawline with natural-looking results.",
    image: "/images/service-fillers.jpg",
  },
  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    category: "Skin Care",
    description: "Reveal smoother, brighter skin by removing damaged outer layers with medical-grade peels.",
    image: "/images/service-peels.jpg",
  },
  {
    slug: "facials",
    title: "Facials",
    category: "Skin Care",
    description: "Customized professional facials designed to target your unique skin concerns.",
    image: "/images/service-facials.jpg",
  },
  {
    slug: "hydrafacial",
    title: "HydraFacial",
    category: "Skin Care",
    description: "Deep cleansing, exfoliation, and hydration in one advanced treatment session.",
    image: "/images/service-hydrafacial.jpg",
  },
  {
    slug: "microneedling",
    title: "Microneedling",
    category: "Skin Care",
    description: "Stimulate collagen production to improve texture, tone, and overall skin quality.",
    image: "/images/service-microneedling.jpg",
  },
  {
    slug: "iv-hydration",
    title: "IV Hydration",
    category: "Body & Wellness",
    description: "Vitamin-infused IV therapy for energy, immunity, and recovery.",
    image: "/images/service-iv.jpg",
  },
  {
    slug: "laser-treatments",
    title: "Laser Treatments",
    category: "Body & Wellness",
    description: "IPL, spider vein removal, laser hair removal, and Erbium skin resurfacing.",
    image: "/images/service-laser.jpg",
  },
  {
    slug: "weight-loss",
    title: "Medical Weight Loss",
    category: "Body & Wellness",
    description: "Physician-supervised semaglutide program with weekly check-ins and personalized support.",
    image: "/images/service-weightloss.jpg",
  },
] as const;

export const testimonials = [
  {
    quote: "Dr. Sonia Dhillon is wonderful at her craft. She takes the time to listen and makes sure you are comfortable. I always leave feeling refreshed and confident.",
    name: "Emika Freeman",
    source: "Google Review",
  },
  {
    quote: "I have been getting Botox for the last 14 years. The team here is knowledgeable, skilled, and genuinely cares about their patients. Best results I have ever had.",
    name: "Jenya Khranilov",
    source: "Google Review",
  },
  {
    quote: "The entire experience at Rella Aesthetics was top-notch. From the moment I walked in, the staff was welcoming and attentive. I could not be happier with my results.",
    name: "Diamond Bolton",
    source: "Google Review",
  },
] as const;

export const locations = {
  vacaville: {
    name: "Vacaville",
    address: "542 Main St",
    city: "Vacaville",
    state: "CA",
    zip: "95688",
    phone: "707.358.2928",
    hours: ["Monday–Friday: 9am–5pm", "Saturday: 9am–1pm"],
    mapUrl: "https://maps.google.com/?q=542+Main+St+Vacaville+CA+95688",
  },
  napa: {
    name: "Napa",
    address: "1541 3rd St",
    city: "Napa",
    state: "CA",
    zip: "94559",
    phone: "707.358.2928",
    hours: ["Monday–Friday: 9am–5pm", "Saturday: 9am–1pm"],
    mapUrl: "https://maps.google.com/?q=1541+3rd+St+Napa+CA+94559",
  },
} as const;

export const membershipTiers = [
  {
    name: "Tox Membership",
    price: "$20",
    period: "month",
    benefits: [
      "Botox at $10/unit",
      "Dysport at $3.33/unit",
      "10% off all Rella Skincare Products",
    ],
  },
  {
    name: "Filler Membership",
    price: "$30",
    period: "month",
    benefits: [
      "Filler at $500/syringe",
      "10% off all Rella Skincare Products",
    ],
  },
  {
    name: "Filler & Tox Membership",
    price: "$40",
    period: "month",
    featured: true,
    benefits: [
      "Botox at $10/unit",
      "Dysport at $3.33/unit",
      "Filler at $450/syringe",
      "15% off Rella Skincare Products",
    ],
  },
] as const;
