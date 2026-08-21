import { describe, expect, it } from "vitest";
import { readCookieYesAttributionConsent } from "./cookieyes-attribution-consent";

describe("CookieYes attribution consent", () => {
  it("fails closed without a valid completed API snapshot", () => {
    expect(readCookieYesAttributionConsent(undefined)).toBe("unknown");
    expect(readCookieYesAttributionConsent(() => null)).toBe("unknown");
    expect(readCookieYesAttributionConsent(() => ({
      isUserActionCompleted: false,
      categories: { advertisement: true },
    }))).toBe("unknown");
    expect(readCookieYesAttributionConsent(() => ({
      isUserActionCompleted: true,
      categories: {},
    }))).toBe("unknown");
    expect(readCookieYesAttributionConsent(() => {
      throw new Error("CookieYes unavailable");
    })).toBe("unknown");
  });

  it("maps only a completed explicit advertisement choice", () => {
    expect(readCookieYesAttributionConsent(() => ({
      isUserActionCompleted: true,
      categories: { advertisement: true },
    }))).toBe("granted");
    expect(readCookieYesAttributionConsent(() => ({
      isUserActionCompleted: true,
      categories: { advertisement: false },
    }))).toBe("denied");
  });
});
