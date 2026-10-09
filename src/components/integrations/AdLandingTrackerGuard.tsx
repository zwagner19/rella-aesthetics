"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID_PATTERN } from "@/lib/analytics-ids";

type TrackerWindow = Window & {
  [key: string]: unknown;
  fbq?: { disablePushState?: boolean };
};

const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_ID =
  RAW_GA_ID && GA_MEASUREMENT_ID_PATTERN.test(RAW_GA_ID.trim())
    ? RAW_GA_ID.trim()
    : undefined;

/**
 * Defense in depth for ad landing pages. These routes never load GA4 or the
 * Meta Pixel, but a visitor can reach one by browser back/forward after an
 * ordinary page already loaded them. While an ad landing page is mounted, GA4
 * is disabled through Google's documented `ga-disable-<ID>` flag and the Meta
 * Pixel's history-based PageView is switched off. Both are restored on leave.
 */
export function AdLandingTrackerGuard() {
  useEffect(() => {
    const w = window as unknown as TrackerWindow;
    const gaKey = GA_ID ? `ga-disable-${GA_ID}` : null;
    const previousGa = gaKey ? w[gaKey] : undefined;
    const previousPushState = w.fbq?.disablePushState;
    if (gaKey) w[gaKey] = true;
    if (w.fbq) w.fbq.disablePushState = true;
    return () => {
      if (gaKey) w[gaKey] = previousGa === true;
      if (w.fbq) w.fbq.disablePushState = previousPushState === true;
    };
  }, []);
  return null;
}
