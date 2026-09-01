export const WEIGHT_LOSS_HOST = "rellaweightloss.com";
export const WEIGHT_LOSS_ORIGIN = `https://${WEIGHT_LOSS_HOST}`;
export const LEGACY_WEIGHT_LOSS_HOST = "weightloss.experiencerella.com";
const AESTHETICS_HOSTS = new Set([
  "experiencerella.com",
  "www.experiencerella.com",
]);
const WEIGHT_LOSS_CITY_LANDING_PATHS = new Set([
  "/medical-weight-loss-napa",
  "/medical-weight-loss-vacaville",
]);

function normalizedHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0].trim().toLowerCase().replace(/\.$/, "");
}

export function isWeightLossHost(host: string | null | undefined): boolean {
  return normalizedHost(host) === WEIGHT_LOSS_HOST;
}

export function isAestheticsHost(host: string | null | undefined): boolean {
  return AESTHETICS_HOSTS.has(normalizedHost(host));
}

function slashlessPath(pathname: string | null | undefined): string {
  if (!pathname) return "";
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

export function isWeightLossCityLandingPath(
  pathname: string | null | undefined,
): boolean {
  return WEIGHT_LOSS_CITY_LANDING_PATHS.has(slashlessPath(pathname));
}

export function isWeightLossLandingPath(
  pathname: string | null | undefined,
): boolean {
  return slashlessPath(pathname) === "/" || isWeightLossCityLandingPath(pathname);
}

export function isLegacyWeightLossHost(
  host: string | null | undefined,
): boolean {
  const hostname = normalizedHost(host);
  return (
    hostname === LEGACY_WEIGHT_LOSS_HOST ||
    hostname === `www.${WEIGHT_LOSS_HOST}`
  );
}

export function isCrossSiteLegacyWeightLossHost(
  host: string | null | undefined,
): boolean {
  return normalizedHost(host) === LEGACY_WEIGHT_LOSS_HOST;
}
