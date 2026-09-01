import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  AESTHETICS_ATTRIBUTION_ENDPOINT,
  AESTHETICS_WWW_MARKETING_ORIGIN,
  inferAestheticsLocation,
  isGeneralAestheticsHost,
  parseAestheticsAttribution,
  postAestheticsAttribution,
  resolveAestheticsAttribution,
  revokeAestheticsAttribution,
  stripAestheticsAttributionFromPageHref,
  type AttributionFetch,
  type AttributionSessionStorage,
} from "./aesthetics-attribution";

class MemorySessionStorage implements AttributionSessionStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const REVOCATION_HANDLE = `rvh_${"a".repeat(43)}`;
const PREDECESSOR_HANDLE = `rvh_${"p".repeat(43)}`;

const PAID_SEARCH =
  "?gclid=Cj0K.real-1&gclsrc=aw.ds" +
  "&utm_source=google&utm_medium=cpc&utm_campaign=napa_botox" +
  "&utm_content=responsive_ad&utm_term=botox%2Bnapa" +
  "&gad_campaignid=123&gad_adgroupid=456&gad_keyword=botox" +
  "&gad_matchtype=e&gad_device=m&gad_network=g";

describe("general-aesthetics attribution allowlist", () => {
  it("keeps only click IDs and numeric campaign IDs", () => {
    expect(parseAestheticsAttribution(
      `${PAID_SEARCH}&email=patient@example.com&diagnosis=private`,
    )).toEqual({
      gclid: "Cj0K.real-1",
      campaignid: "123", adgroupid: "456",
    });
  });

  it("fails closed when more than one click-ID class is present", () => {
    expect(parseAestheticsAttribution(
      "?gclid=desktop-click&gbraid=ios-click&campaignid=123",
    )).toEqual({});

    const storage = new MemorySessionStorage();
    resolveAestheticsAttribution("?gclid=older-click", storage);
    expect(resolveAestheticsAttribution(
      "?gbraid=ios-click&wbraid=web-click",
      storage,
    )).toEqual({});
    expect(resolveAestheticsAttribution("", storage)).toEqual({});
  });

  it("rejects contact-like click IDs and nonnumeric campaign IDs", () => {
    expect(parseAestheticsAttribution(
      "?gclid=patient@example.com&campaignid=napa&adgroupid=123abc&answer=yes",
    )).toEqual({});
  });

  it("drops campaign IDs when no validated click identifier is present", () => {
    expect(parseAestheticsAttribution(
      "?campaignid=123&adgroupid=456",
    )).toEqual({});
  });
});

describe("session fallback and page cleanup", () => {
  it("survives internal browsing and a new valid touch replaces the fallback", () => {
    const storage = new MemorySessionStorage();
    resolveAestheticsAttribution("?gclid=old&utm_campaign=old&campaignid=123", storage);
    expect(resolveAestheticsAttribution("", storage)).toEqual({
      gclid: "old", campaignid: "123",
    });
    expect(resolveAestheticsAttribution("?wbraid=new&utm_source=google&adgroupid=456", storage)).toEqual({
      wbraid: "new", adgroupid: "456",
    });
  });

  it("cleans current and legacy page attribution while preserving unrelated fields", () => {
    const cleanPage = new URL(stripAestheticsAttributionFromPageHref(
      "https://experiencerella.com/napa/botox?gclid=click&gclsrc=aw.ds&utm_source=google&campaignid=123&ref=clinic",
    ));
    expect(cleanPage.searchParams.get("gclid")).toBeNull();
    expect(cleanPage.searchParams.get("gclsrc")).toBeNull();
    expect(cleanPage.searchParams.get("utm_source")).toBeNull();
    expect(cleanPage.searchParams.get("campaignid")).toBeNull();
    expect(cleanPage.searchParams.get("ref")).toBe("clinic");
  });
});

describe("first-party capture", () => {
  it("infers only known location-owned paths", () => {
    expect(inferAestheticsLocation("/napa/botox")).toBe("napa");
    expect(inferAestheticsLocation("/locations/vacaville/")).toBe("vacaville");
    expect(inferAestheticsLocation("/services/botox")).toBe("unknown");
  });

  it("posts with credentials only from the exact production marketing origin", async () => {
    const fetchImpl = vi.fn<AttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        attributionId: "ratt_ack",
        consentAdUserData: "granted",
        clickIdentifiersStored: true,
      }),
    }));
    expect(await postAestheticsAttribution({
      attribution: { gclid: "paid-click", campaignid: "123" },
      consentState: "granted",
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe(AESTHETICS_ATTRIBUTION_ENDPOINT);
    expect(requestInit).toMatchObject({
      method: "POST", credentials: "include", keepalive: true,
    });
    expect(JSON.parse(String(requestInit.body))).toEqual({
      location: "napa",
      consentAdUserData: "granted",
      revocationHandle: REVOCATION_HANDLE,
      gclid: "paid-click",
      campaignid: "123",
    });

    const previewFetch = vi.fn<AttributionFetch>();
    expect(await postAestheticsAttribution({
      attribution: { gclid: "preview-click" },
      consentState: "granted",
      marketingOrigin: "https://rella-preview.vercel.app",
      pathname: "/napa/botox",
      fetchImpl: previewFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(previewFetch).not.toHaveBeenCalled();
  });

  it("supports the exact www aesthetics origin without a wildcard", async () => {
    const fetchImpl = vi.fn<AttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        attributionId: "ratt_www",
        consentAdUserData: "granted",
        clickIdentifiersStored: true,
      }),
    }));
    expect(await postAestheticsAttribution({
      attribution: { gclid: "www-click" },
      consentState: "granted",
      marketingOrigin: AESTHETICS_WWW_MARKETING_ORIGIN,
      pathname: "/napa/botox",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("fails closed and requires explicit durable storage for click IDs", async () => {
    for (const consentState of ["unknown", "denied"] as const) {
      const fetchImpl = vi.fn<AttributionFetch>();
      expect(await postAestheticsAttribution({
        attribution: { gclid: "paid-click" },
        consentState,
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
      })).toBe(false);
      expect(fetchImpl).not.toHaveBeenCalled();
    }

    for (const result of [
      { ok: true, attributionId: "ratt_ack" },
      { ok: true, attributionId: "ratt_ack", clickIdentifiersStored: false },
      { ok: true, attributionId: "ratt_ack", clickIdentifiersStored: true },
    ]) {
      const fetchImpl = vi.fn<AttributionFetch>(async () => ({
        ok: true,
        json: async () => result,
      }));
      expect(await postAestheticsAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
      })).toBe(false);
    }
  });

  it("retains post-denial predecessor lineage across capture retries", async () => {
    let attempt = 0;
    const fetchImpl = vi.fn<AttributionFetch>(async () => {
      attempt += 1;
      return attempt === 1
        ? { ok: false, json: async () => ({}) }
        : {
            ok: true,
            json: async () => ({
              ok: true,
              attributionId: "ratt_retry_ack",
              consentAdUserData: "granted",
              clickIdentifiersStored: true,
            }),
          };
    });
    const request = {
      attribution: { gclid: "paid-click" },
      consentState: "granted" as const,
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
      revocationPredecessorHandle: PREDECESSOR_HANDLE,
    };

    expect(await postAestheticsAttribution(request)).toBe(false);
    expect(await postAestheticsAttribution(request)).toBe(true);
    for (const [, init] of fetchImpl.mock.calls) {
      expect(JSON.parse(String(init.body))).toEqual({
        location: "napa",
        consentAdUserData: "granted",
        revocationHandle: REVOCATION_HANDLE,
        revocationPredecessorHandle: PREDECESSOR_HANDLE,
        gclid: "paid-click",
      });
    }
  });

  it("rejects malformed or self-referential predecessor lineage", async () => {
    for (const revocationPredecessorHandle of [
      "not-a-handle",
      REVOCATION_HANDLE,
    ]) {
      const fetchImpl = vi.fn<AttributionFetch>();
      expect(await postAestheticsAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
        revocationPredecessorHandle,
      })).toBe(false);
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it("does not post numeric campaign IDs without a click identifier", async () => {
    const fetchImpl = vi.fn<AttributionFetch>();
    expect(await postAestheticsAttribution({
      attribution: { campaignid: "123", adgroupid: "456" },
      consentState: "granted",
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not post conflicting click-ID classes", async () => {
    const fetchImpl = vi.fn<AttributionFetch>();
    expect(await postAestheticsAttribution({
      attribution: { gclid: "desktop-click", gbraid: "ios-click" },
      consentState: "granted",
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts an attribution-free denial and accepts either revoked boolean", async () => {
    for (const revoked of [true, false]) {
      const fetchImpl = vi.fn<AttributionFetch>(async () => ({
        ok: true,
        json: async () => ({
          ok: true,
          consentAdUserData: "denied",
          revoked,
          clickIdentifiersStored: false,
          revocationFinalized: true,
        }),
      }));
      expect(await revokeAestheticsAttribution({
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
      })).toBe(true);
      const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
      expect(requestUrl).toBe(AESTHETICS_ATTRIBUTION_ENDPOINT);
      expect(JSON.parse(String(requestInit.body))).toEqual({
        location: "napa",
        consentAdUserData: "denied",
      });
    }
  });

  it("requires terminal tombstone proof and forwards revoke cancellation", async () => {
    const controller = new AbortController();
    for (const revocationFinalized of [undefined, false]) {
      const fetchImpl = vi.fn<AttributionFetch>(async () => ({
        ok: true,
        json: async () => ({
          ok: true,
          consentAdUserData: "denied",
          revoked: false,
          clickIdentifiersStored: false,
          revocationFinalized,
        }),
      }));
      expect(await revokeAestheticsAttribution({
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
        signal: controller.signal,
      })).toBe(false);
      expect(fetchImpl.mock.calls[0][1].signal).toBe(controller.signal);
    }
  });

  it("revokes from the exact www aesthetics origin", async () => {
    const fetchImpl = vi.fn<AttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        consentAdUserData: "denied",
        revoked: true,
        clickIdentifiersStored: false,
        revocationFinalized: true,
      }),
    }));
    expect(await revokeAestheticsAttribution({
      marketingOrigin: AESTHETICS_WWW_MARKETING_ORIGIN,
      pathname: "/napa/botox",
      fetchImpl,
    })).toBe(true);
  });

  it("sends the opaque handle on denial after a committed grant loses its ack", async () => {
    const lostAckFetch = vi.fn<AttributionFetch>(async () => ({
      ok: false,
      json: async () => ({}),
    }));
    expect(await postAestheticsAttribution({
      attribution: { gclid: "paid-click" },
      consentState: "granted",
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl: lostAckFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);

    const denialFetch = vi.fn<AttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        consentAdUserData: "denied",
        revoked: true,
        clickIdentifiersStored: false,
        revocationFinalized: true,
      }),
    }));
    expect(await revokeAestheticsAttribution({
      marketingOrigin: "https://experiencerella.com",
      pathname: "/napa/botox",
      fetchImpl: denialFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(true);
    expect(JSON.parse(String(denialFetch.mock.calls[0][1].body))).toEqual({
      location: "napa",
      consentAdUserData: "denied",
      revocationHandle: REVOCATION_HANDLE,
    });
  });

  it("keeps the weight-loss host completely excluded", () => {
    expect(isGeneralAestheticsHost("rellaweightloss.com")).toBe(false);
    expect(isGeneralAestheticsHost("www.rellaweightloss.com")).toBe(false);
    expect(isGeneralAestheticsHost("weightloss.experiencerella.com")).toBe(false);
    expect(isGeneralAestheticsHost("rella-aesthetics.vercel.app")).toBe(false);
    expect(isGeneralAestheticsHost("experiencerella.com")).toBe(true);
    expect(isGeneralAestheticsHost("www.experiencerella.com")).toBe(true);
  });
});

describe("application wiring", () => {
  it("mounts once, clears only after acknowledgement, and never decorates booking links", () => {
    const site = readFileSync(join(__dirname, "..", "app", "(site)", "layout.tsx"), "utf8");
    const component = readFileSync(join(
      __dirname, "..", "components", "integrations",
      "AestheticsAttributionHandoff.tsx",
    ), "utf8");
    expect(site.match(/<AestheticsAttributionHandoff \/>/g)).toHaveLength(1);
    expect(component).toContain("window.sessionStorage");
    expect(component).not.toContain("window.localStorage");
    expect(component).toContain("serverAcknowledged");
    expect(component).toContain("__rellaAestheticsAttributionConsent");
    expect(component).toContain("AESTHETICS_ATTRIBUTION_CONSENT_EVENT");
    expect(component).toContain("removeItem(AESTHETICS_ATTRIBUTION_STORAGE_KEY)");
    expect(component).toContain("revokeAestheticsAttribution");
    expect(component).toContain("captureGeneration");
    expect(component).toContain("writeAttributionDenialSentinel");
    expect(component).toContain("clearAttributionDenialSentinel");
    expect(component).toContain("isCurrentAttributionCaptureAcknowledgement");
    expect(component).toContain("createAbortableAttributionCapture");
    expect(component).toContain("createAttributionRevocationRetry");
    expect(component).toContain("captureAttempt?.abort()");
    expect(component).toContain("revocation.dispose()");
    expect(component).toContain("ensureAttributionRevocationHandle");
    expect(component).toContain("readAttributionRevocationHandle");
    expect(component).toContain("rotateAttributionRevocationHandle");
    expect(component).toContain("postDenialRotation");
    expect(component).toContain("retainedRevocationHandle");
    expect(component).toContain("preflightHandle");
    expect(component).toContain("revocationPredecessorHandle");
    expect(component).toContain(
      "readAttributionRevocationHandle(document.cookie) !== revocationHandle",
    );
    expect(component).toContain("getRevocationHandle");
    expect(component).not.toContain("clearAttributionRevocationHandleIfCurrent");
    expect(component).not.toContain("finalizeAcknowledgement");
    const denialBranch = component.slice(
      component.indexOf("if (transition.revoke)"),
      component.indexOf("const denialSentinelPresent"),
    );
    expect(denialBranch).not.toContain("ensureAttributionRevocationHandle");
    const preflightHandle = component.indexOf("const preflightHandle");
    const readAttribution = component.indexOf("const attribution = currentAttribution()");
    expect(preflightHandle).toBeGreaterThan(-1);
    expect(readAttribution).toBeGreaterThan(preflightHandle);
    const ensureHandle = component.indexOf(
      "const revocationHandle = rotation?.revocationHandle",
    );
    const rejectMissingHandle = component.indexOf(
      "if (!revocationHandle) return",
      ensureHandle,
    );
    const startCapture = component.indexOf(
      "createAbortableAttributionCapture",
      rejectMissingHandle,
    );
    expect(ensureHandle).toBeGreaterThan(-1);
    expect(rejectMissingHandle).toBeGreaterThan(ensureHandle);
    expect(startCapture).toBeGreaterThan(rejectMissingHandle);
    expect(component).toContain('window.addEventListener("online"');
    expect(component).toContain('document.addEventListener("visibilitychange"');
    expect(component).not.toMatch(/link\.href|window\.location\.assign|preventDefault/);
    expect(component).not.toMatch(/document\.addEventListener\(["'](?:click|pointerdown)/);
    expect(component).not.toContain("withAestheticsAttribution");
  });

  it("mounts a separate weight-loss handoff while the aesthetics guard stays exact", () => {
    const site = readFileSync(join(__dirname, "..", "app", "(site)", "layout.tsx"), "utf8");
    expect(site.match(/<WeightLossAttributionHandoff \/>/g)).toHaveLength(1);
    expect(site.match(/<AestheticsAttributionHandoff \/>/g)).toHaveLength(1);
  });
});
