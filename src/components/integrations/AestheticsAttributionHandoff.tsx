"use client";

import { useEffect } from "react";
import {
  AESTHETICS_ATTRIBUTION_STORAGE_KEY,
  isGeneralAestheticsHost,
  postAestheticsAttribution,
  resolveAestheticsAttribution,
  stripAestheticsAttributionFromBookingHref,
  stripAestheticsClickIds,
  withAestheticsAttribution,
  type AestheticsAttribution,
  type AttributionSessionStorage,
} from "@/lib/aesthetics-attribution";

function sessionStorageOrNull(): AttributionSessionStorage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Captures approved aesthetics attribution first-party, with a session/query
 * fallback until acknowledgement. Renders nothing and never touches weight-loss.
 */
export function AestheticsAttributionHandoff() {
  useEffect(() => {
    if (!isGeneralAestheticsHost(window.location.hostname)) return;

    const storage = sessionStorageOrNull();
    let active = true;
    let acknowledged = false;
    const fallbackLinks = new WeakSet<HTMLAnchorElement>();
    const initialAttribution = resolveAestheticsAttribution(
      window.location.search,
      storage,
    );

    function decorate(
      link: HTMLAnchorElement,
      attribution: AestheticsAttribution,
    ) {
      const href = link.getAttribute("href");
      if (!href) return;
      const decorated = withAestheticsAttribution(
        href,
        attribution,
        window.location.origin,
      );
      if (decorated !== href) {
        link.href = decorated;
        fallbackLinks.add(link);
      }
    }

    function cleanDecoratedLinks() {
      document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const clean = stripAestheticsAttributionFromBookingHref(
          href,
          window.location.origin,
        );
        if (clean !== href) link.href = clean;
      });
    }

    document
      .querySelectorAll<HTMLAnchorElement>("a[href]")
      .forEach((link) => decorate(link, initialAttribution));

    function decorateAction(event: MouseEvent | PointerEvent) {
      if (acknowledged) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      decorate(
        link,
        resolveAestheticsAttribution(window.location.search, storage),
      );
      // Next's <Link> keeps its original href in a React closure. Mutating the
      // DOM attribute alone is enough for context-menu/new-tab actions, but an
      // ordinary client-side click could still follow that stale closure. When
      // capture has not been acknowledged, force one full first-party
      // navigation to the decorated URL so the click ID cannot disappear.
      if (
        event.type === "click" &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        fallbackLinks.has(link)
      ) {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(link.href);
      }
    }

    document.addEventListener("pointerdown", decorateAction, { capture: true });
    document.addEventListener("click", decorateAction, { capture: true });

    void postAestheticsAttribution({
      attribution: initialAttribution,
      marketingOrigin: window.location.origin,
      pathname: window.location.pathname,
      fetchImpl: window.fetch.bind(window),
    }).then((serverAcknowledged) => {
      if (!active || !serverAcknowledged) return;
      acknowledged = true;
      try {
        storage?.removeItem(AESTHETICS_ATTRIBUTION_STORAGE_KEY);
      } catch {
        // The HttpOnly cookie is authoritative after acknowledgement.
      }
      const cleanPageUrl = stripAestheticsClickIds(window.location.href);
      if (cleanPageUrl !== window.location.href) {
        window.history.replaceState(window.history.state, "", cleanPageUrl);
      }
      cleanDecoratedLinks();
    });

    return () => {
      active = false;
      document.removeEventListener("pointerdown", decorateAction, { capture: true });
      document.removeEventListener("click", decorateAction, { capture: true });
    };
  }, []);

  return null;
}
