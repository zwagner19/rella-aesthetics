import type { Metadata } from "next";
import { Suspense } from "react";
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
  description: `Free AI preview for Botox and laser pigmentation treatments at ${RELLA_BRAND.name}. Upload a selfie and see conservative results on your own face. ${RELLA_BRAND.locations}.`,
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
          <p className="text-lg font-light text-silver max-w-[640px] mx-auto leading-relaxed mb-6">
            {VISUALIZER_HERO_DESCRIPTION}
          </p>
          <p className="text-sm text-silver max-w-xl mx-auto mb-4">
            Botox & Dysport · Laser pigmentation & sun spots (IPL)
          </p>
          <div className="max-w-xl mx-auto">
            <VisualizerDisclaimer compact />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <Suspense fallback={<p className="text-center text-silver">Loading preview tool…</p>}>
            <VisualizerWizard />
          </Suspense>
        </div>
      </section>
    </>
  );
}
