"use client";

import { useEffect } from "react";

const GHL_CHAT_WIDGET_URL = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_URL ?? "";

export function GhlChatWidget() {
  useEffect(() => {
    if (!GHL_CHAT_WIDGET_URL) return;
    if (document.querySelector(`script[src="${GHL_CHAT_WIDGET_URL}"]`)) return;

    const script = document.createElement("script");
    script.src = GHL_CHAT_WIDGET_URL;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!GHL_CHAT_WIDGET_URL) return null;

  return null;
}
