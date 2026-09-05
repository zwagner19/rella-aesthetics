import { notFound, redirect } from "next/navigation";
import { getSanityStudioUrl } from "@/lib/sanity-studio-url";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  const studioUrl = getSanityStudioUrl(process.env.SANITY_STUDIO_URL);
  if (!studioUrl) notFound();

  redirect(studioUrl);
}
