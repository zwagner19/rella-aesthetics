import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBookingHref } from "@/lib/booking-routes";

const source = readFileSync(
  join(process.cwd(), "src/components/preview/PreviewClinicChooser.tsx"),
  "utf8",
);
const globalStyles = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

describe("preview clinic chooser", () => {
  it("uses the Rella Reveal offer and interest-specific booking handoff", () => {
    expect(source).toContain("The Rella Reveal");
    expect(source).toContain("border-rose bg-white");
    expect(source).toContain("$50 treatment credit");
    expect(source).toContain("Fine lines / wrinkles");
    expect(source).toContain("I’m not sure, I need guidance");
    expect(source).toContain('resolveCustomBookingEntry({ service: interest.service })');
    expect(resolveBookingHref({ location: "napa" })).toContain("location=napa");
  });

  it("is an accessible, dismissible, session-capped native modal", () => {
    expect(source).toContain("<dialog");
    expect(source).toContain("dialog.showModal()");
    expect(source).toContain("onCancel=");
    expect(source).toContain("onClose={handleDialogClose}");
    expect(source).toContain("handleDialogKeyDown");
    expect(source).toContain("window.sessionStorage");
    expect(source).toContain("previous.focus({ preventScroll: true })");
  });

  it("collects only the selected interest and email through the existing lead endpoint", () => {
    expect(source).toContain('<form onSubmit={submitReveal}>');
    expect(source).toContain('fetch("/api/leads"');
    expect(source).toContain('name: "Rella Reveal Prospect"');
    expect(source).toContain('location: "No preference"');
    expect(source).not.toMatch(/patient|diagnosis|medical question/i);
  });

  it("delays the offer and supports scroll and desktop exit intent", () => {
    expect(source).toContain("PREVIEW_CLINIC_CHOOSER_DELAY_MS = 35_000");
    expect(source).toContain("window.scrollY / scrollable >= 0.4");
    expect(source).toContain("event.clientY <= 0 && window.innerWidth >= 768");
  });

  it("keeps interactive labels readable on Rose and white surfaces", () => {
    expect(source).toContain("border-rose bg-white");
    expect(source).toContain("hover:bg-white hover:text-rose");
    expect(source).toContain("focus-visible:bg-white focus-visible:text-rose");
  });

  it("uses a safe mobile viewport and disables preview motion when reduced motion is requested", () => {
    expect(globalStyles).toContain("max-height: calc(100dvh");
    expect(globalStyles).toContain("scrollbar-gutter: stable");
    expect(source).toContain("env(safe-area-inset-bottom)");
    expect(globalStyles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(globalStyles).toContain('main[data-preview-motion="true"] .rella-preview-reveal');
    expect(globalStyles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
