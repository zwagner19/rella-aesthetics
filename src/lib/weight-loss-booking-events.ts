/** Custom dataLayer event fired once after Boulevard checkout confirms. */
export const WEIGHT_LOSS_BOOKING_CONFIRMED_EVENT =
  "weight_loss_booking_confirmed" as const;

export const WEIGHT_LOSS_CONSULT_SERVICE = "weight-loss-consult" as const;

export type WeightLossBookingLocation = "napa" | "vacaville";

/** Sterile payload — no PII, health data, or appointment details. */
export type WeightLossBookingConfirmedPayload = {
  event: typeof WEIGHT_LOSS_BOOKING_CONFIRMED_EVENT;
  location: WeightLossBookingLocation;
  service: typeof WEIGHT_LOSS_CONSULT_SERVICE;
  booking_confirmed: true;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY =
  "rella_wl_booking_conv_fired";

function isWeightLossBookingLocation(
  value: string,
): value is WeightLossBookingLocation {
  return value === "napa" || value === "vacaville";
}

function dedupeStorage(
  storage: Storage | null | undefined,
): Storage | null {
  if (!storage) return null;
  try {
    storage.getItem("__probe__");
    return storage;
  } catch {
    return null;
  }
}

/**
 * Push the confirmed-booking event at most once per browser session.
 * Returns true when the event was pushed, false when deduped or invalid.
 */
export function pushWeightLossBookingConfirmed(
  location: string,
  options?: {
    sessionStorage?: Storage | null;
    dataLayer?: Window["dataLayer"];
  },
): boolean {
  if (!isWeightLossBookingLocation(location)) return false;

  const storage = dedupeStorage(
    options?.sessionStorage ??
      (typeof window !== "undefined" ? window.sessionStorage : null),
  );
  if (storage?.getItem(WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY) === "1") {
    return false;
  }

  const payload: WeightLossBookingConfirmedPayload = {
    event: WEIGHT_LOSS_BOOKING_CONFIRMED_EVENT,
    location,
    service: WEIGHT_LOSS_CONSULT_SERVICE,
    booking_confirmed: true,
  };

  const dataLayer =
    options?.dataLayer ??
    (typeof window !== "undefined" ? window.dataLayer : undefined);
  if (!dataLayer) return false;

  dataLayer.push(payload);
  storage?.setItem(WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY, "1");
  return true;
}

/** @internal Test helper — clears the once-per-session guard. */
export function resetWeightLossBookingConversionDedupe(
  sessionStorage?: Storage | null,
): void {
  dedupeStorage(sessionStorage)?.removeItem(
    WEIGHT_LOSS_BOOKING_CONVERSION_DEDUPE_KEY,
  );
}
