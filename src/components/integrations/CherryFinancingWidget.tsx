"use client";

import { useEffect } from "react";

export const CHERRY_WIDGET_SRC = "https://files.withcherry.com/widgets/widget.js";
export const CHERRY_MERCHANT_SLUG = "experiencerella";

type CherryCommand = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    _hw?: CherryCommand;
  }
}

function queueCherryCommand(): CherryCommand {
  const queue: CherryCommand = (...args: unknown[]) => {
    queue.q = queue.q ?? [];
    queue.q.push(args);
  };
  queue.q = [];
  return queue;
}

export function CherryFinancingWidget() {
  useEffect(() => {
    const existingLoader = document.getElementById("_hw");

    if (existingLoader && window._hw && !window._hw.q) {
      // The provider script persists across Next.js navigation. Re-mount its
      // single full widget when a visitor returns to this page.
      window._hw("all");
      return;
    }

    if (existingLoader) return;

    window._hw = queueCherryCommand();
    window._hw(
      "init",
      {
        debug: false,
        variables: {
          slug: CHERRY_MERCHANT_SLUG,
          name: "Rella Aesthetics",
        },
        styles: {
          primaryColor: "#F7A19A",
          secondaryColor: "#F7A19A1A",
          fontFamily: "inherit",
        },
      },
      ["all"],
    );

    const loader = document.createElement("script");
    loader.id = "_hw";
    loader.src = CHERRY_WIDGET_SRC;
    loader.async = true;
    loader.dataset.rellaCherryWidget = "1";
    loader.addEventListener("error", () => {
      loader.remove();
      if (window._hw?.q) delete window._hw;
    });
    document.head.appendChild(loader);
  }, []);

  return (
    <div
      id="all"
      className="min-h-[520px] max-w-full overflow-hidden"
      aria-label="Cherry payment-plan information and application options"
    />
  );
}
