import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages } from "@/lib/service-data";
import { FaqSchema } from "@/components/blocks/FaqAccordion";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { TreatmentServicePage } from "@/components/pages/TreatmentServicePage";
import { treatmentServiceSchema } from "@/lib/schemas";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: `/services/${service.slug}`,
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
      url: `/services/${service.slug}`,
      images: [{ url: service.image, alt: service.title }],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);
  if (!service) notFound();

  if (service.slug === "weight-loss") {
    return <WeightLossServicePage />;
  }

  return (
    <>
      <FaqSchema items={service.faq} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(treatmentServiceSchema(service)).replace(/</g, "\\u003c"),
        }}
      />
      <TreatmentServicePage service={service} />
    </>
  );
}
