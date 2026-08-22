import type { Metadata } from "next";
import { VisualizerWizard } from "@/components/visualizer/VisualizerWizard";
import { VisualizerDisclaimer } from "@/components/visualizer/VisualizerDisclaimer";
import {
  RELLA_BRAND,
  VISUALIZER_EYEBROW,
  VISUALIZER_HERO_DESCRIPTION,
  VISUALIZER_HERO_TITLE,
} from "@/lib/visualizer/brand";

export const metadata: Metadata = {
  title: "See Your Results",
  description: `Upload a selfie and see a conservative, personalized Botox preview on your own face. Free simulation from ${RELLA_BRAND.name} in ${RELLA_BRAND.locations}. Book at ${RELLA_BRAND.site}.`,
  alternates: {
    canonical: `${RELLA_BRAND.siteUrl}/see-your-results`,
  },
  openGraph: {
    title: `See Your Results | ${RELLA_BRAND.name}`,
    description: VISUALIZER_HERO_DESCRIPTION,
    url: `${RELLA_BRAND.siteUrl}/see-your-results`,
  },
};

export default function SeeYourResultsPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 text-center">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            {VISUALIZER_EYEBROW}
          </p>
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            {VISUALIZER_HERO_TITLE}
          </h1>
          <p className="text-lg font-light text-silver max-w-[560px] mx-auto leading-relaxed mb-6">
            {VISUALIZER_HERO_DESCRIPTION}
          </p>
          <div className="max-w-xl mx-auto">
            <VisualizerDisclaimer compact />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <VisualizerWizard />
        </div>
      </section>
    </>
  );
}
