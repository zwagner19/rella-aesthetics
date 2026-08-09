import type { Metadata } from "next";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Rella Aesthetics' full range of treatments — injectables, skin care, laser, IV hydration, and medical weight loss in Vacaville and Napa.",
  alternates: { canonical: "/services" },
};

const categories = ["Injectables", "Skin Care", "Body & Wellness"] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[820px]">
            <SectionHeader
              eyebrow="Treatments"
              title="Our Services"
              description="Explore consultation-led aesthetic, skin, wellness, and medical weight-management options available through Rella in Vacaville and Napa."
              headingLevel={1}
            />
          </div>

          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-20 border-t border-ink pt-6 last:mb-0">
                <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.16em] text-ink">
                  {category}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      title={service.title}
                      description={service.description}
                      image={service.image}
                      imageAlt={service.title}
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
