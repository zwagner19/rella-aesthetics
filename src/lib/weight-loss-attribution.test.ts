import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  inferWeightLossAttributionLocation,
  parseWeightLossAttribution,
  postWeightLossAttribution,
  resolveWeightLossAttribution,
  revokeWeightLossAttribution,
  stripWeightLossAttributionFromPageHref,
  WEIGHT_LOSS_ATTRIBUTION_ENDPOINT,
  type WeightLossAttributionFetch,
  type WeightLossAttributionSessionStorage,
} from "./weight-loss-attribution";

class MemorySessionStorage implements WeightLossAttributionSessionStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const REVOCATION_HANDLE = `rvh_${"w".repeat(43)}`;
const PREDECESSOR_HANDLE = `rvh_${"p".repeat(43)}`;

describe("weight-loss paid attribution allowlist", () => {
  it("keeps only click IDs and numeric campaign IDs", () => {
    expect(parseWeightLossAttribution(
      "?gclid=Cj0K.real-1&utm_source=google&utm_medium=cpc" +
        "&utm_campaign=vacaville-weight-loss&campaignid=123&adgroupid=456" +
        "&keyword=medical+weight+loss&matchtype=e&device=m&network=g",
    )).toEqual({
      gclid: "Cj0K.real-1",
      campaignid: "123",
      adgroupid: "456",
    });
  });

  it("normalizes approved ValueTrack aliases", () => {
    expect(parseWeightLossAttribution(
      "?gclid=click&gad_campaignid=123&gad_adgroupid=456&gad_keyword=weight+loss",
    )).toEqual({ gclid: "click", campaignid: "123", adgroupid: "456" });
  });

  it("rejects contact-like click IDs and nonnumeric campaign IDs", () => {
    expect(parseWeightLossAttribution(
      "?gclid=person@example.com&campaignid=napa-weight-loss" +
        "&adgroupid=123abc&email=person@example.com&diagnosis=test",
    )).toEqual({});
  });

  it("drops campaign IDs when no validated click identifier is present", () => {
    expect(parseWeightLossAttribution(
      "?campaignid=123&adgroupid=456",
    )).toEqual({});
  });

  it("fails closed when more than one click-ID class is present", () => {
    expect(parseWeightLossAttribution(
      "?gclid=desktop-click&gbraid=ios-click&campaignid=123",
    )).toEqual({});

    const storage = new MemorySessionStorage();
    resolveWeightLossAttribution("?gclid=older-click", storage);
    expect(resolveWeightLossAttribution(
      "?gclid=desktop-click&wbraid=ios-click",
      storage,
    )).toEqual({});
    expect(resolveWeightLossAttribution("", storage)).toEqual({});
  });

  it("survives same-session browsing and replaces an old touch atomically", () => {
    const storage = new MemorySessionStorage();
    resolveWeightLossAttribution("?gclid=old&utm_campaign=old&campaignid=123", storage);
    expect(resolveWeightLossAttribution("", storage)).toEqual({
      gclid: "old",
      campaignid: "123",
    });
    expect(resolveWeightLossAttribution("?wbraid=new&utm_source=google&adgroupid=456", storage)).toEqual({
      wbraid: "new",
      adgroupid: "456",
    });
  });

  it("strips current and legacy page attribution while preserving unrelated fields", () => {
    const page = new URL(stripWeightLossAttributionFromPageHref(
      "https://rellaweightloss.com/?gclid=click&gclsrc=aw.ds&utm_source=google&campaignid=123&ref=clinic",
    ));
    expect(page.searchParams.get("gclid")).toBeNull();
    expect(page.searchParams.get("gclsrc")).toBeNull();
    expect(page.searchParams.get("utm_source")).toBeNull();
    expect(page.searchParams.get("campaignid")).toBeNull();
    expect(page.searchParams.get("ref")).toBe("clinic");
  });
});

describe("consent-gated first-party capture", () => {
  it("infers location only from the two historical city paths", () => {
    expect(inferWeightLossAttributionLocation("/medical-weight-loss-napa/")).toBe("napa");
    expect(inferWeightLossAttributionLocation("/medical-weight-loss-vacaville")).toBe("vacaville");
    expect(inferWeightLossAttributionLocation("/")).toBe("unknown");
  });

  it("fails closed unless the explicit adapter state is granted", async () => {
    for (const consentState of ["unknown", "denied"] as const) {
      const fetchImpl = vi.fn<WeightLossAttributionFetch>();
      expect(await postWeightLossAttribution({
        attribution: { gclid: "paid-click" },
        consentState,
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
      })).toBe(false);
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it("posts the explicit grant only from the exact production origin", async () => {
    const fetchImpl = vi.fn<WeightLossAttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        attributionId: "ratt_ack",
        consentAdUserData: "granted",
        clickIdentifiersStored: true,
      }),
    }));
    expect(await postWeightLossAttribution({
      attribution: { gclid: "paid-click", campaignid: "123" },
      consentState: "granted",
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/medical-weight-loss-napa/",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe(WEIGHT_LOSS_ATTRIBUTION_ENDPOINT);
    expect(requestInit).toMatchObject({
      method: "POST",
      credentials: "include",
      keepalive: true,
    });
    expect(JSON.parse(String(requestInit.body))).toEqual({
      location: "napa",
      consentAdUserData: "granted",
      revocationHandle: REVOCATION_HANDLE,
      gclid: "paid-click",
      campaignid: "123",
    });

    const previewFetch = vi.fn<WeightLossAttributionFetch>();
    expect(await postWeightLossAttribution({
      attribution: { gclid: "preview-click" },
      consentState: "granted",
      marketingOrigin: "https://rellaweightloss.com.evil.example",
      pathname: "/",
      fetchImpl: previewFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(previewFetch).not.toHaveBeenCalled();
  });

  it("does not acknowledge a click ID until durable storage is explicit", async () => {
    for (const result of [
      { ok: true, attributionId: "ratt_ack" },
      { ok: true, attributionId: "ratt_ack", clickIdentifiersStored: false },
      { ok: true, attributionId: "ratt_ack", clickIdentifiersStored: true },
    ]) {
      const fetchImpl = vi.fn<WeightLossAttributionFetch>(async () => ({
        ok: true,
        json: async () => result,
      }));
      expect(await postWeightLossAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
      })).toBe(false);
    }
  });

  it("retains post-denial predecessor lineage across capture retries", async () => {
    let attempt = 0;
    const fetchImpl = vi.fn<WeightLossAttributionFetch>(async () => {
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
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/medical-weight-loss-napa/",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
      revocationPredecessorHandle: PREDECESSOR_HANDLE,
    };

    expect(await postWeightLossAttribution(request)).toBe(false);
    expect(await postWeightLossAttribution(request)).toBe(true);
    const bodies = fetchImpl.mock.calls.map(([, init]) => (
      JSON.parse(String(init.body))
    ));
    expect(bodies).toEqual([
      {
        location: "napa",
        consentAdUserData: "granted",
        revocationHandle: REVOCATION_HANDLE,
        revocationPredecessorHandle: PREDECESSOR_HANDLE,
        gclid: "paid-click",
      },
      {
        location: "napa",
        consentAdUserData: "granted",
        revocationHandle: REVOCATION_HANDLE,
        revocationPredecessorHandle: PREDECESSOR_HANDLE,
        gclid: "paid-click",
      },
    ]);
  });

  it("rejects malformed or self-referential predecessor lineage", async () => {
    for (const revocationPredecessorHandle of [
      "not-a-handle",
      REVOCATION_HANDLE,
    ]) {
      const fetchImpl = vi.fn<WeightLossAttributionFetch>();
      expect(await postWeightLossAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/medical-weight-loss-napa/",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
        revocationPredecessorHandle,
      })).toBe(false);
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it("does not post numeric campaign IDs without a click identifier", async () => {
    const fetchImpl = vi.fn<WeightLossAttributionFetch>();
    expect(await postWeightLossAttribution({
      attribution: { campaignid: "123", adgroupid: "456" },
      consentState: "granted",
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not post conflicting click-ID classes", async () => {
    const fetchImpl = vi.fn<WeightLossAttributionFetch>();
    expect(await postWeightLossAttribution({
      attribution: { gclid: "desktop-click", wbraid: "ios-click" },
      consentState: "granted",
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/medical-weight-loss-napa/",
      fetchImpl,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts an attribution-free denial and accepts either revoked boolean", async () => {
    for (const revoked of [true, false]) {
      const fetchImpl = vi.fn<WeightLossAttributionFetch>(async () => ({
        ok: true,
        json: async () => ({
          ok: true,
          consentAdUserData: "denied",
          revoked,
          clickIdentifiersStored: false,
          revocationFinalized: true,
        }),
      }));
      expect(await revokeWeightLossAttribution({
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/medical-weight-loss-vacaville/",
        fetchImpl,
      })).toBe(true);
      const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
      expect(requestUrl).toBe(WEIGHT_LOSS_ATTRIBUTION_ENDPOINT);
      expect(JSON.parse(String(requestInit.body))).toEqual({
        location: "vacaville",
        consentAdUserData: "denied",
      });
    }
  });

  it("requires terminal tombstone proof and forwards revoke cancellation", async () => {
    const controller = new AbortController();
    for (const revocationFinalized of [undefined, false]) {
      const fetchImpl = vi.fn<WeightLossAttributionFetch>(async () => ({
        ok: true,
        json: async () => ({
          ok: true,
          consentAdUserData: "denied",
          revoked: false,
          clickIdentifiersStored: false,
          revocationFinalized,
        }),
      }));
      expect(await revokeWeightLossAttribution({
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/medical-weight-loss-napa/",
        fetchImpl,
        revocationHandle: REVOCATION_HANDLE,
        signal: controller.signal,
      })).toBe(false);
      expect(fetchImpl.mock.calls[0][1].signal).toBe(controller.signal);
    }
  });

  it("sends the opaque handle on denial after a committed grant loses its ack", async () => {
    const lostAckFetch = vi.fn<WeightLossAttributionFetch>(async () => ({
      ok: false,
      json: async () => ({}),
    }));
    expect(await postWeightLossAttribution({
      attribution: { gclid: "paid-click" },
      consentState: "granted",
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/medical-weight-loss-napa/",
      fetchImpl: lostAckFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(false);

    const denialFetch = vi.fn<WeightLossAttributionFetch>(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        consentAdUserData: "denied",
        revoked: true,
        clickIdentifiersStored: false,
        revocationFinalized: true,
      }),
    }));
    expect(await revokeWeightLossAttribution({
      marketingOrigin: "https://rellaweightloss.com",
      pathname: "/medical-weight-loss-napa/",
      fetchImpl: denialFetch,
      revocationHandle: REVOCATION_HANDLE,
    })).toBe(true);
    expect(JSON.parse(String(denialFetch.mock.calls[0][1].body))).toEqual({
      location: "napa",
      consentAdUserData: "denied",
      revocationHandle: REVOCATION_HANDLE,
    });
  });
});

describe("weight-loss attribution wiring", () => {
  it("mounts one tag-free handoff and keeps only the global intent writer", () => {
    const site = readFileSync(join(__dirname, "..", "app", "(site)", "layout.tsx"), "utf8");
    const page = readFileSync(join(
      __dirname,
      "..",
      "components",
      "pages",
      "WeightLossServicePage.tsx",
    ), "utf8");
    const handoff = readFileSync(join(
      __dirname,
      "..",
      "components",
      "integrations",
      "WeightLossAttributionHandoff.tsx",
    ), "utf8");

    expect(site.match(/<WeightLossAttributionHandoff \/>/g)).toHaveLength(1);
    expect(site.match(/<ConversionTracker \/>/g)).toHaveLength(1);
    expect(page).not.toContain("WeightLossConversionTracker");
    expect(existsSync(join(
      __dirname,
      "..",
      "components",
      "integrations",
      "WeightLossConversionTracker.tsx",
    ))).toBe(false);
    expect(handoff).toContain("__rellaWeightLossAttributionConsent");
    expect(handoff).toContain("serverAcknowledged");
    expect(handoff).toContain("revokeWeightLossAttribution");
    expect(handoff).toContain("captureGeneration");
    expect(handoff).toContain("writeAttributionDenialSentinel");
    expect(handoff).toContain("clearAttributionDenialSentinel");
    expect(handoff).toContain("isCurrentAttributionCaptureAcknowledgement");
    expect(handoff).toContain("createAbortableAttributionCapture");
    expect(handoff).toContain("createAttributionRevocationRetry");
    expect(handoff).toContain("captureAttempt?.abort()");
    expect(handoff).toContain("revocation.dispose()");
    expect(handoff).toContain("ensureAttributionRevocationHandle");
    expect(handoff).toContain("readAttributionRevocationHandle");
    expect(handoff).toContain("rotateAttributionRevocationHandle");
    expect(handoff).toContain("postDenialRotation");
    expect(handoff).toContain("retainedRevocationHandle");
    expect(handoff).toContain("preflightHandle");
    expect(handoff).toContain("revocationPredecessorHandle");
    expect(handoff).toContain(
      "readAttributionRevocationHandle(document.cookie) !== revocationHandle",
    );
    expect(handoff).toContain("getRevocationHandle");
    expect(handoff).not.toContain("clearAttributionRevocationHandleIfCurrent");
    expect(handoff).not.toContain("finalizeAcknowledgement");
    const denialBranch = handoff.slice(
      handoff.indexOf("if (transition.revoke)"),
      handoff.indexOf("const denialSentinelPresent"),
    );
    expect(denialBranch).not.toContain("ensureAttributionRevocationHandle");
    const preflightHandle = handoff.indexOf("const preflightHandle");
    const readAttribution = handoff.indexOf("const attribution = currentAttribution()");
    expect(preflightHandle).toBeGreaterThan(-1);
    expect(readAttribution).toBeGreaterThan(preflightHandle);
    const ensureHandle = handoff.indexOf(
      "const revocationHandle = rotation?.revocationHandle",
    );
    const rejectMissingHandle = handoff.indexOf(
      "if (!revocationHandle) return",
      ensureHandle,
    );
    const startCapture = handoff.indexOf(
      "createAbortableAttributionCapture",
      rejectMissingHandle,
    );
    expect(ensureHandle).toBeGreaterThan(-1);
    expect(rejectMissingHandle).toBeGreaterThan(ensureHandle);
    expect(startCapture).toBeGreaterThan(rejectMissingHandle);
    expect(handoff).toContain('window.addEventListener("online"');
    expect(handoff).toContain('document.addEventListener("visibilitychange"');
    expect(handoff).not.toMatch(/link\.href|window\.location\.assign|preventDefault/);
    expect(handoff).not.toMatch(/document\.addEventListener\(["'](?:click|pointerdown)/);
    expect(handoff).not.toContain("withWeightLossAttribution");
    expect(handoff).not.toMatch(/gtag|fbq|googletagmanager|send_to/i);
  });
});
