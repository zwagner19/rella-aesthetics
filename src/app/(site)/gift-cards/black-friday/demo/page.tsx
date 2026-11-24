import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BlackFridayLanding } from "@/components/gift-cards/BlackFridayLanding";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "DEMO · Black Friday Gift Cards",
  robots: { index: false, follow: false },
};

const PRODUCTION_HOSTS = new Set(["experiencerella.com", "www.experiencerella.com"]);

/** Preview-only design review route with fixture data. 404 in production. */
export default async function BlackFridayDemoPage() {
  const host = ((await headers()).get("host") ?? "").toLowerCase().split(":")[0];
  if (process.env.VERCEL_ENV === "production" || PRODUCTION_HOSTS.has(host)) notFound();
  return <BlackFridayLanding demo />;
}
