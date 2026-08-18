/** Rella Reveal popup — eligibility, triggers, interests, and session cap. */

import { resolveBookingHref } from "@/lib/booking-routes";

export const REVEAL_SESSION_KEY = "rella-reveal-dismissed";
export const REVEAL_VIEW_SESSION_KEY = "rella-reveal-viewed";

export const REVEAL_OFFER_HEADLINE = "Unlock your Rella Reveal";
export const REVEAL_OFFER_DETAIL =
  "Get a personalized skin & confidence plan from our providers, plus a $50 treatment credit on your first visit over $250.";

/** Paths where the popup must not appear. */
export const REVEAL_EXCLUDED_PATHS = [
  "/contact",
  "/booking",
  "/services/weight-loss",
  "/rella-reveal",
  "/private-parties",
] as const;

export const REVEAL_SCROLL_THRESHOLD = 0.4;
/** 35s — middle of the 30–45s spec window. */
export const REVEAL_TIME_DELAY_MS = 35_000;

export const REVEAL_DESKTOP_MIN_WIDTH_PX = 1024;

export type RevealInterestId =
  | "fine-lines"
  | "pigment"
  | "texture"
  | "body-sculpting"
  | "weight-loss"
  | "guidance";

export interface RevealInterestOption {
  id: RevealInterestId;
  label: string;
  serviceLabel: string;
}

export const REVEAL_INTEREST_OPTIONS: readonly RevealInterestOption[] = [
  { id: "fine-lines", label: "Fine lines / wrinkles", serviceLabel: "Fine lines / wrinkles" },
  { id: "pigment", label: "Pigment / sun damage", serviceLabel: "Pigment / sun damage" },
  { id: "texture", label: "Texture / pores", serviceLabel: "Texture / pores" },
  { id: "body-sculpting", label: "Body sculpting", serviceLabel: "Body sculpting" },
  { id: "weight-loss", label: "Weight loss", serviceLabel: "Medical weight loss" },
  {
    id: "guidance",
    label: "I'm not sure, I need guidance",
    serviceLabel: "General aesthetic guidance",
  },
] as const;

export function isRevealInterestId(value: string): value is RevealInterestId {
  return REVEAL_INTEREST_OPTIONS.some((option) => option.id === value);
}

export function getRevealInterestOption(id: RevealInterestId): RevealInterestOption {
  const match = REVEAL_INTEREST_OPTIONS.find((option) => option.id === id);
  if (!match) throw new Error(`Unknown reveal interest: ${id}`);
  return match;
}

export function isRevealEligiblePath(pathname: string): boolean {
  if (REVEAL_EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  if (pathname.startsWith("/studio")) return false;
  return true;
}

export function hasRevealSessionCap(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(REVEAL_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markRevealDismissed(): void {
  try {
    sessionStorage.setItem(REVEAL_SESSION_KEY, "1");
  } catch {
    /* private browsing — ignore */
  }
}

export function markRevealViewed(): void {
  try {
    sessionStorage.setItem(REVEAL_VIEW_SESSION_KEY, String(Date.now()));
  } catch {
    /* private browsing — ignore */
  }
}

/** Booking handoff matched to the visitor's stated interest. */
export function resolveRevealInterestBookingHref(interestId: RevealInterestId): string {
  switch (interestId) {
    case "fine-lines":
      return resolveBookingHref({ service: "botox", location: "napa" });
    case "pigment":
      return resolveBookingHref({ service: "laser-treatments" });
    case "texture":
      return resolveBookingHref({ service: "hydrafacial", location: "napa" });
    case "body-sculpting":
      return resolveBookingHref({ service: "laser-treatments" });
    case "weight-loss":
      return "/services/weight-loss#consultation-options";
    case "guidance":
      return resolveBookingHref({});
  }
}

export function buildRevealThankYouPath(interestId: RevealInterestId): string {
  return `/rella-reveal/thank-you?interest=${interestId}`;
}

export const REVEAL_LEAD_SOURCE = "Rella Website — Rella Reveal Popup";

export function buildRevealLeadMessage(interest: RevealInterestOption): string {
  return `Rella Reveal — $50 treatment credit on first visit over $250 | Interest: ${interest.serviceLabel}`;
}
