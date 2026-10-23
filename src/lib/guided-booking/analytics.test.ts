import { afterEach, expect, it, vi } from "vitest";
import { emitGuidedBookingEvent } from "./analytics";

afterEach(() => { vi.unstubAllGlobals(); });
it("emits only generic local diagnostics even when advertising globals already exist", () => {
  const dispatchEvent = vi.fn(); const gtag = vi.fn(); const push = vi.fn();
  vi.stubGlobal("window", { dispatchEvent, gtag, dataLayer: { push } });
  emitGuidedBookingEvent({ type: "booking_handoff", locationSlug: "vacaville", serviceSlug: "private-treatment-selection", at: 123 });
  expect(gtag).not.toHaveBeenCalled(); expect(push).not.toHaveBeenCalled();
  const event = dispatchEvent.mock.calls[0][0] as CustomEvent;
  expect(event.type).toBe("rella:guided-booking");
  expect(event.detail).toEqual({ event: "rella_guided_booking_handoff", hasLocation: true });
  expect(JSON.stringify(event.detail)).not.toContain("private-treatment-selection");
});
