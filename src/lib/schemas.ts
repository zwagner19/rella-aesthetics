export function medicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "32",
      bestRating: "5",
    },
  };
}

export function localBusinessSchema(location: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://experiencerella.com/locations/${location.name.toLowerCase()}`,
    name: `Rella Aesthetics — ${location.name}`,
    telephone: `+1${location.phone.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US",
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
