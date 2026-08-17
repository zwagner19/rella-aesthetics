export const services = [
  {
    slug: "botox",
    title: "Botox & Dysport",
    category: "Injectables",
    description: "Temporarily soften the appearance of dynamic lines with consultation-led neuromodulator treatment.",
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "A Rella Aesthetics team member holding Botox and Dysport vials",
  },
  {
    slug: "dermal-fillers",
    title: "Dermal Fillers",
    category: "Injectables",
    description: "Restore lost volume in cheeks, lips, and jawline with natural-looking results.",
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "A provider performing an injectable treatment near a patient's lips",
  },
  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    category: "Skin Care",
    description: "Consultation-led MicroPeel and TCA options currently available for Vacaville booking.",
    image: "/images/treatments/chemical-peel.webp",
    imageAlt: "A Rella provider applying an in-clinic facial treatment",
  },
  {
    slug: "facials",
    title: "Facials",
    category: "Skin Care",
    description: "Customized professional facials designed to target your unique skin concerns.",
    image: "/images/treatments/facial.webp",
    imageAlt: "A patient receiving red-light therapy during a facial",
  },
  {
    slug: "hydrafacial",
    title: "HydraFacial",
    category: "Skin Care",
    description: "Deep cleansing, exfoliation, and hydration in one advanced treatment session.",
    image: "/images/treatments/hydrafacial.webp",
    imageAlt: "A Rella provider using a facial-treatment handpiece on a patient's cheek",
  },
  {
    slug: "microneedling",
    title: "Microneedling",
    category: "Skin Care",
    description: "Stimulate collagen production to improve texture, tone, and overall skin quality.",
    image: "/images/treatments/microneedling-aftercare.webp",
    imageAlt: "A patient checking her skin in a mirror after treatment",
  },
  {
    slug: "iv-hydration",
    title: "IV Hydration",
    category: "Body & Wellness",
    description: "Clinician-guided IV hydration with screening, monitored administration, and an individualized formulation.",
    image: "/images/treatments/iv-hydration.webp",
    imageAlt: "A Rella-branded IV hydration bag prepared in the clinic",
  },
  {
    slug: "laser-treatments",
    title: "Laser Treatments",
    category: "Body & Wellness",
    description: "IPL, spider vein removal, laser hair removal, and Erbium skin resurfacing.",
    image: "/images/treatments/laser-treatment.webp",
    imageAlt: "A Rella provider performing a device-based skin treatment",
  },
  {
    slug: "weight-loss",
    title: "Medical Weight Loss",
    category: "Body & Wellness",
    description: "Physician-led weight management with a clear, no-pressure starting-point consultation.",
    image: "/images/treatments/medical-weight-loss.webp",
    imageAlt: "A gloved Rella team member holding three prepared syringes in the clinic",
  },
] as const;

export const testimonials = [
  {
    quote: "I decided to get my mom a birthday present — a little pampering at Rella Aesthetics. She absolutely loved it! The staff was warm and professional, and the results were beautiful. We will definitely be back.",
    name: "Mrs. Fout",
    source: "Google Review",
  },
  {
    quote: "I have been getting Botox for the last 14 years. I am so happy I found Rella Aesthetics. The team here is knowledgeable, skilled, and genuinely cares about their patients. Best results I have ever had.",
    name: "Jenya Khranilov",
    source: "Google Review",
  },
  {
    quote: "The entire experience at Rella Aesthetics was top-notch. From the moment I walked in, the staff was welcoming and attentive. I could not be happier with my treatment results.",
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
    hours: [
      "Tuesday–Friday: 9am–5pm",
      "Saturday: 9am–1pm",
      "Sunday–Monday: Closed",
    ],
    openingHours: [
      {
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
    mapUrl: "https://maps.google.com/?q=542+Main+St+Vacaville+CA+95688",
    googleReviewUrl: "https://g.page/r/CRzs_DqKMyuWEBM/review",
  },
  napa: {
    name: "Napa",
    address: "1541 3rd St",
    city: "Napa",
    state: "CA",
    zip: "94559",
    phone: "707.358.2928",
    hours: ["Thursday–Saturday: 9am–5pm", "Sunday–Wednesday: Closed"],
    openingHours: [
      {
        dayOfWeek: ["Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    mapUrl: "https://maps.google.com/?q=1541+3rd+St+Napa+CA+94559",
    googleReviewUrl: "https://g.page/r/CcUDgqqvRr8MEBM/review",
  },
} as const;

export const membershipTiers = [
  {
    name: "Tox Membership",
    price: "$30",
    period: "month",
    benefits: [
      "Botox at $13/unit",
      "Dysport at $4.40/unit",
      "1 complimentary Signature HydraFacial*",
      "10% off retail",
      "One-year membership commitment",
    ],
  },
  {
    name: "Filler Membership",
    price: "$40",
    period: "month",
    benefits: [
      "Restylane at $600/syringe",
      "Juvederm Ultra / Ultra Plus at $600",
      "Voluma / Vollure / Vollux / Volbella at $700",
      "1 complimentary Signature HydraFacial*",
      "10% off retail",
      "One-year membership commitment",
    ],
  },
  {
    name: "Tox + Filler Membership",
    price: "$50",
    period: "month",
    benefits: [
      "Botox at $13/unit",
      "Dysport at $4.40/unit",
      "Restylane at $600/syringe",
      "Juvederm at $600–$700, depending on product",
      "1 complimentary Deluxe HydraFacial*",
      "10% off retail",
      "One-year membership commitment",
    ],
  },
] as const;
