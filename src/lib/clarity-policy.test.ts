import { describe, expect, it, vi } from "vitest";
import {
  applyClarityChoice,
  CLARITY_ELIGIBLE_PATHS,
  getClarityProjectId,
  isClarityEligibleHost,
  isClarityEligiblePath,
  isClarityEnabled,
  persistClarityChoice,
  shouldForceClarityNavigation,
} from "./clarity-policy";

describe("Clarity public-page policy", () => {
  it("accepts only the exact public marketing hosts", () => {
    expect(isClarityEligibleHost("experiencerella.com")).toBe(true);
    expect(isClarityEligibleHost("www.experiencerella.com:443")).toBe(true);
    for (const host of [
      "weightloss.experiencerella.com",
      "book.experiencerella.com",
      "rella-aesthetics.vercel.app",
      "localhost:3000",
      "experiencerella.com.attacker.invalid",
    ]) {
      expect(isClarityEligibleHost(host), host).toBe(false);
    }
  });

  it("uses a closed exact-route allowlist", () => {
    for (const path of CLARITY_ELIGIBLE_PATHS) {
      expect(isClarityEligiblePath(path), path).toBe(true);
      expect(isClarityEligiblePath(`${path === "/" ? "" : path}/`), `${path}/`).toBe(true);
    }
    for (const path of [
      "/contact",
      "/book",
      "/api/leads",
      "/services/botox",
      "/services/weight-loss",
      "/napa/botox",
      "/vacaville/filler",
      "/blog/botox-cost-napa",
      "/privacy-policy",
      "/studio",
    ]) {
      expect(isClarityEligiblePath(path), path).toBe(false);
    }
  });

  it("requires an explicit true gate and a conservative project ID", () => {
    expect(isClarityEnabled("true")).toBe(true);
    expect(isClarityEnabled(" TRUE ")).toBe(true);
    for (const value of [undefined, "", "1", "yes", "false"]) {
      expect(isClarityEnabled(value)).toBe(false);
    }

    expect(getClarityProjectId(" abc12345 ")).toBe("abc12345");
    for (const value of [undefined, "", "short", "id/with/path", "abc 123", "<script>"]) {
      expect(getClarityProjectId(value)).toBeUndefined();
    }
  });
});

describe("Clarity consent lifecycle", () => {
  const effects = () => ({
    store: vi.fn(),
    start: vi.fn(),
    deny: vi.fn(),
    reload: vi.fn(),
  });

  it("stores a first denial without loading or reloading", () => {
    const calls = effects();
    applyClarityChoice("denied", { eligiblePath: true, activeSession: false }, calls);
    expect(calls.store).toHaveBeenCalledWith("denied");
    expect(calls.deny).toHaveBeenCalledOnce();
    expect(calls.start).not.toHaveBeenCalled();
    expect(calls.reload).not.toHaveBeenCalled();
  });

  it("starts once after an eligible grant", () => {
    const calls = effects();
    const applied = applyClarityChoice("granted", { eligiblePath: true, activeSession: false }, calls);
    expect(applied).toBe(true);
    expect(calls.store).toHaveBeenCalledWith("granted");
    expect(calls.start).toHaveBeenCalledOnce();
    expect(calls.deny).not.toHaveBeenCalled();
  });

  it("stores denial, denies the active session, then forces a clean reload", () => {
    const order: string[] = [];
    applyClarityChoice(
      "denied",
      { eligiblePath: true, activeSession: true },
      {
        store: () => order.push("store"),
        start: () => order.push("start"),
        deny: () => order.push("deny"),
        reload: () => order.push("reload"),
      },
    );
    expect(order).toEqual(["store", "deny", "reload"]);
  });

  it("does not start Clarity when a choice is granted from an excluded page", () => {
    const calls = effects();
    applyClarityChoice("granted", { eligiblePath: false, activeSession: false }, calls);
    expect(calls.store).toHaveBeenCalledWith("granted");
    expect(calls.start).not.toHaveBeenCalled();
  });

  it("never grants when the consent choice cannot be persisted", () => {
    const calls = effects();
    calls.store.mockImplementation(() => {
      throw new Error("storage blocked");
    });
    const applied = applyClarityChoice("granted", { eligiblePath: true, activeSession: false }, calls);
    expect(applied).toBe(false);
    expect(calls.start).not.toHaveBeenCalled();
    expect(calls.deny).not.toHaveBeenCalled();
  });

  it("still denies and reloads when persistence fails during withdrawal", () => {
    const order: string[] = [];
    applyClarityChoice(
      "denied",
      { eligiblePath: true, activeSession: true },
      {
        store: () => {
          order.push("store");
          throw new Error("storage blocked");
        },
        start: () => order.push("start"),
        deny: () => order.push("deny"),
        reload: () => order.push("reload"),
      },
    );
    expect(order).toEqual(["store", "deny", "reload"]);
  });

  it("removes a stale grant when persisting denial fails", () => {
    const order: string[] = [];
    const storage = {
      setItem: () => {
        order.push("set-denied");
        throw new Error("write failed");
      },
      removeItem: () => order.push("remove-stale-grant"),
    };
    expect(() =>
      persistClarityChoice(storage, "rella-clarity-consent-v1", "denied", 123),
    ).toThrow("write failed");
    expect(order).toEqual(["set-denied", "remove-stale-grant"]);
  });

  it("still reloads an active session when the vendor denial API throws", () => {
    const order: string[] = [];
    expect(() =>
      applyClarityChoice(
        "denied",
        { eligiblePath: true, activeSession: true },
        {
          store: () => order.push("store"),
          start: () => order.push("start"),
          deny: () => {
            order.push("deny");
            throw new Error("vendor failed");
          },
          reload: () => order.push("reload"),
        },
      ),
    ).toThrow("vendor failed");
    expect(order).toEqual(["store", "deny", "reload"]);
  });

  it("forces only an ordinary same-tab click into an excluded internal route", () => {
    const base = {
      activeSession: true,
      defaultPrevented: false,
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      sameOrigin: true,
      targetBlank: false,
      download: false,
      pathname: "/contact",
    };
    expect(shouldForceClarityNavigation(base)).toBe(true);
    expect(shouldForceClarityNavigation({ ...base, pathname: "/about" })).toBe(false);
    expect(shouldForceClarityNavigation({ ...base, metaKey: true })).toBe(false);
    expect(shouldForceClarityNavigation({ ...base, ctrlKey: true })).toBe(false);
    expect(shouldForceClarityNavigation({ ...base, targetBlank: true })).toBe(false);
    expect(shouldForceClarityNavigation({ ...base, sameOrigin: false })).toBe(false);
  });
});
