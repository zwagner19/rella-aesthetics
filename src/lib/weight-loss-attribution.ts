import { WEIGHT_LOSS_BOOKING_ORIGIN } from "./booking-routes";
import { WEIGHT_LOSS_ORIGIN } from "./site-hosts";
import type { AttributionConsentState } from "./attribution-consent";
import { isAttributionRevocationHandle } from "./attribution-revocation-handle";

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

export const WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY =
  "rella_weight_loss_attribution_v1";
export const WEIGHT_LOSS_MARKETING_ORIGIN = WEIGHT_LOSS_ORIGIN;
export const WEIGHT_LOSS_ATTRIBUTION_ENDPOINT =
  `${WEIGHT_LOSS_BOOKING_ORIGIN}/api/booking-v2/attribution`;

export type WeightLossAttribution = Partial<Record<ApprovedField, string>>;
export type WeightLossAttributionLocation = "napa" | "vacaville" | "unknown";

export interface WeightLossAttributionSessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type WeightLossAttributionFetch = (
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
  attribution: WeightLossAttribution,
): boolean {
  return (
    CLICK_ID_FIELDS.filter((field) => Boolean(attribution[field])).length === 1
  );
}

function hasIncomingClickIdentifierField(search: string): boolean {
  const incoming = new URLSearchParams(search);
  return CLICK_ID_FIELDS.some((field) => incoming.has(field));
}

function sanitizeAttribution(candidate: unknown): WeightLossAttribution {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {};
  }
  const input = candidate as Record<string, unknown>;
  const approved: WeightLossAttribution = {};
  for (const field of APPROVED_FIELDS) {
    const value = approvedValue(field, input[field]);
    if (value) approved[field] = value;
  }
  return hasExactlyOneClickIdentifier(approved) ? approved : {};
}

export function parseWeightLossAttribution(
  search: string,
): WeightLossAttribution {
  const incoming = new URLSearchParams(search);
  const approved: WeightLossAttribution = {};

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

/** Current valid attribution replaces, rather than merges with, a prior touch. */
export function resolveWeightLossAttribution(
  search: string,
  storage: WeightLossAttributionSessionStorage | null,
): WeightLossAttribution {
  const incoming = parseWeightLossAttribution(search);
  if (Object.keys(incoming).length > 0) {
    try {
      storage?.setItem(
        WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY,
        JSON.stringify(incoming),
      );
    } catch {
      // The current page remains available as a consent-gated retry source.
    }
    return incoming;
  }
  if (hasIncomingClickIdentifierField(search)) {
    try {
      storage?.removeItem(WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY);
    } catch {
      // The conflicting current URL still remains the authoritative no-touch.
    }
    return {};
  }

  try {
    const stored = storage?.getItem(WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY);
    return stored ? sanitizeAttribution(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
}

export function stripWeightLossAttributionFromPageHref(href: string): string {
  let pageUrl: URL;
  try {
    pageUrl = new URL(href);
  } catch {
    return href;
  }
  for (const field of APPROVED_FIELDS) pageUrl.searchParams.delete(field);
  for (const alias of Object.keys(CAMPAIGN_ID_ALIASES)) {
    pageUrl.searchParams.delete(alias);
  }
  for (const field of LEGACY_UNSAFE_FIELDS) pageUrl.searchParams.delete(field);
  return pageUrl.toString();
}

export function inferWeightLossAttributionLocation(
  pathname: string,
): WeightLossAttributionLocation {
  const normalized = `/${pathname}`.replace(/\/{2,}/g, "/").toLowerCase();
  if (
    normalized === "/medical-weight-loss-napa" ||
    normalized.startsWith("/medical-weight-loss-napa/")
  ) {
    return "napa";
  }
  if (
    normalized === "/medical-weight-loss-vacaville" ||
    normalized.startsWith("/medical-weight-loss-vacaville/")
  ) {
    return "vacaville";
  }
  return "unknown";
}

/**
 * Capture approved attribution only after the production CMP grants it. This
 * acknowledgement is not a booking, appointment, or conversion event.
 */
export async function postWeightLossAttribution(args: {
  attribution: WeightLossAttribution;
  consentState: AttributionConsentState;
  marketingOrigin: string;
  pathname: string;
  fetchImpl: WeightLossAttributionFetch;
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
  const attribution = sanitizeAttribution(args.attribution);
  const predecessor = args.revocationPredecessorHandle;
  if (
    origin !== WEIGHT_LOSS_MARKETING_ORIGIN ||
    Object.keys(attribution).length === 0 ||
    !isAttributionRevocationHandle(args.revocationHandle) ||
    (predecessor != null &&
      (!isAttributionRevocationHandle(predecessor) ||
        predecessor === args.revocationHandle))
  ) {
    return false;
  }
  try {
    const response = await args.fetchImpl(WEIGHT_LOSS_ATTRIBUTION_ENDPOINT, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      signal: args.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: inferWeightLossAttributionLocation(args.pathname),
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
export async function revokeWeightLossAttribution(args: {
  marketingOrigin: string;
  pathname: string;
  fetchImpl: WeightLossAttributionFetch;
  revocationHandle?: string | null;
  signal?: AbortSignal;
}): Promise<boolean> {
  let origin: string;
  try {
    origin = new URL(args.marketingOrigin).origin;
  } catch {
    return false;
  }
  if (origin !== WEIGHT_LOSS_MARKETING_ORIGIN) return false;
  if (
    args.revocationHandle != null &&
    !isAttributionRevocationHandle(args.revocationHandle)
  ) {
    return false;
  }

  try {
    const response = await args.fetchImpl(WEIGHT_LOSS_ATTRIBUTION_ENDPOINT, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      signal: args.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: inferWeightLossAttributionLocation(args.pathname),
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
