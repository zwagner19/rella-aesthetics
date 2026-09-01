import { isAestheticsHost, isWeightLossHost } from "./site-hosts";

export const ATTRIBUTION_DENIAL_SENTINEL_NAME =
  "rella_ad_user_data_denied";
export const ATTRIBUTION_DENIAL_SENTINEL_MAX_AGE = 2_592_000;

export interface AttributionCookieStore {
  cookie: string;
}

export function attributionDenialSentinelDomain(
  hostname: string,
): string | null {
  if (isWeightLossHost(hostname)) return ".rellaweightloss.com";
  if (isAestheticsHost(hostname)) return ".experiencerella.com";
  return null;
}

export function hasAttributionDenialSentinel(cookieHeader: string): boolean {
  return cookieHeader.split(";").some((part) => {
    const [name, ...valueParts] = part.trim().split("=");
    return (
      name === ATTRIBUTION_DENIAL_SENTINEL_NAME &&
      valueParts.join("=") === "1"
    );
  });
}

export function writeAttributionDenialSentinel(
  hostname: string,
  cookieStore: AttributionCookieStore,
): boolean {
  const domain = attributionDenialSentinelDomain(hostname);
  if (!domain) return false;
  try {
    cookieStore.cookie =
      `${ATTRIBUTION_DENIAL_SENTINEL_NAME}=1; Domain=${domain}; Path=/; ` +
      `Max-Age=${ATTRIBUTION_DENIAL_SENTINEL_MAX_AGE}; Secure; SameSite=Lax`;
    return true;
  } catch {
    return false;
  }
}

export function clearAttributionDenialSentinel(
  hostname: string,
  cookieStore: AttributionCookieStore,
): boolean {
  const domain = attributionDenialSentinelDomain(hostname);
  if (!domain) return false;
  try {
    cookieStore.cookie =
      `${ATTRIBUTION_DENIAL_SENTINEL_NAME}=; Domain=${domain}; Path=/; ` +
      "Max-Age=0; Secure; SameSite=Lax";
    return true;
  } catch {
    return false;
  }
}
