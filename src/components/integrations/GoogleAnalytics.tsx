"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer?.push(args);
      });

    const alreadyConfigured = window.dataLayer.some((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const command = Array.from(entry as ArrayLike<unknown>);
      return command[0] === "config" && command[1] === GA_ID;
    });

    if (!alreadyConfigured) {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID);
    }
  }, []);

  if (!GA_ID) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  );
}
