import { describe, expect, it } from "vitest";
import {
  ATTRIBUTION_REVOCATION_HANDLE_COOKIE,
  ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE,
  ensureAttributionRevocationHandle,
  isAttributionRevocationHandle,
  readAttributionRevocationHandle,
  rotateAttributionRevocationHandle,
  type AttributionRandomSource,
} from "./attribution-revocation-handle";

class NoopCookieStore {
  get cookie() { return ""; }
  set cookie(_value: string) {}
}

class RejectingCookieStore {
  get cookie() { return ""; }
  set cookie(_value: string) { throw new Error("cookie blocked"); }
}

class MismatchedCookieStore {
  private wrote = false;
  get cookie() {
    return this.wrote
      ? `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=rvh_${"m".repeat(43)}`
      : "";
  }
  set cookie(_value: string) { this.wrote = true; }
}

const ZERO_RANDOM: AttributionRandomSource = {
  getRandomValues(bytes) {
    bytes.fill(0);
    return bytes;
  },
};

describe("opaque attribution revocation handle", () => {
  it("writes the exact high-entropy handle contract on both parent domains", () => {
    for (const [hostname, domain] of [
      ["rellaweightloss.com", ".rellaweightloss.com"],
      ["experiencerella.com", ".experiencerella.com"],
      ["www.experiencerella.com", ".experiencerella.com"],
    ] as const) {
      const cookieStore = { cookie: "" };
      const handle = ensureAttributionRevocationHandle(
        hostname,
        cookieStore,
        ZERO_RANDOM,
      );
      expect(handle).toBe(`rvh_${"A".repeat(43)}`);
      expect(cookieStore.cookie).toBe(
        `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${handle}; Domain=${domain}; ` +
          `Path=/; Max-Age=${ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE}; Secure; ` +
          "SameSite=Lax",
      );
    }
  });

  it("reuses only a valid existing handle and fails closed off production hosts", () => {
    const handle = `rvh_${"z".repeat(43)}`;
    const existing = { cookie: `other=1; ${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${handle}` };
    expect(ensureAttributionRevocationHandle(
      "experiencerella.com",
      existing,
      { getRandomValues: () => { throw new Error("must not regenerate"); } },
    )).toBe(handle);
    expect(readAttributionRevocationHandle(existing.cookie)).toBe(handle);
    expect(existing.cookie).toContain(
      `Max-Age=${ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE}`,
    );
    expect(isAttributionRevocationHandle("rvh_short")).toBe(false);
    expect(ensureAttributionRevocationHandle(
      "preview.vercel.app",
      { cookie: "" },
      ZERO_RANDOM,
    )).toBeNull();
  });

  it("fails closed when a generated cookie cannot be read back exactly", () => {
    for (const cookieStore of [
      new NoopCookieStore(),
      new RejectingCookieStore(),
      new MismatchedCookieStore(),
    ]) {
      expect(ensureAttributionRevocationHandle(
        "rellaweightloss.com",
        cookieStore,
        ZERO_RANDOM,
      )).toBeNull();
    }
  });

  it("replaces a retained handle with a fresh verified handle after denial", () => {
    const firstHandle = `rvh_${"1".repeat(43)}`;
    const cookieStore = {
      cookie: `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${firstHandle}`,
    };
    const rotation = rotateAttributionRevocationHandle(
      "rellaweightloss.com",
      cookieStore,
      {
        getRandomValues(bytes) {
          bytes.fill(1);
          return bytes;
        },
      },
    );

    expect(rotation).not.toBeNull();
    expect(rotation?.revocationHandle).not.toBe(firstHandle);
    expect(rotation?.revocationPredecessorHandle).toBe(firstHandle);
    expect(readAttributionRevocationHandle(cookieStore.cookie)).toBe(
      rotation?.revocationHandle,
    );
    expect(cookieStore.cookie).toContain(
      `Max-Age=${ATTRIBUTION_REVOCATION_HANDLE_MAX_AGE}`,
    );
  });

  it("fails closed when rotation repeats or cannot verify a new cookie", () => {
    const repeatedHandle = `rvh_${"A".repeat(43)}`;
    const repeatedStore = {
      cookie: `${ATTRIBUTION_REVOCATION_HANDLE_COOKIE}=${repeatedHandle}`,
    };
    expect(rotateAttributionRevocationHandle(
      "rellaweightloss.com",
      repeatedStore,
      ZERO_RANDOM,
    )).toBeNull();
    expect(readAttributionRevocationHandle(repeatedStore.cookie)).toBe(
      repeatedHandle,
    );

    for (const cookieStore of [
      new NoopCookieStore(),
      new RejectingCookieStore(),
      new MismatchedCookieStore(),
    ]) {
      expect(rotateAttributionRevocationHandle(
        "rellaweightloss.com",
        cookieStore,
        ZERO_RANDOM,
      )).toBeNull();
    }
  });
});
