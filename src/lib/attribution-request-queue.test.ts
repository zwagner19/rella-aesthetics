import { describe, expect, it } from "vitest";
import {
  clearAttributionDenialSentinel,
  writeAttributionDenialSentinel,
} from "./attribution-denial-sentinel";
import { isCurrentAttributionCaptureAcknowledgement } from "./attribution-consent";
import { createAttributionRequestQueue } from "./attribution-request-queue";

describe("attribution request serialization", () => {
  it("causally orders granted capture before a later denial revocation", async () => {
    const queue = createAttributionRequestQueue();
    const order: string[] = [];
    let releaseGrant: (() => void) | undefined;
    const grantBarrier = new Promise<void>((resolve) => {
      releaseGrant = resolve;
    });

    const grant = queue.enqueue(async () => {
      order.push("grant:start");
      await grantBarrier;
      order.push("grant:end");
      return true;
    });
    const denial = queue.enqueue(async () => {
      order.push("deny");
      return true;
    });

    await Promise.resolve();
    expect(order).toEqual(["grant:start"]);
    releaseGrant?.();
    await Promise.all([grant, denial]);
    expect(order).toEqual(["grant:start", "grant:end", "deny"]);
  });

  it("never clears either domain sentinel for an out-of-order stale grant", async () => {
    for (const hostname of [
      "rellaweightloss.com",
      "experiencerella.com",
    ]) {
      const queue = createAttributionRequestQueue();
      const cookieStore = { cookie: "" };
      let consentState: "granted" | "denied" = "granted";
      let generation = 0;
      let releaseGrant: (() => void) | undefined;
      const grantBarrier = new Promise<void>((resolve) => {
        releaseGrant = resolve;
      });

      const requestGeneration = generation;
      const grant = queue.enqueue(async () => {
        await grantBarrier;
        return true;
      }).then((serverAcknowledged) => {
        if (isCurrentAttributionCaptureAcknowledgement({
          active: true,
          serverAcknowledged,
          consentState,
          requestGeneration,
          currentGeneration: generation,
        })) {
          clearAttributionDenialSentinel(hostname, cookieStore);
        }
      });

      consentState = "denied";
      generation += 1;
      writeAttributionDenialSentinel(hostname, cookieStore);
      const denial = queue.enqueue(async () => true);
      releaseGrant?.();
      await Promise.all([grant, denial]);

      expect(cookieStore.cookie, hostname).toContain(
        "rella_ad_user_data_denied=1",
      );
      expect(cookieStore.cookie, hostname).not.toContain("Max-Age=0");
    }
  });
});
