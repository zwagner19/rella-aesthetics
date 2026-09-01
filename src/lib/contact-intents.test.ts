import { describe, expect, it } from "vitest";

import {
  CONTACT_INTENTS,
  EXTRA_CONTACT_INTERESTS,
  resolveContactIntent,
} from "./contact-intents";

describe("contact intent allowlist", () => {
  it("maps only the three approved public inquiry paths", () => {
    expect(resolveContactIntent("membership")).toBe(CONTACT_INTENTS.membership);
    expect(resolveContactIntent("private-parties")).toBe(
      CONTACT_INTENTS["private-parties"],
    );
    expect(resolveContactIntent("payment-plans")).toBe(
      CONTACT_INTENTS["payment-plans"],
    );
  });

  it("drops arbitrary, repeated, or booking-like query values", () => {
    for (const value of [undefined, "", "botox", "anna-event", "checkout", ["membership"]]) {
      expect(resolveContactIntent(value)).toBe("");
    }
  });

  it("keeps every allowed value available in the contact form", () => {
    expect(EXTRA_CONTACT_INTERESTS).toEqual(Object.values(CONTACT_INTENTS));
  });
});
