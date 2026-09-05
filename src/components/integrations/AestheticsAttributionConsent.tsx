"use client";

import { useEffect, useRef, useState } from "react";
import {
  AESTHETICS_CONSENT_CHANNEL,
  AestheticsAttributionController,
  cleanAestheticsBookingHref,
  createBrowserAestheticsAttributionRuntime,
  isAestheticsBookingHref,
  isApprovedAestheticsPilotPage,
  type AestheticsConsentMessage,
  type AestheticsConsentView,
} from "@/lib/aesthetics-attribution";
import styles from "./AestheticsAttributionConsent.module.css";

const INITIAL_VIEW: AestheticsConsentView = {
  mode: "hidden",
  phase: "hidden",
  choice: "unknown",
  status: "",
};

const BOOKING_LINK_SELECTOR =
  'a[href^="https://book.experiencerella.com/"]';

export function AestheticsAttributionConsent() {
  const [view, setView] = useState(INITIAL_VIEW);
  const controllerRef = useRef<AestheticsAttributionController | null>(null);
  const acceptRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(AESTHETICS_CONSENT_CHANNEL);
    } catch {
      channel = null;
    }

    const publish = (message: AestheticsConsentMessage) => {
      try {
        channel?.postMessage(message);
      } catch {
        // Focus and page lifecycle reconciliation remain as the fallback.
      }
    };
    const controller = new AestheticsAttributionController(
      createBrowserAestheticsAttributionRuntime(publish),
    );
    controllerRef.current = controller;
    const unsubscribe = controller.subscribe(setView);

    function sanitizeBookingLinks() {
      if (
        !isApprovedAestheticsPilotPage(
          window.location.hostname,
          window.location.pathname,
        )
      ) {
        return;
      }
      document
        .querySelectorAll<HTMLAnchorElement>(BOOKING_LINK_SELECTOR)
        .forEach((link) => {
          const clean = cleanAestheticsBookingHref(link.href);
          if (clean !== link.href) link.href = clean;
        });
    }

    function reconcile() {
      sanitizeBookingLinks();
      controller.reconcileNavigation();
    }

    function handleDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      if (isAestheticsBookingHref(link.href)) {
        if (
          !isApprovedAestheticsPilotPage(
            window.location.hostname,
            window.location.pathname,
          )
        ) {
          return;
        }
        const clean = cleanAestheticsBookingHref(link.href);
        if (clean !== link.href) link.href = clean;
        if (controller.guardBookingNavigation(clean)) {
          event.preventDefault();
          window.requestAnimationFrame(() => acceptRef.current?.focus());
        }
        return;
      }

      // App Router layouts persist. Reconcile after a client-side link updates
      // the address bar so a newly arrived paid click cannot be missed.
      window.setTimeout(reconcile, 0);
    }

    function handleVisibilityChange() {
      if (document.visibilityState !== "hidden") reconcile();
    }

    function handleChannelMessage(event: MessageEvent<unknown>) {
      const message = event.data;
      if (!message || typeof message !== "object") return;
      const candidate = message as Partial<AestheticsConsentMessage>;
      if (candidate.version !== 1) return;
      if (candidate.denialRequested === true) {
        controller.handleRemoteDenial();
      } else if (candidate.grantAcknowledged === true) {
        controller.handleRemoteGrantAcknowledged();
      }
    }

    const observer =
      typeof MutationObserver === "function"
        ? new MutationObserver(sanitizeBookingLinks)
        : null;
    observer?.observe(document.body, {
      attributes: true,
      attributeFilter: ["href"],
      childList: true,
      subtree: true,
    });
    channel?.addEventListener("message", handleChannelMessage);
    document.addEventListener("click", handleDocumentClick, { capture: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", reconcile);
    window.addEventListener("pageshow", reconcile);
    window.addEventListener("popstate", reconcile);

    sanitizeBookingLinks();
    controller.start();

    return () => {
      observer?.disconnect();
      channel?.removeEventListener("message", handleChannelMessage);
      channel?.close();
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", reconcile);
      window.removeEventListener("pageshow", reconcile);
      window.removeEventListener("popstate", reconcile);
      unsubscribe();
      controller.destroy();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, []);

  if (view.mode === "hidden") return null;

  if (view.mode === "reopen") {
    return (
      <button
        type="button"
        className={styles.reopen}
        aria-controls="rella-aesthetics-cookie-panel"
        aria-expanded="false"
        onClick={() => controllerRef.current?.openSettings()}
      >
        Cookie settings
      </button>
    );
  }

  const busy = view.phase === "granting" || view.phase === "denying";
  return (
    <section
      id="rella-aesthetics-cookie-panel"
      className={styles.panel}
      role="region"
      aria-labelledby="rella-aesthetics-cookie-title"
      aria-describedby="rella-aesthetics-cookie-copy"
      onKeyDown={(event) => {
        if (event.key === "Escape") controllerRef.current?.closeSettings();
      }}
    >
      <h2 id="rella-aesthetics-cookie-title" className={styles.title}>
        Cookies
      </h2>
      <p id="rella-aesthetics-cookie-copy" className={styles.copy}>
        Accept cookies to help us understand whether a Google ad leads to a
        booked appointment. Booking and care are unchanged. {" "}
        <a href="/privacy-policy">
          Privacy policy
        </a>
      </p>
      <div className={styles.actions}>
        <button
          ref={acceptRef}
          type="button"
          className={`${styles.button} ${styles.accept}`}
          disabled={busy}
          onClick={() => void controllerRef.current?.accept()}
        >
          Accept cookies
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.decline}`}
          disabled={view.phase === "denying"}
          onClick={() => void controllerRef.current?.deny()}
        >
          {view.choice === "granted" ? "Turn off" : "Decline"}
        </button>
      </div>
      {view.status ? (
        <p className={styles.status} role="status" aria-live="polite">
          {view.status}
        </p>
      ) : null}
    </section>
  );
}
