export function medicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://experiencerella.com/#organization",
    name: "Rella Aesthetics",
    description:
      "Northern California's luxury med spa offering Botox, dermal fillers, medical weight loss, laser treatments, and advanced skin care.",
    url: "https://experiencerella.com",
    telephone: "+17073582928",
    priceRange: "$$",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "542 Main St",
        addressLocality: "Vacaville",
        addressRegion: "CA",
        postalCode: "95688",
        addressCountry: "US",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "1541 3rd St",
        addressLocality: "Napa",
        addressRegion: "CA",
        postalCode: "94559",
        addressCountry: "US",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    // No aggregateRating. The 4.9 / 32-review figures previously emitted here
    // were not traceable to a verifiable source, and star ratings in structured
    // data are a representation to both search engines and patients. Rating
    // markup may return only when the numbers come from an auditable feed.
  };
}

export function treatmentServiceSchema(service: {
  slug: string;
  title: string;
  metaDescription: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://experiencerella.com/services/${service.slug}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription,
    url: `https://experiencerella.com/services/${service.slug}`,
    image: `https://experiencerella.com${service.image}`,
    provider: {
      "@type": "MedicalBusiness",
      "@id": "https://experiencerella.com/#organization",
      name: "Rella Aesthetics",
      telephone: "+17073582928",
    },
    areaServed: [
      { "@type": "City", name: "Vacaville", containedInPlace: { "@type": "State", name: "California" } },
      { "@type": "City", name: "Napa", containedInPlace: { "@type": "State", name: "California" } },
    ],
  };
}

export function localBusinessSchema(location: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  mapUrl: string;
}) {
  const slug = location.name.toLowerCase();

  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "DaySpa"],
    "@id": `https://experiencerella.com/locations/${slug}#location`,
    name: `Rella Aesthetics — ${location.name}`,
    url: `https://experiencerella.com/locations/${slug}`,
    image: "https://experiencerella.com/images/service-botox.jpg",
    telephone: `+1${location.phone.replace(/\D/g, "")}`,
    priceRange: "$$",
    hasMap: location.mapUrl,
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://experiencerella.com/#organization",
      name: "Rella Aesthetics",
      url: "https://experiencerella.com",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: location.city,
      containedInPlace: { "@type": "State", name: "California" },
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
  };
}

export function medicalWeightLossServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://experiencerella.com/services/weight-loss#service",
    name: "Medical Weight-Loss Consultation",
    serviceType: "Physician-led medical weight management",
    description:
      "A 30-minute phone consultation to discuss medical weight-loss goals, the Rella program, appropriate next steps, and cost questions before deciding.",
    url: "https://experiencerella.com/services/weight-loss",
    provider: {
      "@type": "MedicalBusiness",
      "@id": "https://experiencerella.com/#organization",
      name: "Rella Aesthetics",
      telephone: "+17073582928",
      employee: {
        "@type": "Person",
        name: "Zachary Wagner",
        honorificSuffix: "DO",
        jobTitle: "Physician",
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Certification",
          name: "American Board of Obesity Medicine diplomate",
        },
      },
    },
    areaServed: [
      { "@type": "City", name: "Vacaville", containedInPlace: { "@type": "State", name: "California" } },
      { "@type": "City", name: "Napa", containedInPlace: { "@type": "State", name: "California" } },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: { "@type": "ContactPoint", telephone: "+17073582928" },
      serviceLocation: [
        {
          "@type": "Place",
          name: "Rella Aesthetics Vacaville",
          address: {
            "@type": "PostalAddress",
            streetAddress: "542 Main St",
            addressLocality: "Vacaville",
            addressRegion: "CA",
            postalCode: "95688",
            addressCountry: "US",
          },
        },
        {
          "@type": "Place",
          name: "Rella Aesthetics Napa",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1541 3rd St",
            addressLocality: "Napa",
            addressRegion: "CA",
            postalCode: "94559",
            addressCountry: "US",
          },
        },
      ],
    },
  };
}
