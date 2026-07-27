import type { Metadata } from "next";
import { resolveBookingHref } from "@/lib/booking-routes";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View before-and-after results from Rella Aesthetics patients. Real results from Botox, fillers, laser treatments, and more in Vacaville and Napa.",
};

const galleryItems = [
  { src: "/images/gallery-1.jpg", alt: "Botox treatment result", category: "Injectables" },
  { src: "/images/gallery-2.jpg", alt: "Dermal filler result", category: "Injectables" },
  { src: "/images/gallery-3.jpg", alt: "Chemical peel result", category: "Skin Care" },
  { src: "/images/gallery-4.jpg", alt: "Laser treatment result", category: "Laser" },
  { src: "/images/gallery-5.jpg", alt: "Microneedling result", category: "Skin Care" },
  { src: "/images/gallery-6.jpg", alt: "Weight loss result", category: "Body & Wellness" },
];

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            Results
          </p>
          <h1 className="font-bold text-4xl md:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            Patient Gallery
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] leading-relaxed">
            Real patients, real results. Browse before-and-after photos from our treatments.
          </p>
        </div>
      </section>

      {/* Gallery Grid — placeholder until real images are added */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Before & After"
            title="Treatment Results"
            description="Each result reflects our commitment to natural, physician-led outcomes. Images will be updated with real patient photos."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, i) => (
              <div key={i} className="relative group">
                <div className="aspect-[4/3] bg-silver-pale rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-silver-light text-sm">
                    {item.alt}
                  </div>
                </div>
                <span className="mt-2 block text-xs font-bold tracking-[0.15em] uppercase text-silver">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-rose text-white text-center">
        <div className="mx-auto max-w-[600px] px-6">
          <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="font-light text-lg mb-6 opacity-90">
            Book a consultation and discover what&apos;s possible.
          </p>
          <Button
            href={resolveBookingHref({})}
            className="bg-white !text-rose hover:bg-white/90 hover:!text-rose-dark"
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
