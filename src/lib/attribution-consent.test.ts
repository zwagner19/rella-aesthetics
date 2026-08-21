import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  isCurrentAttributionCaptureAcknowledgement,
  planAttributionConsentTransition,
  readAttributionConsent,
} from "./attribution-consent";

describe("attribution consent adapter", () => {
  it("fails closed when a production CMP adapter is absent or invalid", () => {
    expect(readAttributionConsent(undefined)).toBe("unknown");
    expect(readAttributionConsent({ getState: () => "pending" })).toBe("unknown");
    expect(readAttributionConsent({
      getState: () => { throw new Error("CMP unavailable"); },
    })).toBe("unknown");
  });

  it("passes through only the explicit contract states", () => {
    expect(readAttributionConsent({ getState: () => "granted" })).toBe("granted");
    expect(readAttributionConsent({ getState: () => "denied" })).toBe("denied");
    expect(readAttributionConsent({ getState: () => "unknown" })).toBe("unknown");
  });

  it("revokes and strips for both an initial denial and granted-to-denied withdrawal", () => {
    for (const previous of ["unknown", "granted"] as const) {
      expect(planAttributionConsentTransition(previous, "denied")).toEqual({
        changed: true,
        captureAllowed: false,
        revoke: true,
        sessionAccessAllowed: true,
        stripClientAttribution: true,
      });
    }
  });

  it("keeps unknown state free of capture, revocation, storage, and page stripping", () => {
    expect(planAttributionConsentTransition("granted", "unknown")).toEqual({
      changed: true,
      captureAllowed: false,
      revoke: false,
      sessionAccessAllowed: false,
      stripClientAttribution: false,
    });
  });

  it("accepts only a truthful current-generation granted capture", () => {
    expect(isCurrentAttributionCaptureAcknowledgement({
      active: true,
      serverAcknowledged: true,
      consentState: "granted",
      requestGeneration: 3,
      currentGeneration: 3,
    })).toBe(true);
    for (const override of [
      { active: false },
      { serverAcknowledged: false },
      { consentState: "denied" as const },
      { currentGeneration: 4 },
    ]) {
      expect(isCurrentAttributionCaptureAcknowledgement({
        active: true,
        serverAcknowledged: true,
        consentState: "granted",
        requestGeneration: 3,
        currentGeneration: 3,
        ...override,
      })).toBe(false);
    }
  });

  it("mounts the CookieYes producer before both attribution consumers", () => {
    const site = readFileSync(
      join(__dirname, "..", "app", "(site)", "layout.tsx"),
      "utf8",
    );
    const bridge = site.indexOf("<CookieYesAttributionConsentBridge />");
    const aesthetics = site.indexOf("<AestheticsAttributionHandoff />");
    const weightLoss = site.indexOf("<WeightLossAttributionHandoff />");
    expect(bridge).toBeGreaterThan(-1);
    expect(bridge).toBeLessThan(aesthetics);
    expect(bridge).toBeLessThan(weightLoss);
  });
});
