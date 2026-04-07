"use client";

import { useEffect } from "react";

/**
 * AI Chatbot integration placeholder.
 *
 * Phase 1: GHL Conversation AI (handled by GhlChatWidget — no separate component needed)
 * Phase 2: Dedicated med spa bot (Aestheti.Bot or custom OpenAI solution)
 *
 * To enable a dedicated chatbot, set NEXT_PUBLIC_AI_CHATBOT_URL in .env.local
 * and this component will load the external script.
 */

const CHATBOT_URL = process.env.NEXT_PUBLIC_AI_CHATBOT_URL ?? "";

export function AiChatbot() {
  useEffect(() => {
    if (!CHATBOT_URL) return;
    if (document.querySelector(`script[src="${CHATBOT_URL}"]`)) return;

    const script = document.createElement("script");
    script.src = CHATBOT_URL;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!CHATBOT_URL) return null;
  return null;
}
