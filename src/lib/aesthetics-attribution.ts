import { CUSTOM_BOOKING_ORIGIN } from "./booking-routes";

/**
 * Privacy-minimized attribution handoff for general aesthetics traffic.
 * Only approved click/campaign values are retained, and only for the current
 * browser session until the first-party booking server acknowledges capture.
 */

const CLICK_ID_FIELDS = ["gclid", "gbraid", "wbraid", "gclsrc"] as const;
const MARKETING_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "campaignid",
  "adgroupid",
  "keyword",
  "matchtype",
  "device",
  "network",
] as const;
const APPROVED_FIELDS = [...CLICK_ID_FIELDS, ...MARKETING_FIELDS] as const;

type MarketingField = (typeof MARKETING_FIELDS)[number];
type ApprovedField = (typeof APPROVED_FIELDS)[number];

const MARKETING_ALIASES: Readonly<Record<string, MarketingField>> = {
  gad_campaignid: "campaignid",
  gad_adgroupid: "adgroupid",
  gad_keyword: "keyword",
  gad_matchtype: "matchtype",
  gad_device: "device",
  gad_network: "network",
};

const CLICK_ID_RE = /^[\w.~-]{1,200}$/;
const MARKETING_PARAM_RE = /^[A-Za-z0-9_ .~:+/-]{1,200}$/;
const EMAIL_LIKE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_LIKE = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;

export const AESTHETICS_ATTRIBUTION_STORAGE_KEY =
  "rella_aesthetics_attribution_v1";
export const AESTHETICS_MARKETING_ORIGIN = "https://experiencerella.com";
export const AESTHETICS_ATTRIBUTION_ENDPOINT =
  `${CUSTOM_BOOKING_ORIGIN}/api/booking-v2/attribution`;
export const WEIGHT_LOSS_MARKETING_HOST = "weightloss.experiencerella.com";

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

function isApprovedMarketingValue(value: string): boolean {
  return (
    MARKETING_PARAM_RE.test(value) &&
    !EMAIL_LIKE.test(value) &&
    !PHONE_LIKE.test(value)
  );
}

function approvedValue(field: ApprovedField, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;
  return (CLICK_ID_FIELDS as readonly string[]).includes(field)
    ? CLICK_ID_RE.test(value) ? value : null
    : isApprovedMarketingValue(value) ? value : null;
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
  return approved;
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
  for (const [alias, canonical] of Object.entries(MARKETING_ALIASES)) {
    if (approved[canonical]) continue;
    const value = approvedValue(canonical, incoming.get(alias));
    if (value) approved[canonical] = value;
  }
  return approved;
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
      // Current-page query forwarding still works when storage is denied.
    }
    return incoming;
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

/** The independent weight-loss host keeps its existing handoff unchanged. */
export function isGeneralAestheticsHost(hostname: string): boolean {
  return hostname.trim().toLowerCase().replace(/\.$/, "") !== WEIGHT_LOSS_MARKETING_HOST;
}

function configuredBookingOrigin(): string | null {
  try {
    return new URL(CUSTOM_BOOKING_ORIGIN).origin;
  } catch {
    return null;
  }
}

function isBookingPath(pathname: string): boolean {
  return pathname === "/book" || pathname === "/book/" || pathname.startsWith("/book/");
}

function isAestheticsBookingDestination(
  destination: URL,
  marketingOrigin: string,
): boolean {
  const localChooser =
    destination.origin === marketingOrigin &&
    (destination.pathname === "/book" || destination.pathname === "/book/");
  const customBooking =
    destination.origin === configuredBookingOrigin() &&
    isBookingPath(destination.pathname);
  return localChooser || customBooking;
}

/** Decorate only local `/book` or the exact configured aesthetics booking app. */
export function withAestheticsAttribution(
  href: string,
  attribution: AestheticsAttribution,
  marketingOrigin: string,
): string {
  if (Object.keys(attribution).length === 0) return href;
  let currentOrigin: string;
  let destination: URL;
  try {
    currentOrigin = new URL(marketingOrigin).origin;
    destination = new URL(href, currentOrigin);
  } catch {
    return href;
  }
  if (!isAestheticsBookingDestination(destination, currentOrigin)) return href;

  for (const field of APPROVED_FIELDS) {
    const value = approvedValue(field, attribution[field]);
    if (value) destination.searchParams.set(field, value);
  }
  return destination.toString();
}

/** Remove fallback attribution from an already-decorated booking link. */
export function stripAestheticsAttributionFromBookingHref(
  href: string,
  marketingOrigin: string,
): string {
  let currentOrigin: string;
  let destination: URL;
  try {
    currentOrigin = new URL(marketingOrigin).origin;
    destination = new URL(href, currentOrigin);
  } catch {
    return href;
  }
  if (!isAestheticsBookingDestination(destination, currentOrigin)) return href;
  for (const field of APPROVED_FIELDS) destination.searchParams.delete(field);
  for (const alias of Object.keys(MARKETING_ALIASES)) {
    destination.searchParams.delete(alias);
  }
  return destination.toString();
}

/** Strip raw Google click identifiers only after the server acknowledges them. */
export function stripAestheticsClickIds(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  for (const field of CLICK_ID_FIELDS) url.searchParams.delete(field);
  return url.toString();
}

/**
 * Capture only from the exact production marketing origin. Preview deployments
 * retain the session/query fallback and never write into production capture.
 */
export async function postAestheticsAttribution(args: {
  attribution: AestheticsAttribution;
  marketingOrigin: string;
  pathname: string;
  fetchImpl: AttributionFetch;
}): Promise<boolean> {
  let origin: string;
  try {
    origin = new URL(args.marketingOrigin).origin;
  } catch {
    return false;
  }
  const attribution = sanitizeAttributionObject(args.attribution);
  if (
    origin !== AESTHETICS_MARKETING_ORIGIN ||
    Object.keys(attribution).length === 0
  ) {
    return false;
  }

  try {
    const response = await args.fetchImpl(AESTHETICS_ATTRIBUTION_ENDPOINT, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: inferAestheticsLocation(args.pathname),
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
      (result as Record<string, unknown>).attributionId,
    );
  } catch {
    return false;
  }
}
