"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  applyClarityChoice,
  CLARITY_PREFERENCES_EVENT,
  isClarityEligiblePath,
  persistClarityChoice,
  shouldForceClarityNavigation,
  type ClarityChoice,
} from "@/lib/clarity-policy";

export const CLARITY_CONSENT_STORAGE_KEY = "rella-clarity-consent-v1";

const CLARITY_SCRIPT_ID = "rella-clarity-loader";
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFunction;
    __rellaClarityLoaded?: boolean;
  }
}

function readStoredConsent(): ClarityChoice | null {
  try {
    const raw = window.localStorage.getItem(CLARITY_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { choice?: unknown; updatedAt?: unknown };
    if (
      (parsed.choice !== "granted" && parsed.choice !== "denied") ||
      typeof parsed.updatedAt !== "number" ||
      Date.now() - parsed.updatedAt > CONSENT_MAX_AGE_MS
    ) {
      window.localStorage.removeItem(CLARITY_CONSENT_STORAGE_KEY);
      return null;
    }
    return parsed.choice;
  } catch {
    try {
      window.localStorage.removeItem(CLARITY_CONSENT_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in restricted browsing modes. In that case
      // return no consent and keep Clarity off.
    }
    return null;
  }
}

function storeConsent(choice: ClarityChoice) {
  persistClarityChoice(
    window.localStorage,
    CLARITY_CONSENT_STORAGE_KEY,
    choice,
    Date.now(),
  );
}

function clarityCommand(...args: unknown[]) {
  try {
    window.clarity?.(...args);
  } catch {
    // Vendor errors must not interrupt local cookie cleanup or a hard reload.
  }
}

function clearClarityCookies() {
  for (const cookieName of ["_clck", "_clsk"]) {
    try {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; Domain=.experiencerella.com; SameSite=Lax`;
    } catch {
      // Consent denial and the following document reload remain authoritative.
    }
  }
}

export function denyClarity() {
  if (window.clarity) {
    clarityCommand("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
    // This clears Clarity cookies. A previously active session is followed by
    // an immediate full-document navigation/reload because Consent V2 denial
    // otherwise restarts Clarity in Microsoft's cookieless mode.
    clarityCommand("consent", false);
  }
  try {
    document.getElementById(CLARITY_SCRIPT_ID)?.remove();
  } catch {
    // The active document is reloaded or replaced immediately after withdrawal.
  }
  clearClarityCookies();
  window.__rellaClarityLoaded = false;
}

export function startClarity(projectId: string) {
  if (window.__rellaClarityLoaded) return;

  const clarity: ClarityFunction =
    window.clarity ||
    Object.assign(
      (...args: unknown[]) => {
        clarity.q = clarity.q || [];
        clarity.q.push(args);
      },
      { q: [] as unknown[][] },
    );
  window.clarity = clarity;

  // Advertising storage is never granted. Analytics begins only after the
  // visitor explicitly chose it in Rella's own preference control.
  clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });

  if (!document.getElementById(CLARITY_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = CLARITY_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    document.head.appendChild(script);
  }
  window.__rellaClarityLoaded = true;
}

export function ClarityAnalytics({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const eligiblePath = isClarityEligiblePath(pathname);
  const [choice, setChoice] = useState<ClarityChoice | null>(null);
  const [autoPrompt, setAutoPrompt] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const stored = readStoredConsent();
      setChoice(stored);
      setAutoPrompt(stored === null);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(initialize);
  }, []);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(CLARITY_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(CLARITY_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (!eligiblePath || choice !== "granted") return;
    startClarity(projectId);
    return undefined;
  }, [choice, eligiblePath, projectId]);

  // Link clicks into excluded routes are changed to full document navigations.
  // This stops Clarity before the sensitive route is requested and prevents a
  // client-side layout from carrying the recorder across that boundary.
  useEffect(() => {
    if (!window.__rellaClarityLoaded) return;
    const beforeInternalNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (!shouldForceClarityNavigation({
        activeSession: Boolean(window.__rellaClarityLoaded),
        defaultPrevented: event.defaultPrevented,
        button: event.button,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        sameOrigin: url.origin === window.location.origin,
        targetBlank: anchor.target === "_blank",
        download: anchor.hasAttribute("download"),
        pathname: url.pathname,
      })) return;
      event.preventDefault();
      denyClarity();
      window.location.assign(url.href);
    };
    document.addEventListener("click", beforeInternalNavigation, true);
    return () => document.removeEventListener("click", beforeInternalNavigation, true);
  }, [choice, eligiblePath]);

  // Fallback for browser-history and programmatic navigation. The layout
  // effect runs before paint, ends the session, and reloads the excluded page
  // without the script. Normal link navigation is handled earlier above.
  useLayoutEffect(() => {
    if (eligiblePath || !window.__rellaClarityLoaded) return;
    denyClarity();
    window.location.reload();
  }, [eligiblePath]);

  const panelOpen = preferencesOpen || (eligiblePath && autoPrompt);
  if (!hydrated || !panelOpen) return null;

  const decide = (nextChoice: ClarityChoice) => {
    const applied = applyClarityChoice(
      nextChoice,
      {
        eligiblePath,
        activeSession: Boolean(window.__rellaClarityLoaded),
      },
      {
        store: storeConsent,
        start: () => startClarity(projectId),
        deny: denyClarity,
        reload: () => window.location.reload(),
      },
    );
    if (!applied) {
      setChoice(null);
      setAutoPrompt(true);
      setPreferencesOpen(true);
      return;
    }
    setChoice(nextChoice);
    setAutoPrompt(false);
    setPreferencesOpen(false);
  };

  return (
    <aside
      aria-label="Microsoft Clarity preferences"
      className="fixed inset-x-4 bottom-24 z-[90] mx-auto max-w-[680px] border border-rose bg-white p-5 text-ink xl:bottom-6"
      data-clarity-mask="true"
    >
      <p className="text-sm font-bold uppercase tracking-[0.12em]">
        Microsoft Clarity session insights
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">
        With your permission, Rella uses Clarity on a small set of public pages to understand
        pseudonymous click, scroll, and session patterns. It never runs on contact, booking,
        payment, or treatment-detail pages.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink"
          onClick={() => decide("granted")}
        >
          Allow Clarity
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink"
          onClick={() => decide("denied")}
        >
          No thanks
        </button>
        <Link
          href="/privacy-policy"
          className="inline-flex min-h-11 items-center justify-center text-xs font-bold uppercase tracking-[0.1em] text-ink underline decoration-rose decoration-2 underline-offset-4"
        >
          Privacy details
        </Link>
      </div>
    </aside>
  );
}
