import { describe, expect, it } from "vitest";
import {
  CONTACT_INTENTS,
  EXTRA_CONTACT_INTERESTS,
  resolveContactIntent,
} from "./contact-intents";

describe("contact intent allowlist", () => {
  it("maps only approved public inquiry paths", () => {
    expect(resolveContactIntent("membership")).toBe(CONTACT_INTENTS.membership);
    expect(resolveContactIntent("private-parties")).toBe(
      CONTACT_INTENTS["private-parties"],
    );
    expect(resolveContactIntent("payment-plans")).toBe(
      CONTACT_INTENTS["payment-plans"],
    );
  });

  it("drops arbitrary, repeated, or booking-like values", () => {
    for (const value of [
      undefined,
      "",
      "botox",
      "checkout",
      ["membership"],
    ]) {
      expect(resolveContactIntent(value)).toBe("");
    }
  });

  it("makes every approved value available to the form", () => {
    expect(EXTRA_CONTACT_INTERESTS).toEqual(Object.values(CONTACT_INTENTS));
  });
});
