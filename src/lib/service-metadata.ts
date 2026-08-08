import type { Metadata } from "next";
import { servicePages } from "@/lib/service-data";
import { MEDICAL_WEIGHT_LOSS_CANONICAL_URL } from "@/lib/schemas";

export function getServiceMetadata(slug: string): Metadata {
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) return {};

  const canonicalUrl =
    service.slug === "weight-loss"
      ? MEDICAL_WEIGHT_LOSS_CANONICAL_URL
      : `/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(service.slug === "weight-loss"
      ? {
          keywords: [
            "medical weight loss Vacaville",
            "medical weight loss Napa",
            "semaglutide consultation Vacaville",
            "semaglutide consultation Napa",
            "physician-led weight management",
          ],
        }
      : {}),
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: canonicalUrl,
      images: [{ url: service.image, alt: service.title }],
    },
  };
}
