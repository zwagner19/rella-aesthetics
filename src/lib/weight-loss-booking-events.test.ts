import { describe, expect, it, beforeEach } from "vitest";
import {
  pushWeightLossBookingConfirmed,
  resetWeightLossBookingConversionDedupe,
  WEIGHT_LOSS_BOOKING_CONFIRMED_EVENT,
  WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY,
  WEIGHT_LOSS_CONSULT_SERVICE,
} from "./weight-loss-booking-events";

function mockSessionStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  } satisfies Storage;
}

describe("weight_loss_booking_confirmed dataLayer event", () => {
  let dataLayer: Record<string, unknown>[];
  let sessionStorage: Storage;

  beforeEach(() => {
    dataLayer = [];
    sessionStorage = mockSessionStorage();
    resetWeightLossBookingConversionDedupe(sessionStorage);
  });

  it("pushes a sterile payload for Napa", () => {
    const pushed = pushWeightLossBookingConfirmed("napa", {
      dataLayer,
      sessionStorage,
    });

    expect(pushed).toBe(true);
    expect(dataLayer).toEqual([
      {
        event: WEIGHT_LOSS_BOOKING_CONFIRMED_EVENT,
        location: "napa",
        service: WEIGHT_LOSS_CONSULT_SERVICE,
        booking_confirmed: true,
      },
    ]);
    expect(sessionStorage.getItem(WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY)).toBe(
      "1",
    );
  });

  it("fires at most once per session even when called repeatedly", () => {
    expect(
      pushWeightLossBookingConfirmed("napa", { dataLayer, sessionStorage }),
    ).toBe(true);
    expect(
      pushWeightLossBookingConfirmed("napa", { dataLayer, sessionStorage }),
    ).toBe(false);
    expect(dataLayer).toHaveLength(1);
  });

  it("rejects unknown locations", () => {
    expect(
      pushWeightLossBookingConfirmed("sonoma", { dataLayer, sessionStorage }),
    ).toBe(false);
    expect(dataLayer).toHaveLength(0);
  });

  it("never includes patient or contact fields", () => {
    pushWeightLossBookingConfirmed("vacaville", {
      dataLayer,
      sessionStorage,
    });
    const payload = JSON.stringify(dataLayer[0]);
    for (const forbidden of [
      "email",
      "phone",
      "name",
      "gclid",
      "cartId",
      "appointment",
      "bmi",
      "medication",
    ]) {
      expect(payload.toLowerCase()).not.toContain(forbidden);
    }
  });
});
