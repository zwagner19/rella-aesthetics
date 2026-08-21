import { describe, expect, it } from "vitest";
import {
  ATTRIBUTION_DENIAL_SENTINEL_MAX_AGE,
  ATTRIBUTION_DENIAL_SENTINEL_NAME,
  attributionDenialSentinelDomain,
  clearAttributionDenialSentinel,
  hasAttributionDenialSentinel,
  writeAttributionDenialSentinel,
} from "./attribution-denial-sentinel";

describe("deny-only parent-domain attribution sentinel", () => {
  it("maps only exact production marketing hosts to fixed parent domains", () => {
    expect(attributionDenialSentinelDomain("rellaweightloss.com")).toBe(
      ".rellaweightloss.com",
    );
    expect(attributionDenialSentinelDomain("experiencerella.com")).toBe(
      ".experiencerella.com",
    );
    expect(attributionDenialSentinelDomain("www.experiencerella.com")).toBe(
      ".experiencerella.com",
    );
    expect(attributionDenialSentinelDomain("www.rellaweightloss.com")).toBeNull();
    expect(attributionDenialSentinelDomain("rella-preview.vercel.app")).toBeNull();
  });

  it("writes the exact bounded deny-only cookie synchronously", () => {
    for (const [hostname, domain] of [
      ["rellaweightloss.com", ".rellaweightloss.com"],
      ["experiencerella.com", ".experiencerella.com"],
      ["www.experiencerella.com", ".experiencerella.com"],
    ] as const) {
      const cookieStore = { cookie: "" };
      expect(writeAttributionDenialSentinel(hostname, cookieStore)).toBe(true);
      expect(cookieStore.cookie).toBe(
        `${ATTRIBUTION_DENIAL_SENTINEL_NAME}=1; Domain=${domain}; Path=/; ` +
          `Max-Age=${ATTRIBUTION_DENIAL_SENTINEL_MAX_AGE}; Secure; SameSite=Lax`,
      );
    }
  });

  it("recognizes only the literal deny value and clears with the same scope", () => {
    expect(hasAttributionDenialSentinel(
      `other=1; ${ATTRIBUTION_DENIAL_SENTINEL_NAME}=1`,
    )).toBe(true);
    expect(hasAttributionDenialSentinel(
      `${ATTRIBUTION_DENIAL_SENTINEL_NAME}=granted`,
    )).toBe(false);

    const cookieStore = { cookie: "" };
    expect(clearAttributionDenialSentinel(
      "www.experiencerella.com",
      cookieStore,
    )).toBe(true);
    expect(cookieStore.cookie).toBe(
      `${ATTRIBUTION_DENIAL_SENTINEL_NAME}=; Domain=.experiencerella.com; ` +
        "Path=/; Max-Age=0; Secure; SameSite=Lax",
    );
  });
});
