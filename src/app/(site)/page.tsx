import type { Metadata } from "next";
import { headers } from "next/headers";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeApproach } from "@/components/home/HomeApproach";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeLocations } from "@/components/home/HomeLocations";
import { HomeMembership } from "@/components/home/HomeMembership";
import { HomeProviders } from "@/components/home/HomeProviders";
import { PatientWords } from "@/components/home/PatientWords";
import { RellaStandard } from "@/components/home/RellaStandard";
import { TransformHouse } from "@/components/home/TransformHouse";
import { TreatmentDiscovery } from "@/components/home/TreatmentDiscovery";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { medicalBusinessSchema } from "@/lib/schemas";
import { getServiceMetadata } from "@/lib/service-metadata";
import { isWeightLossHost } from "@/lib/site-hosts";

const mainSiteMetadata: Metadata = {
  title: { absolute: "Rella Aesthetics Med Spa | Vacaville & Napa CA" },
  description:
    "Personalized aesthetic and wellness care in Vacaville and Napa, California. Explore Rella's services or book a consultation.",
  alternates: { canonical: "/" },
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  return isWeightLossHost(host) ? getServiceMetadata("weight-loss") : mainSiteMetadata;
}

function HomePageContent({ isWeightLoss }: { isWeightLoss: boolean }) {
  if (isWeightLoss) return <WeightLossServicePage />;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalBusinessSchema()).replace(/</g, "\\u003c"),
        }}
      />

      <HomeHero />
      <HomeApproach />
      <TreatmentDiscovery />
      <TransformHouse />
      <HomeLocations />
      <RellaStandard />
      <HomeProviders />
      <HomeMembership />
      <PatientWords />
      <FinalCta />
    </>
  );
}

export default async function HomePage() {
  const host = (await headers()).get("host");
  return <HomePageContent isWeightLoss={isWeightLossHost(host)} />;
}
