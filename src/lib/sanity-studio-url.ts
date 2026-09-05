const SANITY_STUDIO_SUFFIX = ".sanity.studio";

/** Keep the public app from becoming an open redirect or editor host. */
export function getSanityStudioUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const isHostedStudio = url.hostname.endsWith(SANITY_STUDIO_SUFFIX);

    if (
      url.protocol !== "https:" ||
      !isHostedStudio ||
      url.port ||
      url.username ||
      url.password
    ) {
      return null;
    }

    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}
