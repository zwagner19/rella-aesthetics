import "server-only";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
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

// Cache the handled result, not the raw fetch. Next's fetch revalidation runs
// outside the caller's catch and drops its AbortSignal on background refreshes.
// Keeping fetch uncached inside this callback bounds every attempt, including
// response-body reads, and makes outages a short-lived fallback cache entry.
const readPublishedSeo = unstable_cache(async (path: string): Promise<PublishedSeo | null> => {
  const signal = AbortSignal.timeout(1200);
  try {
    const response = await fetch(
      `https://rella-hq.vercel.app/api/public/website-seo?path=${encodeURIComponent(path)}`,
      {
        cache: "no-store",
        signal,
        redirect: "error",
      },
    );
    if (!response.ok) {
      console.warn("[website-seo] Optional metadata unavailable", { path, reason: "http", status: response.status });
      return null;
    }
    const value: unknown = await response.json();
    // A successful null response is HQ's explicit restore-defaults contract.
    if (value === null) return null;
    if (!validPublishedSeo(value)) {
      console.warn("[website-seo] Optional metadata unavailable", { path, reason: "invalid-payload" });
      return null;
    }
    return { title: value.title, description: value.description };
  } catch {
    // Never log the upstream error object, URL, response body, or credentials.
    console.warn("[website-seo] Optional metadata unavailable", { path, reason: signal.aborted ? "timeout" : "request" });
    return null;
  }
}, ["website-seo-v2"], { revalidate: 60 });

/** Runtime overrides affect metadata only. Source defaults survive outages and resets. */
export async function withWebsiteSeo(
  path: string,
  defaults: Metadata,
): Promise<Metadata> {
  if (!catalog.some((page) => page.path === path)) return defaults;
  try {
    const value = await readPublishedSeo(path);
    if (!value) return defaults;
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
