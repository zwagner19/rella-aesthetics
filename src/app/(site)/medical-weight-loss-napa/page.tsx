import type { Metadata } from "next";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { getServiceMetadata } from "@/lib/service-metadata";
import { WEIGHT_LOSS_ORIGIN } from "@/lib/site-hosts";

const canonicalUrl = `${WEIGHT_LOSS_ORIGIN}/medical-weight-loss-napa/`;
const serviceMetadata = getServiceMetadata("weight-loss");

export const metadata: Metadata = {
  ...serviceMetadata,
  alternates: { ...serviceMetadata.alternates, canonical: canonicalUrl },
  openGraph: { ...serviceMetadata.openGraph, url: canonicalUrl },
};

export default function MedicalWeightLossNapaPage() {
  return <WeightLossServicePage />;
}
