import { describe, expect, it, vi } from "vitest";
import {
  ALLOWS_MULTI_TREATMENT,
  ASSESSMENT_CONTACT_CONSENT,
  BOULEVARD_CATEGORY_ORDER,
  GUIDED_BOOKING_STEPS,
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  MARKETING_CONSENT,
  bootstrapFromIntent,
  buildHandoffUrl,
  createMockBackend,
  createHandoffBackend,
  emitGuidedBookingEvent,
  goToStep,
  mapIntentToTreatmentKey,
  paymentRuleLabel,
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
  it("hands off after a known clinic and service", () => {
    const state = bootstrapFromIntent({ location: "napa", service: "botox" });
    expect(state.step).toBe("complete");
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
        assessmentContactConsent: true,
        marketingConsent: false,
      }),
    ).toBe(false);
    expect(
      clientLooksComplete({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "7073582928",
        assessmentContactConsent: false,
        marketingConsent: true,
      }),
    ).toBe(false);
    expect(
      clientLooksComplete({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "7073582928",
        assessmentContactConsent: true,
        marketingConsent: false,
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
        assessmentContactConsent: true,
        marketingConsent: false,
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
  it("lists the offered services for the clinic chosen in step 1", () => {
    expect([...BOULEVARD_CATEGORY_ORDER]).toEqual([
      "Injectables",
      "Laser",
      "Microneedling",
      "Facials",
      "Peels",
      "Weight Loss",
    ]);

    const napa = treatmentsByCategory("napa");
    expect(napa.map((g) => g.category)).toEqual([
      "Injectables",
      "Laser",
      "Facials",
      "Weight Loss",
    ]);
    expect(names(napa, "Injectables")).toEqual([
      "Hyperhidrosis Consult",
      "Dermal Fillers",
      "Established Patient Tox",
      "New Patient Tox",
    ]);
    expect(names(napa, "Laser")).toEqual(["Initial Laser Consult"]);
    expect(names(napa, "Facials")).toEqual([
      "Initial Skin Health Consult",
      "Deluxe HydraFacial",
      "Signature HydraFacial",
    ]);
    expect(names(napa, "Weight Loss")).toEqual(["Weight Loss Consult"]);

    const vacaville = treatmentsByCategory("vacaville");
    expect(vacaville.map((g) => g.category)).toEqual([
      "Injectables",
      "Laser",
      "Microneedling",
      "Facials",
      "Peels",
      "Weight Loss",
    ]);
    expect(names(vacaville, "Injectables")).toEqual([
      "Dermal Fillers",
      "New Patient Tox",
    ]);
    expect(names(vacaville, "Microneedling")).toEqual([
      "Initial Microneedling Consult",
    ]);
    expect(names(vacaville, "Facials")).toEqual([
      "Initial Skin Health Consult",
      "Signature HydraFacial",
    ]);
    expect(names(vacaville, "Peels")).toEqual(["Universal Peel"]);
    expect(names(vacaville, "Weight Loss")).toEqual(["Weight Loss Consult"]);

    const offered = [...napa, ...vacaville].flatMap((g) => g.treatments);
    expect(offered.some((t) => t.displayName === "Sculptra")).toBe(false);
    expect(offered.some((t) => t.displayName === "Platinum Hydrafacial")).toBe(
      false,
    );
    expect(offered.some((t) => /no card required/i.test(t.shortDescription))).toBe(
      false,
    );
    expect(offered.some((t) => /\$\d/.test(t.shortDescription))).toBe(false);
    expect(
      offered.some((t) => t.depositCents != null || t.listPriceCents != null),
    ).toBe(false);
    for (const treatment of offered) {
      expect(paymentRuleLabel(treatment)).not.toMatch(/no card required/i);
      expect(paymentRuleLabel(treatment)).not.toMatch(/\$\d/);
    }
  });

  it("starts with no expanded categories after location selection", () => {
    const state = selectLocation(bootstrapFromIntent({}), "vacaville");
    expect(state.step).toBe("treatments");
    expect(state.expandedCategories).toEqual([]);
  });
});


describe("guided booking handoff for the offered menu", () => {
  it("uses exact routes for offered services and fails closed on the rest", () => {
    expect([...GUIDED_BOOKING_STEPS]).toEqual([
      "location",
      "treatments",
      "complete",
    ]);
    expect(buildHandoffUrl("napa", "botox")).toBe(
      "https://book.experiencerella.com/book/napa/botox",
    );
    expect(buildHandoffUrl("vacaville", "universal-peel")).toBe(
      "https://book.experiencerella.com/book/vacaville/universal-peel",
    );
    expect(buildHandoffUrl("napa", "hydrafacial-deluxe")).toBe(
      "https://book.experiencerella.com/book/napa/hydrafacial-deluxe",
    );
    expect(buildHandoffUrl("napa", "weight-loss-consult")).toBe(
      "https://book.rellaweightloss.com/book/napa/weight-loss-consult",
    );
    expect(buildHandoffUrl("vacaville", "weight-loss-consult")).toBe(
      "https://book.rellaweightloss.com/book/vacaville/weight-loss-consult",
    );
    expect(mapIntentToTreatmentKey({ location: "napa", service: "weight-loss" })).toBe(
      "napa/weight-loss-consult",
    );
    expect(buildHandoffUrl("napa", "sculptra")).toBeNull();
    expect(resolveGuidedTreatment("vacaville", "tox-established")).toBeNull();
    expect(resolveGuidedTreatment("napa", "universal-peel")).toBeNull();
    expect(resolveGuidedTreatment("vacaville", "hydrafacial-deluxe")).toBeNull();
  });
});

describe("guided booking notice and phone consent", () => {
  it("keeps a 48-hour cancellation notice without a deposit amount or no-card claim", () => {
    expect(GUIDED_CANCELLATION_SUMMARY).toMatch(/48 hours/);
    expect(GUIDED_CANCELLATION_SUMMARY).not.toMatch(/\$\d/);
    expect(GUIDED_DEPOSIT_SUMMARY).not.toMatch(/\$\d/);
    expect(GUIDED_CANCELLATION_SUMMARY).not.toMatch(/no card required/i);
    expect(GUIDED_DEPOSIT_SUMMARY).not.toMatch(/no card required/i);
  });

  it("keeps the assessment consent sentences verbatim", () => {
    expect(ASSESSMENT_CONTACT_CONSENT).toBe(
      "I ask Rella Aesthetics to contact me by phone, email, or text about my assessment and requested consultation. Messages may be sent using automated technology. Message and data rates may apply. Reply STOP to stop texts or HELP for help. This consent applies only to contact about my assessment and consultation request.",
    );
    expect(MARKETING_CONSENT).toBe(
      "Optional: I agree to receive recurring promotional calls and text messages, including through automated technology, from Rella Aesthetics at the number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
    );
  });
});

function names(
  groups: ReturnType<typeof treatmentsByCategory>,
  category: string,
): string[] {
  return groups.find((g) => g.category === category)?.treatments.map((t) => t.displayName) ?? [];
}
