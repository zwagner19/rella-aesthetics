import type { Metadata } from "next";
import { Suspense } from "react";
import { VisualizerWizard } from "@/components/visualizer/VisualizerWizard";
import {
  RELLA_BRAND,
  VISUALIZER_EYEBROW,
  VISUALIZER_HERO_DESCRIPTION,
  VISUALIZER_HERO_TITLE,
} from "@/lib/visualizer/brand";

export const metadata: Metadata = {
  title: "See Your Results",
  description: `Preview Botox and laser treatments at ${RELLA_BRAND.name}. ${RELLA_BRAND.locations}.`,
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
      <section className="py-14 md:py-20 bg-rose-blush">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 text-center">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-3">
            {VISUALIZER_EYEBROW}
          </p>
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-[0.08em] uppercase text-rose-text mb-3 leading-[1.1]">
            {VISUALIZER_HERO_TITLE}
          </h1>
          <p className="text-base font-light text-silver max-w-md mx-auto">
            {VISUALIZER_HERO_DESCRIPTION}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <Suspense fallback={<p className="text-center text-silver text-sm">Loading…</p>}>
            <VisualizerWizard />
          </Suspense>
        </div>
      </section>
    </>
  );
}
