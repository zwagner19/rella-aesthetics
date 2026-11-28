import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CheckoutRehearsal } from "@/components/gift-cards/CheckoutRehearsal";
export const dynamic = "force-dynamic";
export const metadata = { title: "Owner review · Black Friday checkout", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const host = ((await headers()).get("host") ?? "").toLowerCase().split(":")[0];
  if (process.env.VERCEL_ENV === "production" || ["experiencerella.com", "www.experiencerella.com"].includes(host)) notFound();
  return <CheckoutRehearsal params={await searchParams} />;
}
