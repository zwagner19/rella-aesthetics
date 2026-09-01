import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearAttributionDenialSentinel,
  hasAttributionDenialSentinel,
  writeAttributionDenialSentinel,
} from "./attribution-denial-sentinel";
import {
  postAestheticsAttribution,
  revokeAestheticsAttribution,
} from "./aesthetics-attribution";
import { isCurrentAttributionCaptureAcknowledgement } from "./attribution-consent";
import {
  ATTRIBUTION_CAPTURE_TIMEOUT_MS,
  createAbortableAttributionCapture,
  type AbortableAttributionCapture,
} from "./attribution-capture-request";
import { createAttributionRequestQueue } from "./attribution-request-queue";
import {
  ensureAttributionRevocationHandle,
  readAttributionRevocationHandle,
  rotateAttributionRevocationHandle,
} from "./attribution-revocation-handle";
import {
  postWeightLossAttribution,
  revokeWeightLossAttribution,
} from "./weight-loss-attribution";

class MemoryCookieStore {
  private values = new Map<string, string>();

  get cookie() {
    return [...this.values].map(([name, value]) => `${name}=${value}`).join("; ");
  }

  set cookie(serialized: string) {
    const [pair, ...attributes] = serialized.split(";");
    const [name, ...valueParts] = pair.trim().split("=");
    if (attributes.some((attribute) => attribute.trim() === "Max-Age=0")) {
      this.values.delete(name);
      return;
    }
    this.values.set(name, valueParts.join("="));
  }
}

class DenialOnlyCookieStore {
  get cookie() { return "rella_ad_user_data_denied=1"; }
  set cookie(_serialized: string) {}
}

type TestFetch = (
  input: string,
  init: RequestInit,
) => Promise<Pick<Response, "ok" | "json">>;

function randomByte(value: number) {
  return {
    getRandomValues(bytes: Uint8Array) {
      bytes.fill(value);
      return bytes;
    },
  };
}

function attributionFlows() {
  return [
    {
      hostname: "rellaweightloss.com",
      location: "napa",
      revoke: (fetchImpl: TestFetch, revocationHandle?: string | null) => (
        revokeWeightLossAttribution({
          marketingOrigin: "https://rellaweightloss.com",
          pathname: "/medical-weight-loss-napa/",
          fetchImpl,
          revocationHandle,
        })
      ),
      grant: (
        fetchImpl: TestFetch,
        revocationHandle: string,
        revocationPredecessorHandle: string,
      ) => postWeightLossAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://rellaweightloss.com",
        pathname: "/medical-weight-loss-napa/",
        fetchImpl,
        revocationHandle,
        revocationPredecessorHandle,
      }),
    },
    {
      hostname: "experiencerella.com",
      location: "napa",
      revoke: (fetchImpl: TestFetch, revocationHandle?: string | null) => (
        revokeAestheticsAttribution({
          marketingOrigin: "https://experiencerella.com",
          pathname: "/napa/botox",
          fetchImpl,
          revocationHandle,
        })
      ),
      grant: (
        fetchImpl: TestFetch,
        revocationHandle: string,
        revocationPredecessorHandle: string,
      ) => postAestheticsAttribution({
        attribution: { gclid: "paid-click" },
        consentState: "granted",
        marketingOrigin: "https://experiencerella.com",
        pathname: "/napa/botox",
        fetchImpl,
        revocationHandle,
        revocationPredecessorHandle,
      }),
    },
  ] as const;
}

function terminalDenialResponse() {
  return {
    ok: true,
    json: async () => ({
      ok: true,
      consentAdUserData: "denied",
      revoked: false,
      clickIdentifiersStored: false,
      revocationFinalized: true,
    }),
  };
}

function storedGrantResponse() {
  return {
    ok: true,
    json: async () => ({
      ok: true,
      attributionId: "ratt_lineage_ack",
      consentAdUserData: "granted",
      clickIdentifiersStored: true,
    }),
  };
}

async function flushPromises() {
  for (let index = 0; index < 10; index += 1) {
    await Promise.resolve();
  }
}

describe("abortable attribution capture", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("bounds a fetch that never settles even when it ignores abort", async () => {
    vi.useFakeTimers();
    let requestSignal: AbortSignal | undefined;
    const attempt = createAbortableAttributionCapture((signal) => {
      requestSignal = signal;
      return new Promise<boolean>(() => undefined);
    });
    await flushPromises();

    await vi.advanceTimersByTimeAsync(ATTRIBUTION_CAPTURE_TIMEOUT_MS);
    await expect(attempt.promise).resolves.toBe(false);
    expect(requestSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("retains a denied handle and rotates it before the next grant", async () => {
    vi.useFakeTimers();
    for (const hostname of [
      "rellaweightloss.com",
      "experiencerella.com",
    ]) {
      const queue = createAttributionRequestQueue();
      const cookieStore = new MemoryCookieStore();
      const order: string[] = [];
      let active = true;
      let consentState: "granted" | "denied" = "granted";
      let generation = 0;
      let attempt: AbortableAttributionCapture | undefined;
      let resolveIgnoredGrant: ((value: boolean) => void) | undefined;
      const revocationHandle = ensureAttributionRevocationHandle(
        hostname,
        cookieStore,
        {
          getRandomValues(bytes) {
            bytes.fill(7);
            return bytes;
          },
        },
      );
      expect(revocationHandle).not.toBeNull();

      const requestGeneration = generation;
      const grant = queue.enqueue(() => {
        order.push("grant:start");
        attempt = createAbortableAttributionCapture(
          () => new Promise<boolean>((resolve) => {
            resolveIgnoredGrant = resolve;
          }),
        );
        return attempt.promise;
      }).then((serverAcknowledged) => {
        if (isCurrentAttributionCaptureAcknowledgement({
          active,
          serverAcknowledged,
          consentState,
          requestGeneration,
          currentGeneration: generation,
        })) {
          clearAttributionDenialSentinel(hostname, cookieStore);
        }
      });
      await flushPromises();

      consentState = "denied";
      generation += 1;
      writeAttributionDenialSentinel(hostname, cookieStore);
      expect(attempt).toBeDefined();
      (attempt as AbortableAttributionCapture).abort();
      const nonterminalDenial = queue.enqueue(async () => {
        order.push("deny:not-final");
        return false;
      });
      await Promise.all([grant, nonterminalDenial]);
      expect(readAttributionRevocationHandle(cookieStore.cookie)).toBe(
        revocationHandle,
      );

      await queue.enqueue(async () => {
        order.push("deny:finalized");
        return true;
      });
      expect(readAttributionRevocationHandle(cookieStore.cookie)).toBe(
        revocationHandle,
      );

      // A reload during denial sees both the authoritative sentinel and H1.
      const reloadedHandle = readAttributionRevocationHandle(
        cookieStore.cookie,
      );
      expect(reloadedHandle).toBe(revocationHandle);
      expect(hasAttributionDenialSentinel(cookieStore.cookie)).toBe(true);

      consentState = "granted";
      generation += 1;
      const rotation = rotateAttributionRevocationHandle(
        hostname,
        cookieStore,
        {
          getRandomValues(bytes) {
            bytes.fill(8);
            return bytes;
          },
        },
      );
      expect(rotation).not.toBeNull();
      expect(rotation?.revocationHandle).not.toBe(revocationHandle);
      expect(rotation?.revocationPredecessorHandle).toBe(revocationHandle);
      await queue.enqueue(async () => {
        order.push("regrant:start");
        expect(readAttributionRevocationHandle(cookieStore.cookie)).toBe(
          rotation?.revocationHandle,
        );
        return true;
      }).then((serverAcknowledged) => {
        if (serverAcknowledged) {
          clearAttributionDenialSentinel(hostname, cookieStore);
        }
      });

      resolveIgnoredGrant?.(true);
      await flushPromises();

      expect(order).toEqual([
        "grant:start",
        "deny:not-final",
        "deny:finalized",
        "regrant:start",
      ]);
      expect(hasAttributionDenialSentinel(cookieStore.cookie)).toBe(false);
      expect(readAttributionRevocationHandle(cookieStore.cookie)).toBe(
        rotation?.revocationHandle,
      );
      active = false;
    }
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preflights lineage only on a later grant after a handle-free denial", async () => {
    for (const flow of attributionFlows()) {
      const cookieStore = new MemoryCookieStore();
      writeAttributionDenialSentinel(flow.hostname, cookieStore);
      const readAttribution = vi.fn(() => ({ gclid: "paid-click" }));

      const initialDenialFetch = vi.fn<TestFetch>(async () => (
        terminalDenialResponse()
      ));
      expect(await flow.revoke(initialDenialFetch, null)).toBe(true);
      expect(JSON.parse(String(initialDenialFetch.mock.calls[0][1].body))).toEqual({
        location: flow.location,
        consentAdUserData: "denied",
      });
      expect(readAttributionRevocationHandle(cookieStore.cookie)).toBeNull();
      expect(readAttribution).not.toHaveBeenCalled();

      const firstHandle = ensureAttributionRevocationHandle(
        flow.hostname,
        cookieStore,
        randomByte(1),
      );
      expect(firstHandle).not.toBeNull();
      if (!firstHandle) throw new Error("expected persisted H1");
      const preflightFetch = vi.fn<TestFetch>(async () => (
        terminalDenialResponse()
      ));
      expect(await flow.revoke(preflightFetch, firstHandle)).toBe(true);
      expect(JSON.parse(String(preflightFetch.mock.calls[0][1].body))).toEqual({
        location: flow.location,
        consentAdUserData: "denied",
        revocationHandle: firstHandle,
      });
      expect(readAttribution).not.toHaveBeenCalled();
      expect(hasAttributionDenialSentinel(cookieStore.cookie)).toBe(true);

      const rotation = rotateAttributionRevocationHandle(
        flow.hostname,
        cookieStore,
        randomByte(2),
      );
      if (!rotation) throw new Error("expected verified H2 rotation");
      expect(rotation?.revocationPredecessorHandle).toBe(firstHandle);
      const grantFetch = vi.fn<TestFetch>(async () => storedGrantResponse());
      readAttribution();
      expect(await flow.grant(
        grantFetch,
        rotation.revocationHandle,
        String(rotation.revocationPredecessorHandle),
      )).toBe(true);
      expect(JSON.parse(String(grantFetch.mock.calls[0][1].body))).toMatchObject({
        location: flow.location,
        consentAdUserData: "granted",
        revocationHandle: rotation?.revocationHandle,
        revocationPredecessorHandle: firstHandle,
        gclid: "paid-click",
      });
      expect(readAttribution).toHaveBeenCalledOnce();
    }
  });

  it("preflights a rotated handle after a crash before granting", async () => {
    for (const flow of attributionFlows()) {
      const cookieStore = new MemoryCookieStore();
      writeAttributionDenialSentinel(flow.hostname, cookieStore);
      const firstHandle = ensureAttributionRevocationHandle(
        flow.hostname,
        cookieStore,
        randomByte(3),
      );
      if (!firstHandle) throw new Error("expected persisted H1");
      const denialFetch = vi.fn<TestFetch>(async () => terminalDenialResponse());
      expect(await flow.revoke(denialFetch, firstHandle)).toBe(true);

      const interruptedRotation = rotateAttributionRevocationHandle(
        flow.hostname,
        cookieStore,
        randomByte(4),
      );
      if (!interruptedRotation) throw new Error("expected verified H2 rotation");
      const interruptedHandle = interruptedRotation.revocationHandle;
      expect(interruptedRotation?.revocationPredecessorHandle).toBe(firstHandle);

      // Reload has no in-memory terminal proof, so H2 is tombstoned first.
      const reloadPreflight = vi.fn<TestFetch>(async () => terminalDenialResponse());
      expect(await flow.revoke(reloadPreflight, interruptedHandle)).toBe(true);
      const reloadRotation = rotateAttributionRevocationHandle(
        flow.hostname,
        cookieStore,
        randomByte(5),
      );
      if (!reloadRotation) throw new Error("expected verified H3 rotation");
      expect(reloadRotation?.revocationPredecessorHandle).toBe(
        interruptedHandle,
      );
      expect(reloadRotation?.revocationHandle).not.toBe(interruptedHandle);

      const grantFetch = vi.fn<TestFetch>(async () => storedGrantResponse());
      expect(await flow.grant(
        grantFetch,
        reloadRotation.revocationHandle,
        String(reloadRotation.revocationPredecessorHandle),
      )).toBe(true);
      expect(JSON.parse(String(grantFetch.mock.calls[0][1].body))).toMatchObject({
        revocationHandle: reloadRotation?.revocationHandle,
        revocationPredecessorHandle: interruptedHandle,
      });
    }
  });

  it("blocks lineage preflight and attribution reads when H1 cannot persist", () => {
    const cookieStore = new DenialOnlyCookieStore();
    const readAttribution = vi.fn();
    const request = vi.fn();
    const firstHandle = ensureAttributionRevocationHandle(
      "rellaweightloss.com",
      cookieStore,
      randomByte(6),
    );
    if (firstHandle) {
      request();
      readAttribution();
    }

    expect(firstHandle).toBeNull();
    expect(request).not.toHaveBeenCalled();
    expect(readAttribution).not.toHaveBeenCalled();
    expect(hasAttributionDenialSentinel(cookieStore.cookie)).toBe(true);
  });
});
