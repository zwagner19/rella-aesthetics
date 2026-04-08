import { PlatformTarget } from "@boulevard/blvd-book-sdk";

export const BOULEVARD_API_KEY = process.env.NEXT_PUBLIC_BOULEVARD_API_KEY ?? "";
export const BOULEVARD_BUSINESS_ID = process.env.NEXT_PUBLIC_BOULEVARD_BUSINESS_ID ?? "";

/** Set NEXT_PUBLIC_BOULEVARD_USE_SANDBOX=true while testing against Boulevard sandbox */
export function getBoulevardTarget(): PlatformTarget {
  const raw = process.env.NEXT_PUBLIC_BOULEVARD_USE_SANDBOX;
  if (raw === "true" || raw === "1") return PlatformTarget.Sandbox;
  return PlatformTarget.Live;
}

export function isBoulevardConfigured(): boolean {
  return Boolean(BOULEVARD_API_KEY && BOULEVARD_BUSINESS_ID);
}
