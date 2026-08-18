import type { Metadata } from "next";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Rella Aesthetics' full range of treatments — injectables, skin care, laser, IV hydration, and medical weight loss in Vacaville and Napa.",
};

const categories = ["Injectables", "Skin Care", "Body & Wellness"] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Treatments"
            title="Our Services"
            description="Physician-led aesthetic and wellness treatments designed around your goals. Every service follows a personalized treatment plan for natural, lasting results."
          />

          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-16 last:mb-0">
                <h3 className="font-medium text-lg text-silver-dark mb-6 border-b border-silver-pale pb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      title={service.title}
                      description={service.description}
                      image={service.image}
                      imageAlt={service.title}
                      imagePosition={service.imagePosition}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
