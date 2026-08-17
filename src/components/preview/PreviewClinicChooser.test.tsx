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
  it("uses the city-pinned booking resolver for both equal clinic choices", () => {
    expect(resolveBookingHref({ location: "napa" })).toContain("location=napa");
    expect(resolveBookingHref({ location: "vacaville" })).toContain("location=vacaville");
    expect(source).toContain('resolveBookingHref({ location: "napa" })');
    expect(source).toContain('resolveBookingHref({ location: "vacaville" })');
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

  it("contains no form, offer, patient, or health-data collection", () => {
    expect(source).not.toMatch(/<form|<input|<textarea|discount|percent off|medical question/i);
  });

  it("keeps interactive labels readable on Rose and white surfaces", () => {
    expect(source).toContain("border-ink bg-rose");
    expect(source).toContain("border-ink bg-white");
    expect(source).not.toMatch(/bg-rose[^\n\"]*text-white/);
    expect(source).not.toMatch(/bg-white[^\n\"]*text-rose/);
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
