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

export function GhlChatWidget() {
  useEffect(() => {
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
