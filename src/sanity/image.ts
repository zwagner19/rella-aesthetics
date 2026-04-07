import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { projectId, dataset } from "./client";

const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity image URL builder not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  return builder.image(source);
}
