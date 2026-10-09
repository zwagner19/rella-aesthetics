"use client";

import { useEffect } from "react";
import { isApprovedAestheticsPilotPage } from "@/lib/aesthetics-attribution";

/**
 * Ordinary marketing routes load GA4, the Meta Pixel, and chat. A client-side
 * transition would carry those scripts onto an ad landing page, so links from
 * ordinary routes into an ad landing page use a full document navigation. The
 * ad landing page then starts with no third-party tracker in the window.
 */
export function AdLandingHardNavigation() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) {
        return;
      }
      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Production hostnames only: previews have no ad landing boundary.
      if (!isApprovedAestheticsPilotPage(window.location.hostname, url.pathname)) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.toString());
    }
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);
  return null;
}
