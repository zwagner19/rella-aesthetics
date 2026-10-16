import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ASSESSMENT_CONTACT_CONSENT,
  BOOKING_CART_COOKIE,
  GUIDED_BOOKING_STEPS,
  GUIDED_CANCELLATION_SUMMARY,
  GUIDED_DEPOSIT_SUMMARY,
  MARKETING_CONSENT,
  applyCatalog,
  bookingOrigin,
  bootstrapFromIntent,
  cartCreateBody,
  cartIdFromAuthCookie,
  clientLooksComplete,
  emitGuidedBookingEvent,
  goToStep,
  groupServices,
  parseCatalogClinic,
  selectLocation,
  bookingAmountLabel,
  stripBookingPayload,
  toggleTreatment,
  type LiveCatalogClinic,
  type LiveCatalogService,
} from "./index";
import { TreatmentsStep } from "@/components/guided-booking/steps/TreatmentsStep";
import { initialGuidedBookingState } from "./machine";

const napaService: LiveCatalogService = {
  category: "Injectables",
  serviceSlug: "botox",
  displayName: "New Patient Tox",
  description:
    "A personalized Botox or Dysport treatment. Your $100 booking deposit is applied to your treatment.",
  durationCopy: "30 min.",
  bookingMode: "DIRECT_BOOK",
  paymentRule: "DEPOSIT_CENTS",
  depositCents: 10000,
  href: "/book/napa/botox",
};

const consult: LiveCatalogService = {
  category: "Injectables",
  serviceSlug: "hyperhidrosis-consult",
  displayName: "New Patient Consult",
  description: "A consultation to discuss excessive sweating.",
  bookingMode: "CONSULT_FIRST",
  paymentRule: "DEPOSIT_CENTS",
  href: "/book/napa/hyperhidrosis-consult",
};

const facial: LiveCatalogService = {
  category: "Facials",
  serviceSlug: "hydrafacial",
  displayName: "Signature Hydrafacial",
  description: "Deep-cleanse, exfoliate, and hydrate in one relaxing treatment.",
  bookingMode: "DIRECT_BOOK",
  paymentRule: "DEPOSIT_CENTS",
  href: "/book/napa/hydrafacial",
};

const clinic: LiveCatalogClinic = {
  locationSlug: "napa",
  locationName: "Napa",
  streetShort: "1541 3rd St",
  addressLine: "1541 3rd St · Downtown Napa",
  timeZone: "America/Los_Angeles",
  services: [napaService, consult, facial],
};

describe("live catalog", () => {
  it("groups services in catalog order and keeps every returned row", () => {
    const groups = groupServices(clinic.services);
    expect(groups.map((group) => group.category)).toEqual([
      "Injectables",
      "Facials",
    ]);
    expect(groups[0]?.services.map((service) => service.serviceSlug)).toEqual([
      "botox",
      "hyperhidrosis-consult",
    ]);
  });

  it("keeps every catalog row and shows only an amount the API sent", () => {
    const parsed = parseCatalogClinic(
      {
        ok: true,
        siteScope: "aesthetics",
        clinics: [
          {
            ...clinic,
            services: [
              { ...napaService, boulevardId: "urn:blvd:Service:secret" },
              { ...facial, depositCents: undefined },
              { displayName: "Extra row", serviceSlug: "extra-row", category: "Peels" },
            ],
          },
        ],
      },
      "napa",
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.clinic.services.map((service) => service.displayName)).toEqual([
      "New Patient Tox",
      "Signature Hydrafacial",
      "Extra row",
    ]);
    expect(parsed.clinic.services[0]?.depositCents).toBe(10000);
    expect(bookingAmountLabel(parsed.clinic.services[0]!)).toBe(
      "Required to book $100.00",
    );
    expect(bookingAmountLabel(parsed.clinic.services[1]!)).toBeNull();
    expect(bookingAmountLabel({ depositCents: 5060 })).toBe("Required to book $50.60");
    expect(JSON.stringify(parsed.clinic)).not.toMatch(/urn:blvd/);
  });

  it("points each site scope at its booking host", () => {
    expect(bookingOrigin("aesthetics")).toBe("https://book.experiencerella.com");
    expect(bookingOrigin("weight-loss")).toBe("https://book.rellaweightloss.com");
  });
});

describe("guided booking machine", () => {
  it("keeps all six steps on the site", () => {
    expect([...GUIDED_BOOKING_STEPS]).toEqual([
      "location",
      "treatments",
      "review",
      "provider",
      "datetime",
      "complete",
    ]);
  });

  it("opens treatments for a clinic and selects only a live service", () => {
    let state = selectLocation(bootstrapFromIntent({}), "napa");
    expect(state.step).toBe("treatments");
    state = applyCatalog(state, clinic);
    state = toggleTreatment(state, "botox");
    expect(state.selectedServiceSlug).toBe("botox");
    state = toggleTreatment(state, "hydrafacial");
    expect(state.selectedServiceSlug).toBe("hydrafacial");
    const unknown = toggleTreatment(state, "sculptra");
    expect(unknown.error).toMatch(/live menu/i);
    expect(unknown.selectedServiceSlug).toBe("hydrafacial");
  });

  it("does not advance without a live treatment", () => {
    const state = goToStep(
      selectLocation(bootstrapFromIntent({}), "vacaville"),
      "review",
    );
    expect(state.step).toBe("treatments");
    expect(state.error).toMatch(/Add a treatment/i);
  });

  it("preselects a service only when the live catalog contains that slug", () => {
    const state = applyCatalog(
      bootstrapFromIntent({ location: "napa", service: "botox" }),
      clinic,
    );
    expect(state.step).toBe("treatments");
    expect(state.selectedServiceSlug).toBe("botox");
    const missing = applyCatalog(
      bootstrapFromIntent({ location: "napa", service: "sculptra" }),
      clinic,
    );
    expect(missing.selectedServiceSlug).toBeNull();
  });

  it("validates client fields before complete", () => {
    expect(
      clientLooksComplete({
        ...initialGuidedBookingState.client,
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "7073582928",
        assessmentContactConsent: false,
      }),
    ).toBe(false);
    expect(
      clientLooksComplete({
        ...initialGuidedBookingState.client,
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "7073582928",
        assessmentContactConsent: true,
      }),
    ).toBe(true);
  });
});

describe("booking proxy contract", () => {
  it("creates a cart with location and service only", () => {
    expect(
      cartCreateBody({
        location: "napa",
        service: "botox",
        gclid: "fresh-click",
        gbraid: "fresh-braid",
        wbraid: "fresh-wbraid",
      }),
    ).toEqual({ location: "napa", service: "botox" });
  });

  it("reads the cart id from the auth cookie and strips it from client JSON", () => {
    const payload = Buffer.from(
      JSON.stringify({ c: "urn:blvd:Cart:test", l: "napa", s: "botox", t: 1 }),
    ).toString("base64url");
    expect(cartIdFromAuthCookie(`${payload}.signature`)).toBe("urn:blvd:Cart:test");
    expect(BOOKING_CART_COOKIE).toBe("rella_cart_auth");
    expect(
      stripBookingPayload({
        ok: true,
        cartId: "urn:blvd:Cart:test",
        depositCents: 10000,
        dates: ["2026-10-17"],
      }),
    ).toEqual({ ok: true, depositCents: 10000, dates: ["2026-10-17"] });
  });
});

describe("guided booking analytics", () => {
  it("emits open without PII", () => {
    const sink = vi.fn();
    emitGuidedBookingEvent(
      {
        type: "booking_open",
        intent: { location: "napa", service: "botox" },
        at: 1,
      },
      sink,
    );
    expect(sink).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(sink.mock.calls)).not.toMatch(/@|phone|ssn/i);
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

describe("treatments step", () => {
  it("renders every live name and the amount only when the API sent depositCents", () => {
    const state = applyCatalog(
      selectLocation(bootstrapFromIntent({}), "napa"),
      clinic,
    );
    const html = renderToStaticMarkup(
      <TreatmentsStep
        clinic={clinic}
        state={{ ...state, expandedCategories: ["Injectables", "Facials"] }}
        loading={false}
        onSearch={() => undefined}
        onToggleCategory={() => undefined}
        onToggleTreatment={() => undefined}
      />,
    );
    expect(html).toContain("New Patient Tox");
    expect(html).toContain("New Patient Consult");
    expect(html).toContain("Signature Hydrafacial");
    expect(html).toContain("3 services from the live catalog");
    expect(html).toContain("Required to book $100.00");
    expect(html.match(/Required to book/g)?.length).toBe(1);
    expect(html).not.toContain("book.experiencerella.com");
    expect(html).not.toContain("book.rellaweightloss.com");
    expect(html).not.toMatch(/no card/i);
    expect(html).not.toContain("urn:blvd");
  });
});
