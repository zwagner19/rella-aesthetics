/** Rella Reveal popup — eligibility, triggers, and session cap. */

export const REVEAL_SESSION_KEY = "rella-reveal-dismissed";

/** Paths where the consult popup must not appear. */
export const REVEAL_EXCLUDED_PATHS = [
  "/contact",
  "/booking",
  "/services/weight-loss",
] as const;

export const REVEAL_SCROLL_THRESHOLD = 0.4;
export const REVEAL_TIME_DELAY_MS = 25_000;

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
