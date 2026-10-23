"use client";
import { useEffect, useRef, useState } from "react";

/** Raw card values never enter the marketing DOM or its third-party scripts. */
export function SecureCardFrame({ origin, onToken, busy, purpose = "booking" }: { origin: string; onToken: (token: string) => Promise<void>; busy: boolean; purpose?: "booking" | "package" }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [channel] = useState(() => crypto.randomUUID());
  const [parent, setParent] = useState("");
  const latest = useRef(onToken);
  latest.current = onToken;
  const handling = useRef(false);
  useEffect(() => { setParent(window.location.origin); }, []);
  useEffect(() => {
    async function receive(event: MessageEvent) {
      if (handling.current || event.origin !== origin || event.source !== frame.current?.contentWindow ||
        event.data?.type !== "rella:card-token" || event.data.channel !== channel ||
        typeof event.data.token !== "string" || event.data.token.length > 200) return;
      handling.current = true;
      try { await latest.current(event.data.token); }
      finally { handling.current = false; frame.current?.contentWindow?.postMessage({ type: "rella:card-retry", channel }, origin); }
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [origin, channel]);
  if (!parent) return null;
  const src = `${origin}/secure-card?parent=${encodeURIComponent(parent)}&channel=${channel}&purpose=${purpose}`;
  return <iframe ref={frame} title="Secure card details" src={src} sandbox="allow-scripts allow-forms allow-same-origin" referrerPolicy="no-referrer" className="w-full border-0" style={{ height: 345, pointerEvents: busy ? "none" : "auto" }} />;
}
