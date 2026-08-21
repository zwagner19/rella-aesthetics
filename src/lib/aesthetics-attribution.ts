import { CUSTOM_BOOKING_ORIGIN } from "./booking-routes";
import { isAestheticsHost, WEIGHT_LOSS_HOST } from "./site-hosts";
import type { AttributionConsentState } from "./attribution-consent";
import { isAttributionRevocationHandle } from "./attribution-revocation-handle";

/**
 * Privacy-minimized attribution handoff for general aesthetics traffic.
 * Only approved click/campaign values are retained, and only for the current
 * browser session until the first-party booking server acknowledges capture.
 */

const CLICK_ID_FIELDS = ["gclid", "gbraid", "wbraid"] as const;
const CAMPAIGN_ID_FIELDS = ["campaignid", "adgroupid"] as const;
const APPROVED_FIELDS = [...CLICK_ID_FIELDS, ...CAMPAIGN_ID_FIELDS] as const;
const LEGACY_UNSAFE_FIELDS = [
  "gclsrc",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "keyword",
  "matchtype",
  "device",
  "network",
  "gad_keyword",
  "gad_matchtype",
  "gad_device",
  "gad_network",
] as const;

type CampaignIdField = (typeof CAMPAIGN_ID_FIELDS)[number];
type ApprovedField = (typeof APPROVED_FIELDS)[number];

const CAMPAIGN_ID_ALIASES: Readonly<Record<string, CampaignIdField>> = {
  gad_campaignid: "campaignid",
  gad_adgroupid: "adgroupid",
};

const CLICK_ID_RE = /^[\w.~-]{1,200}$/;
const NUMERIC_ID_RE = /^\d{1,30}$/;

export const AESTHETICS_ATTRIBUTION_STORAGE_KEY =
  "rella_aesthetics_attribution_v1";
export const AESTHETICS_MARKETING_ORIGIN = "https://experiencerella.com";
export const AESTHETICS_WWW_MARKETING_ORIGIN =
  "https://www.experiencerella.com";
const AESTHETICS_MARKETING_ORIGINS = new Set([
  AESTHETICS_MARKETING_ORIGIN,
  AESTHETICS_WWW_MARKETING_ORIGIN,
]);
export const AESTHETICS_ATTRIBUTION_ENDPOINT =
  `${CUSTOM_BOOKING_ORIGIN}/api/booking-v2/attribution`;
export const WEIGHT_LOSS_MARKETING_HOST = WEIGHT_LOSS_HOST;

export type AestheticsAttribution = Partial<Record<ApprovedField, string>>;
export type AestheticsLocation = "napa" | "vacaville" | "unknown";

export interface AttributionSessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type AttributionFetch = (
  input: string,
  init: RequestInit,
) => Promise<Pick<Response, "ok" | "json">>;

function approvedValue(field: ApprovedField, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;
  return (CLICK_ID_FIELDS as readonly string[]).includes(field)
    ? CLICK_ID_RE.test(value) ? value : null
    : NUMERIC_ID_RE.test(value) ? value : null;
}

function hasExactlyOneClickIdentifier(
  attribution: AestheticsAttribution,
): boolean {
  return (
    CLICK_ID_FIELDS.filter((field) => Boolean(attribution[field])).length === 1
  );
}

function hasIncomingClickIdentifierField(search: string): boolean {
  const incoming = new URLSearchParams(search);
  return CLICK_ID_FIELDS.some((field) => incoming.has(field));
}

function sanitizeAttributionObject(candidate: unknown): AestheticsAttribution {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {};
  }
  const input = candidate as Record<string, unknown>;
  const approved: AestheticsAttribution = {};
  for (const field of APPROVED_FIELDS) {
    const value = approvedValue(field, input[field]);
    if (value) approved[field] = value;
  }
  return hasExactlyOneClickIdentifier(approved) ? approved : {};
}

/** Parse only explicitly approved, bounded attribution values from a query. */
export function parseAestheticsAttribution(
  search: string,
): AestheticsAttribution {
  const incoming = new URLSearchParams(search);
  const approved: AestheticsAttribution = {};

  for (const field of APPROVED_FIELDS) {
    const value = approvedValue(field, incoming.get(field));
    if (value) approved[field] = value;
  }
  for (const [alias, canonical] of Object.entries(CAMPAIGN_ID_ALIASES)) {
    if (approved[canonical]) continue;
    const value = approvedValue(canonical, incoming.get(alias));
    if (value) approved[canonical] = value;
  }
  return hasExactlyOneClickIdentifier(approved) ? approved : {};
}

/**
 * A current valid touch replaces the session fallback as one coherent record.
 * With no new touch, revalidate and restore the existing session record.
 */
export function resolveAestheticsAttribution(
  search: string,
  storage: AttributionSessionStorage | null,
): AestheticsAttribution {
  const incoming = parseAestheticsAttribution(search);
  if (Object.keys(incoming).length > 0) {
    try {
      storage?.setItem(
        AESTHETICS_ATTRIBUTION_STORAGE_KEY,
        JSON.stringify(incoming),
      );
    } catch {
      // The current page retains the values for a later consent-gated retry.
    }
    return incoming;
  }
  if (hasIncomingClickIdentifierField(search)) {
    try {
      storage?.removeItem(AESTHETICS_ATTRIBUTION_STORAGE_KEY);
    } catch {
      // The conflicting current URL still remains the authoritative no-touch.
    }
    return {};
  }

  try {
    const raw = storage?.getItem(AESTHETICS_ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeAttributionObject(JSON.parse(raw));
  } catch {
    return {};
  }
}

/** Infer location only from explicit, location-owned public routes. */
export function inferAestheticsLocation(pathname: string): AestheticsLocation {
  const normalized = `/${pathname}`.replace(/\/{2,}/g, "/").toLowerCase();
  if (
    normalized === "/napa" ||
    normalized.startsWith("/napa/") ||
    normalized === "/locations/napa" ||
    normalized.startsWith("/locations/napa/") ||
    normalized === "/blog/botox-cost-napa" ||
    normalized === "/blog/botox-cost-napa/"
  ) {
    return "napa";
  }
  if (
    normalized === "/vacaville" ||
    normalized.startsWith("/vacaville/") ||
    normalized === "/locations/vacaville" ||
    normalized.startsWith("/locations/vacaville/")
  ) {
    return "vacaville";
  }
  return "unknown";
}

/** Run the global aesthetics handoff only on its exact production hosts. */
export function isGeneralAestheticsHost(hostname: string): boolean {
  return isAestheticsHost(hostname);
}

/** Strip raw Google click identifiers only after the server acknowledges them. */
export function stripAestheticsAttributionFromPageHref(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  for (const field of APPROVED_FIELDS) url.searchParams.delete(field);
  for (const alias of Object.keys(CAMPAIGN_ID_ALIASES)) {
    url.searchParams.delete(alias);
  }
  for (const field of LEGACY_UNSAFE_FIELDS) url.searchParams.delete(field);
  return url.toString();
}

/**
 * Capture only from the exact production marketing origin. Preview deployments
 * never write into production capture.
 */
export async function postAestheticsAttribution(args: {
  attribution: AestheticsAttribution;
  consentState: AttributionConsentState;
  marketingOrigin: string;
  pathname: string;
  fetchImpl: AttributionFetch;
  revocationHandle: string;
  revocationPredecessorHandle?: string | null;
  signal?: AbortSignal;
}): Promise<boolean> {
  if (args.consentState !== "granted") return false;

  let origin: string;
  try {
    origin = new URL(args.marketingOrigin).origin;
  } catch {
    return false;
  }
  const attribution = sanitizeAttributionObject(args.attribution);
  const predecessor = args.revocationPredecessorHandle;
  if (
    !AESTHETICS_MARKETING_ORIGINS.has(origin) ||
    Object.keys(attribution).length === 0 ||
    !isAttributionRevocationHandle(args.revocationHandle) ||
    (predecessor != null &&
      (!isAttributionRevocationHandle(predecessor) ||
        predecessor === args.revocationHandle))
  ) {
    return false;
  }
  try {
    const response = await args.fetchImpl(AESTHETICS_ATTRIBUTION_ENDPOINT, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      signal: args.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: inferAestheticsLocation(args.pathname),
        consentAdUserData: "granted",
        revocationHandle: args.revocationHandle,
        ...(predecessor
          ? { revocationPredecessorHandle: predecessor }
          : {}),
        ...attribution,
      }),
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return Boolean(
      result &&
        typeof result === "object" &&
        (result as Record<string, unknown>).ok === true &&
        typeof (result as Record<string, unknown>).attributionId === "string" &&
        ((result as Record<string, unknown>).attributionId as string).trim() &&
        (result as Record<string, unknown>).consentAdUserData === "granted" &&
        (result as Record<string, unknown>).clickIdentifiersStored === true,
    );
  } catch {
    return false;
  }
}

/** Revoke server attribution after an explicit completed advertising denial. */
export async function revokeAestheticsAttribution(args: {
  marketingOrigin: string;
  pathname: string;
  fetchImpl: AttributionFetch;
  revocationHandle?: string | null;
  signal?: AbortSignal;
}): Promise<boolean> {
  let origin: string;
  try {
    origin = new URL(args.marketingOrigin).origin;
  } catch {
    return false;
  }
  if (!AESTHETICS_MARKETING_ORIGINS.has(origin)) return false;
  if (
    args.revocationHandle != null &&
    !isAttributionRevocationHandle(args.revocationHandle)
  ) {
    return false;
  }

  try {
    const response = await args.fetchImpl(AESTHETICS_ATTRIBUTION_ENDPOINT, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      signal: args.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: inferAestheticsLocation(args.pathname),
        consentAdUserData: "denied",
        ...(args.revocationHandle
          ? { revocationHandle: args.revocationHandle }
          : {}),
      }),
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return Boolean(
      result &&
        typeof result === "object" &&
        (result as Record<string, unknown>).ok === true &&
        (result as Record<string, unknown>).consentAdUserData === "denied" &&
        typeof (result as Record<string, unknown>).revoked === "boolean" &&
        (result as Record<string, unknown>).clickIdentifiersStored === false &&
        (result as Record<string, unknown>).revocationFinalized === true,
    );
  } catch {
    return false;
  }
}
