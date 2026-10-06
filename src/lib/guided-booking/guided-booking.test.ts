import { describe, expect, it, vi } from "vitest";
import {
  ALLOWS_MULTI_TREATMENT,
  BOULEVARD_CATEGORY_ORDER,
  bootstrapFromIntent,
  buildHandoffUrl,
  createMockBackend,
  createHandoffBackend,
  emitGuidedBookingEvent,
  goToStep,
  mapIntentToTreatmentKey,
  resolveGuidedTreatment,
  selectLocation,
  toggleTreatment,
  treatmentsByCategory,
  clientLooksComplete,
} from "./index";

describe("guided booking catalog", () => {
  it("resolves verified location/service pairs and fails closed on unknown", () => {
    expect(resolveGuidedTreatment("napa", "botox")?.displayName).toBe(
      "New Patient Tox",
    );
    expect(resolveGuidedTreatment("napa", "iv-hydration")).toBeNull();
    expect(resolveGuidedTreatment("vacaville", "universal-peel")?.key).toBe(
      "vacaville/universal-peel",
    );
    expect(mapIntentToTreatmentKey({ location: "napa", service: "mystery" })).toBeNull();
    expect(mapIntentToTreatmentKey({ location: "napa", service: "botox" })).toBe(
      "napa/botox",
    );
    expect(buildHandoffUrl("napa", "botox")).toBe(
      "https://book.experiencerella.com/book/napa/botox",
    );
    expect(buildHandoffUrl("napa", "unknown")).toBeNull();
  });

  it("disallows multi-treatment until Boulevard combination scheduling is verified", () => {
    expect(ALLOWS_MULTI_TREATMENT).toBe(false);
    let state = selectLocation(bootstrapFromIntent({}), "napa");
    state = toggleTreatment(state, "napa/botox");
    state = toggleTreatment(state, "napa/hydrafacial");
    expect(state.selectedTreatmentKeys).toEqual(["napa/hydrafacial"]);
  });
});

describe("guided booking machine", () => {
  it("bootstraps location and known treatment into review", () => {
    const state = bootstrapFromIntent({ location: "napa", service: "botox" });
    expect(state.step).toBe("review");
    expect(state.selectedTreatmentKeys).toEqual(["napa/botox"]);
  });

  it("fails closed when advancing without a treatment", () => {
    const state = goToStep(
      selectLocation(bootstrapFromIntent({}), "vacaville"),
      "review",
    );
    expect(state.step).toBe("treatments");
    expect(state.error).toMatch(/Add a treatment/i);
  });

  it("validates client fields before complete", () => {
    expect(
      clientLooksComplete({
        firstName: "A",
        lastName: "B",
        email: "bad",
        phone: "707",
      }),
    ).toBe(false);
    expect(
      clientLooksComplete({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "7073582928",
      }),
    ).toBe(true);
  });
});

describe("guided booking backends", () => {
  it("mock backend labels availability as non-live and can confirm without Boulevard", async () => {
    const backend = createMockBackend();
    expect(backend.mode).toBe("mock");
    const availability = await backend.loadAvailability({
      locationSlug: "napa",
      treatmentKeys: ["napa/botox"],
      providerId: "any-available",
    });
    expect(availability.live).toBe(false);
    expect(availability.dates.length).toBeGreaterThan(0);
    const complete = await backend.complete?.({
      locationSlug: "napa",
      treatmentKeys: ["napa/botox"],
      providerId: "any-available",
      slot: availability.nextAvailable[0],
      client: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "7073582928",
      },
    });
    expect(complete?.ok).toBe(true);
  });

  it("handoff backend never invents live availability or complete mutations", async () => {
    const backend = createHandoffBackend();
    expect(backend.mode).toBe("handoff");
    expect(backend.complete).toBeUndefined();
    const availability = await backend.loadAvailability({
      locationSlug: "napa",
      treatmentKeys: ["napa/botox"],
      providerId: "any-available",
    });
    expect(availability.live).toBe(false);
    expect(availability.dates).toEqual([]);
    expect(availability.nextAvailable).toEqual([]);
  });
});

describe("guided booking analytics", () => {
  it("emits open and handoff without PII", () => {
    const sink = vi.fn();
    emitGuidedBookingEvent(
      {
        type: "booking_open",
        intent: { location: "napa", service: "botox" },
        at: 1,
      },
      sink,
    );
    emitGuidedBookingEvent(
      {
        type: "booking_handoff",
        locationSlug: "napa",
        serviceSlug: "botox",
        at: 2,
      },
      sink,
    );
    expect(sink).toHaveBeenCalledTimes(2);
    expect(sink.mock.calls[0][0].type).toBe("booking_open");
    expect(JSON.stringify(sink.mock.calls)).not.toMatch(/@|phone|ssn/i);
  });
});


describe("guided booking Boulevard categories", () => {
  it("uses Boulevard menu category names and order", () => {
    expect([...BOULEVARD_CATEGORY_ORDER]).toEqual([
      "Injectables",
      "Laser",
      "Microneedling",
      "Facials",
      "Peels",
    ]);
    const groups = treatmentsByCategory("napa");
    expect(groups.map((g) => g.category)).toEqual([
      "Injectables",
      "Laser",
      "Facials",
    ]);
    expect(groups.every((g) => g.category !== "Weight Loss")).toBe(true);
  });

  it("starts with no expanded categories after location selection", () => {
    const state = selectLocation(bootstrapFromIntent({}), "vacaville");
    expect(state.step).toBe("treatments");
    expect(state.expandedCategories).toEqual([]);
  });
});
