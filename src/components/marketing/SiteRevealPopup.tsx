"use client";

import dynamic from "next/dynamic";

const RellaRevealDialog = dynamic(
  () =>
    import("@/components/marketing/RellaRevealDialog").then((mod) => ({
      default: mod.RellaRevealDialog,
    })),
  { ssr: false },
);

export function SiteRevealPopup() {
  return <RellaRevealDialog />;
}
