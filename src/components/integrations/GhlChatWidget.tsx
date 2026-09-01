"use client";

import { useEffect } from "react";

/**
 * GoHighLevel / LeadConnector chat widget.
 *
 * In GHL: Settings → Chat Widget → Install → copy your Widget ID.
 *
 * Set NEXT_PUBLIC_GHL_CHAT_WIDGET_ID (UUID). The loader script URL is fixed.
 */
const LOADER_SRC = "https://widgets.leadconnectorhq.com/loader.js";
const RESOURCES_ATTR =
  "https://widgets.leadconnectorhq.com/chat-widget/loader.js";

const widgetId = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID ?? "";
/** Legacy: full script URL if your embed uses a non-standard host */
const legacyScriptUrl = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_URL ?? "";
const DESKTOP_WIDGET_QUERY = "(min-width: 1280px)";

export function GhlChatWidget() {
  useEffect(() => {
    // Mobile and tablet routes already reserve the bottom of the viewport for
    // Rella's persistent Call / Book actions and use a full-screen menu. The
    // third-party launcher is intentionally desktop-only so it cannot cover
    // either of those first-party controls.
    if (!window.matchMedia(DESKTOP_WIDGET_QUERY).matches) return;

    const existing = document.querySelector(`script[data-ghl-chat="1"]`);
    if (existing) return;

    if (legacyScriptUrl) {
      if (document.querySelector(`script[src="${legacyScriptUrl}"]`)) return;
      const s = document.createElement("script");
      s.src = legacyScriptUrl;
      s.async = true;
      s.dataset.ghlChat = "1";
      document.body.appendChild(s);
      return () => {
        s.remove();
      };
    }

    if (!widgetId) return;

    const script = document.createElement("script");
    script.src = LOADER_SRC;
    script.async = true;
    script.dataset.resourcesUrl = RESOURCES_ATTR;
    script.dataset.widgetId = widgetId;
    script.dataset.ghlChat = "1";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!widgetId && !legacyScriptUrl) return null;

  return null;
}
