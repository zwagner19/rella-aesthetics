import {
  attributionDenialSentinelDomain,
  type AttributionCookieStore,
} from "./attribution-denial-sentinel";

export const ATTRIBUTION_REVOCATION_HANDLE_COOKIE =
  "rella_ad_attribution_revoke";
export const ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE = 2_592_000;
export const ATTRIBUTION_REVOCATION_HANDLE_RE =
  /^rvh_[A-Za-z0-9_-]{43}$/;

const BASE64URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export interface AttributionRandomSource {
  getRandomValues(bytes: Uint8Array): Uint8Array;
}

export interface AttributionRevocationHandleRotation {
  revocationHandle: string;
  revocationPredecessorHandle: string | null;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bits = 0;
  let buffer = 0;
  let output = "";
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      output += BASE64URL_ALPHABET[(buffer >>> bits) & 63];
      buffer &= (1 << bits) - 1;
    }
  }
  if (bits > 0) {
    output += BASE64URL_ALPHABET[(buffer << (6 - bits)) & 63];
  }
  return output;
}

export function isAttributionRevocationHandle(
  value: unknown,
): value is string {
  return (
    typeof value === "string" && ATTRIBUTION_REVOCATION_HANDLE_RE.test(value)
  );
}

export function readAttributionRevocationHandle(
  cookieHeader: string,
): string | null {
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name !== ATTRIBUTION_REVOCATION_HANDLE_COOKIE) continue;
    const value = valueParts.join("=");
    return isAttributionRevocationHandle(value) ? value : null;
  }
  return null;
}

export function ensureAttributionRevocationHandle(
  hostname: string,
  cookieStore: AttributionCookieStore,
  randomSource: AttributionRandomSource | undefined =
    globalThis.crypto as AttributionRandomSource | undefined,
): string | null {
  const domain = attributionDenialSentinelDomain(hostname);
  if (!domain) return null;

  try {
    const existing = readAttributionRevocationHandle(cookieStore.cookie);
    let handle = existing;
    if (!handle) {
      if (!randomSource) return null;
      handle = `rvh_${bytesToBase64Url(
        randomSource.getRandomValues(new Uint8Array(32)),
      )}`;
    }
    if (!isAttributionRevocationHandle(handle)) return null;
    cookieStore.cookie =
      `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${handle}; Domain=${domain}; ` +
      `Path=/; Max-Age=${ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE}; Secure; ` +
      "SameSite=Lax";
    return readAttributionRevocationHandle(cookieStore.cookie) === handle
      ? handle
      : null;
  } catch {
    return null;
  }
}

/** Return a verified successor and its tombstoned post-denial predecessor. */
export function rotateAttributionRevocationHandle(
  hostname: string,
  cookieStore: AttributionCookieStore,
  randomSource: AttributionRandomSource | undefined =
    globalThis.crypto as AttributionRandomSource | undefined,
): AttributionRevocationHandleRotation | null {
  const domain = attributionDenialSentinelDomain(hostname);
  if (!domain || !randomSource) return null;

  try {
    const existing = readAttributionRevocationHandle(cookieStore.cookie);
    const handle = `rvh_${bytesToBase64Url(
      randomSource.getRandomValues(new Uint8Array(32)),
    )}`;
    if (!isAttributionRevocationHandle(handle) || handle === existing) {
      return null;
    }
    cookieStore.cookie =
      `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${handle}; Domain=${domain}; ` +
      `Path=/; Max-Age=${ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE}; Secure; ` +
      "SameSite=Lax";
    return readAttributionRevocationHandle(cookieStore.cookie) === handle
      ? {
          revocationHandle: handle,
          revocationPredecessorHandle: existing,
        }
      : null;
  } catch {
    return null;
  }
}
