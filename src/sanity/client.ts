import { createClient, type SanityClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

const isSanityConfigured = Boolean(projectId && /^[a-z0-9-]+$/.test(projectId));

function buildClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === "production",
  });
}

export const client = buildClient();
