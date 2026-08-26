import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Rella Aesthetics' full range of treatments: injectables, skin care, laser, IV hydration, and medical weight loss in Vacaville and Napa.",
  alternates: { canonical: "/services" },
};

const categories = ["Injectables", "Skin Care", "Body & Wellness"] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <div className="max-w-[820px]">
            <div className="mb-12 max-w-[680px]">
              <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
                Treatments
              </p>
              <h1 className="mb-5 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] text-rose md:text-5xl">
                Our Services
              </h1>
              <p className="max-w-[620px] leading-relaxed text-ink/70">
                Explore consultation-led aesthetic, skin, wellness, and medical weight-management
                options available through Rella in Vacaville and Napa.
              </p>
            </div>
          </div>

          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-20 border-t border-rose pt-6 last:mb-0">
                <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.16em] text-rose">
                  {category}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => {
                    return (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group flex flex-col overflow-hidden border border-rose bg-white transition-colors duration-150 hover:bg-rose focus-visible:bg-rose"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
                          <Image
                            src={service.image}
                            alt={service.imageAlt}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="mb-3 text-xl font-bold uppercase leading-tight tracking-[0.08em] text-rose transition-colors duration-150 group-hover:text-white group-focus-visible:text-white">
                            {service.title}
                          </h3>
                          <p className="mb-5 flex-1 text-sm font-light leading-relaxed text-ink/70 transition-colors duration-150 group-hover:text-white/90 group-focus-visible:text-white/90">
                            {service.description}
                          </p>
                          <span className="inline-flex items-center gap-2 border-t border-rose pt-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-rose transition-colors duration-150 group-hover:border-white/45 group-hover:text-white group-focus-visible:border-white/45 group-focus-visible:text-white">
                            Learn more <span aria-hidden="true">&rarr;</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
