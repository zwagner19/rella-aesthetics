"use client";

import { useEffect, useRef } from "react";
import { pushWeightLossBookingConfirmed } from "@/lib/weight-loss-booking-events";

type Props = {
  /** True only when Boulevard checkout returned a confirmed booking. */
  confirmed: boolean;
  location: string;
};

/**
 * Fires `weight_loss_booking_confirmed` once per browser session when the
 * booking SPA reaches a confirmed state. Safe against React re-renders.
 */
export function WeightLossBookingConversionTracker({
  confirmed,
  location,
}: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!confirmed || firedRef.current) return;
    const pushed = pushWeightLossBookingConfirmed(location);
    if (pushed) firedRef.current = true;
  }, [confirmed, location]);

  return null;
}
