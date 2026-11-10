"use client";

import { useEffect } from "react";
import {
  CALL_TAP_ENDPOINT,
  CALL_TAP_LANDING_KEY,
  callTapAllowed,
  callTapBody,
  isClinicLine,
  landingFromLocation,
  readLanding,
} from "@/lib/call-tap";

/**
 * Reports taps on the clinic phone link so Rella can tell which marketing
 * source a phone caller came from. See src/lib/call-tap.ts for exactly what
 * is sent. Renders nothing and never changes the link or delays the call.
 */
export function CallTapRecorder() {
  useEffect(() => {
    const allowed = () => callTapAllowed({
      hostname: window.location.hostname,
      globalPrivacyControl: (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
      cookie: document.cookie,
    });
    if (!allowed()) return;
    try {
      if (!window.sessionStorage.getItem(CALL_TAP_LANDING_KEY)) {
        window.sessionStorage.setItem(
          CALL_TAP_LANDING_KEY,
          JSON.stringify(landingFromLocation(window.location.href, document.referrer)),
        );
      }
    } catch {
      // Storage can be unavailable (private mode); taps still report the page.
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const href = target?.getAttribute("href") ?? "";
      if (!isClinicLine(href) || !allowed()) return;
      let landing = null;
      try {
        landing = readLanding(window.sessionStorage.getItem(CALL_TAP_LANDING_KEY));
      } catch {
        landing = null;
      }
      try {
        void fetch(CALL_TAP_ENDPOINT, {
          method: "POST",
          mode: "cors",
          credentials: "omit",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(callTapBody(landing, window.location.pathname)),
        }).catch(() => {});
      } catch {
        // Never interfere with the call.
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
