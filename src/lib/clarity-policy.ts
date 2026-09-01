/**
 * Microsoft Clarity is deliberately limited to low-sensitivity public pages.
 * This is an allowlist, not a blocklist: new routes receive no replay or
 * heatmap collection until they are reviewed and added here.
 */
export const CLARITY_ELIGIBLE_PATHS = new Set([
  "/",
  "/about",
  "/blog",
  "/gallery",
  "/locations/napa",
  "/locations/vacaville",
  "/membership",
  "/payment-plans",
  "/private-parties",
  "/services",
  "/team",
]);

export const CLARITY_PROJECT_ID_PATTERN = /^[a-z0-9]{6,20}$/i;
export const CLARITY_PREFERENCES_EVENT = "rella:open-analytics-preferences";

const PUBLIC_MARKETING_HOSTS = new Set([
  "experiencerella.com",
  "www.experiencerella.com",
]);

export function normalizeClarityPath(pathname: string) {
  if (!pathname) return "/";
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "") || "/";
}

export function isClarityEligiblePath(pathname: string) {
  return CLARITY_ELIGIBLE_PATHS.has(normalizeClarityPath(pathname));
}

export function isClarityEligibleHost(host: string | null | undefined) {
  const hostname = (host || "")
    .trim()
    .toLowerCase()
    .replace(/^\[/, "")
    .replace(/\](:\d+)?$/, "")
    .replace(/:\d+$/, "");
  return PUBLIC_MARKETING_HOSTS.has(hostname);
}

export function getClarityProjectId(raw: string | undefined) {
  const projectId = raw?.trim();
  return projectId && CLARITY_PROJECT_ID_PATTERN.test(projectId)
    ? projectId
    : undefined;
}

export function isClarityEnabled(raw: string | undefined) {
  return raw?.trim().toLowerCase() === "true";
}

export type ClarityChoice = "granted" | "denied";

export function persistClarityChoice(
  storage: Pick<Storage, "setItem" | "removeItem">,
  key: string,
  choice: ClarityChoice,
  updatedAt: number,
) {
  try {
    storage.setItem(key, JSON.stringify({ choice, updatedAt }));
  } catch (error) {
    if (choice === "denied") {
      try {
        storage.removeItem(key);
      } catch {
        // Fully inaccessible storage will also fail closed on the next read.
      }
    }
    throw error;
  }
}

export function applyClarityChoice(
  choice: ClarityChoice,
  context: { eligiblePath: boolean; activeSession: boolean },
  effects: {
    store: (choice: ClarityChoice) => void;
    start: () => void;
    deny: () => void;
    reload: () => void;
  },
) {
  if (choice === "granted") {
    try {
      effects.store(choice);
    } catch {
      // Never start collection when the visitor's choice cannot be persisted.
      return false;
    }
    if (context.eligiblePath) effects.start();
    return true;
  }

  try {
    effects.store(choice);
  } catch {
    // Storage availability must never prevent a privacy withdrawal.
  }
  try {
    effects.deny();
  } finally {
    if (context.activeSession) effects.reload();
  }
  return true;
}

export function shouldForceClarityNavigation(input: {
  activeSession: boolean;
  defaultPrevented: boolean;
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  sameOrigin: boolean;
  targetBlank: boolean;
  download: boolean;
  pathname: string;
}) {
  return Boolean(
    input.activeSession &&
    !input.defaultPrevented &&
    input.button === 0 &&
    !input.metaKey &&
    !input.ctrlKey &&
    !input.shiftKey &&
    !input.altKey &&
    input.sameOrigin &&
    !input.targetBlank &&
    !input.download &&
    !isClarityEligiblePath(input.pathname),
  );
}
