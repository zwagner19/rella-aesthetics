import "server-only";
import type { Metadata } from "next";
import catalog from "./website-seo-catalog.json";

// Keep the root layout's approved social artwork when a page has no override.
const socialImage =
  "/_next/image?url=%2Fimages%2Fclinic%2Frella_two_locations_with_text_4k.png&w=1200&q=75";
type PublishedSeo = { title: string; description: string };
export function validPublishedSeo(value: unknown): value is PublishedSeo {
  if (!value || typeof value !== "object") return false;
  const v = value as PublishedSeo;
  return (
    typeof v.title === "string" &&
    v.title.length >= 10 &&
    v.title.length <= 120 &&
    typeof v.description === "string" &&
    v.description.length >= 30 &&
    v.description.length <= 320 &&
    !/[<>\u0000-\u001f]/.test(v.title + v.description)
  );
}

/** Runtime overrides affect metadata only. Source defaults survive outages and resets. */
export async function withWebsiteSeo(
  path: string,
  defaults: Metadata,
): Promise<Metadata> {
  if (!catalog.some((page) => page.path === path)) return defaults;
  try {
    const response = await fetch(
      `https://rella-hq.vercel.app/api/public/website-seo?path=${encodeURIComponent(path)}`,
      {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(1200),
        redirect: "error",
      },
    );
    if (!response.ok) return defaults;
    const value: unknown = await response.json();
    if (!validPublishedSeo(value)) return defaults;
    return {
      ...defaults,
      title: { absolute: value.title },
      description: value.description,
      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Rella Aesthetics",
        images: [
          {
            url: socialImage,
            width: 1200,
            height: 675,
            alt: "Rella Aesthetics in Napa and Vacaville",
          },
        ],
        ...defaults.openGraph,
        title: value.title,
        description: value.description,
      },
      twitter: {
        card: "summary_large_image",
        images: [socialImage],
        ...defaults.twitter,
        title: value.title,
        description: value.description,
      },
    };
  } catch {
    return defaults;
  }
}
