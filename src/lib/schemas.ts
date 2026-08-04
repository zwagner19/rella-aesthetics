import { locations } from "@/lib/data";

export function medicalBusinessSchema() {
  const locationNodes = [locations.vacaville, locations.napa].map((location) =>
    localBusinessNode(location),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://experiencerella.com/#organization",
        name: "Rella Aesthetics",
        description:
          "Physician-owned aesthetic, skin, wellness, and medical weight-management care in Vacaville and Napa, California.",
        url: "https://experiencerella.com",
        telephone: "+17073582928",
        department: locationNodes.map((location) => ({
          "@id": location["@id"],
        })),
      },
      ...locationNodes,
    ],
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
      "@type": "Organization",
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

type LocalBusinessInput = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  mapUrl: string;
  openingHours: readonly {
    readonly dayOfWeek: readonly string[];
    readonly opens: string;
    readonly closes: string;
  }[];
};

function localBusinessNode(location: LocalBusinessInput) {
  const slug = location.name.toLowerCase();

  return {
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
    openingHoursSpecification: location.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...hours.dayOfWeek],
      opens: hours.opens,
      closes: hours.closes,
    })),
    // No aggregateRating. Ratings may return only from an auditable source.
  };
}

export function localBusinessSchema(location: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    ...localBusinessNode(location),
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
      "@type": "Organization",
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

export function physicianOwnerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://experiencerella.com/about#dr-zachary-wagner",
    name: "Zachary Wagner",
    honorificPrefix: "Dr.",
    honorificSuffix: "DO",
    jobTitle: "Physician Owner",
    url: "https://experiencerella.com/about",
    image: "https://experiencerella.com/images/dr-zachary-wagner.jpg",
    worksFor: {
      "@type": "Organization",
      "@id": "https://experiencerella.com/#organization",
      name: "Rella Aesthetics",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Board certification",
      name: "American Board of Obesity Medicine diplomate",
    },
  };
}
