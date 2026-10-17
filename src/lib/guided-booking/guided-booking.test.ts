import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  backendTreatments, resolveGuidedTreatment, treatmentsByCategory, mapIntentToTreatmentKey,
  bootstrapFromIntent, selectLocation, toggleTreatment, removeTreatment, selectProvider,
  providersComplete, goToStep, clientLooksComplete, contactFieldsLookComplete, createDefaultBackend,
  ASSESSMENT_CONTACT_CONSENT, MARKETING_CONSENT,
} from "./index";
import type { GuidedBookingState } from "./types";
import { createPackageIdentityClient } from "./package-client";

const services = [
  { serviceSlug: "botox", displayName: "New Patient Tox", category: "Injectables", description: "Consultation" },
  { serviceSlug: "live-new-service", displayName: "New facial", category: "New category", description: "Live description" },
];
const catalog = backendTreatments("napa", services);
const slot = { id: "opaque-time", startTime: "2026-11-01T18:00:00Z", label: "10:00 AM" };
const client = {
  firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928",
  assessmentContactConsent: true, marketingConsent: true,
};
const input = { locationSlug: "napa" as const, treatmentKeys: ["napa/botox"], providerIds: { "napa/botox": "any-available" } };
const multi = { ...input, treatmentKeys: ["napa/botox", "napa/live-new-service"],
  providerIds: { "napa/botox": "provider-botox", "napa/live-new-service": "any-available" } };
const quoted = { depositCents: 5000, totalCents: 20000, needsCard: true };
beforeEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe("shared booking menu and state", () => {
  it("has no fallback catalog and reflects backend services and category order", () => {
    expect(resolveGuidedTreatment("napa", "botox")).toBeNull();
    expect(resolveGuidedTreatment("napa", "live-new-service", catalog)?.displayName).toBe("New facial");
    expect(resolveGuidedTreatment("vacaville", "botox", catalog)).toBeNull();
    expect(treatmentsByCategory("napa", "", catalog).map(g => g.category)).toEqual(["Injectables", "New category"]);
    expect(treatmentsByCategory("napa", "facial", catalog)).toHaveLength(1);
    expect(mapIntentToTreatmentKey({ location: "napa", service: "tox", treatments: catalog })).toBe("napa/botox");
  });
  it("waits for a live menu and keeps independently added treatments until removed", () => {
    const initial = bootstrapFromIntent({ location: "napa", service: "botox" });
    expect(initial.step).toBe("treatments");
    expect(initial.selectedTreatmentKeys).toEqual([]);
    let state: GuidedBookingState = { ...initial, treatments: catalog };
    state = toggleTreatment(state, "napa/botox");
    state = toggleTreatment(state, "napa/live-new-service");
    expect(state.selectedTreatmentKeys).toEqual(multi.treatmentKeys);
    expect(toggleTreatment(state, "napa/live-new-service").selectedTreatmentKeys).toEqual(["napa/botox"]);
    expect(removeTreatment(state, "napa/botox").selectedTreatmentKeys).toEqual(["napa/live-new-service"]);
  });
  it("preserves a loaded same-location menu and clears dependent state at a different location", () => {
    const state: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments: catalog,
      selectedTreatmentKeys: [...multi.treatmentKeys], providerIds: { ...multi.providerIds },
      expandedCategories: ["Injectables"], date: "2026-11-01", slot, quote: quoted, availabilityUnverified: false };
    const same = selectLocation(state, "napa");
    expect(same.treatments).toEqual(catalog);
    expect(same.selectedTreatmentKeys).toEqual(multi.treatmentKeys);
    expect(same.providerIds).toEqual({});
    expect(same.quote).toBeUndefined();
    const changed = selectLocation(state, "vacaville");
    expect(changed).toMatchObject({ treatments: [], selectedTreatmentKeys: [], providerIds: {}, date: "", slot: null, expandedCategories: [], availabilityUnverified: true });
    expect(goToStep(changed, "review").step).toBe("treatments");
  });
  it("keeps provider preferences for unchanged items but clears the previous quote and reserved schedule", () => {
    const state: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments: catalog,
      selectedTreatmentKeys: ["napa/botox"], providerIds: { "napa/botox": "named-one" }, date: "2026-11-01", slot,
      quote: quoted, availabilityUnverified: false, reservationExpiresAt: "2026-11-01T20:00:00Z",
      schedule: [{ treatmentKey: "napa/botox", startTime: "2026-11-01T10:00:00", timeZone: "America/Los_Angeles" }] };
    const added = toggleTreatment(state, "napa/live-new-service");
    expect(added.providerIds).toEqual({ "napa/botox": "named-one" });
    expect(added).toMatchObject({ date: "", slot: null, availabilityUnverified: true });
    expect(added.quote).toBeUndefined(); expect(added.schedule).toBeUndefined(); expect(added.reservationExpiresAt).toBeUndefined();
    const removed = removeTreatment(added, "napa/botox");
    expect(removed.providerIds).toEqual({});
  });
  it("requires an explicit provider choice for every treatment without sharing another item's preference", () => {
    let state: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments: catalog, selectedTreatmentKeys: multi.treatmentKeys };
    state = selectProvider(state, "napa/botox", "provider-botox");
    expect(state.providerIds).toEqual({ "napa/botox": "provider-botox" });
    expect(providersComplete(state)).toBe(false);
    expect(goToStep(state, "datetime").step).toBe("provider");
    state = selectProvider(state, "napa/live-new-service", "any-available");
    expect(providersComplete(state)).toBe(true);
    expect(goToStep(state, "datetime").step).toBe("datetime");
    expect(selectProvider(state, "vacaville/botox", "bad").providerIds).toEqual(state.providerIds);
  });
  it("bounds a visit to six unique live treatments", () => {
    const larger = backendTreatments("napa", Array.from({ length: 7 }, (_, i) => ({ serviceSlug: `service-${i}`, displayName: `Treatment ${i}`, category: "Skin", description: "" })));
    let state: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments: larger };
    for (const treatment of larger) state = toggleTreatment(state, treatment.key);
    expect(state.selectedTreatmentKeys).toHaveLength(6);
    expect(state.error).toContain("up to 6");
  });
  it("validates contact information and keeps both phone-consent sentences", () => {
    const incomplete = { ...client, email: "bad", phone: "707", assessmentContactConsent: true };
    expect(contactFieldsLookComplete(incomplete)).toBe(false);
    expect(clientLooksComplete(incomplete)).toBe(false);
    expect(clientLooksComplete({ ...client, assessmentContactConsent: false })).toBe(false);
    expect(clientLooksComplete({ ...client, marketingConsent: false })).toBe(true);
    expect(ASSESSMENT_CONTACT_CONSENT).toBe("I ask Rella Aesthetics to contact me by phone, email, or text about my assessment and requested consultation. Messages may be sent using automated technology. Message and data rates may apply. Reply STOP to stop texts or HELP for help. This consent applies only to contact about my assessment and consultation request.");
    expect(MARKETING_CONSENT).toBe("Optional: I agree to receive recurring promotional calls and text messages, including through automated technology, from Rella Aesthetics at the number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.");
  });
  it("keeps owned context for one verified service and clears it for uncovered or location changes", () => {
    const owned: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments: catalog,
      selectedTreatmentKeys: ["napa/botox"], ownedPackageServiceKey: "napa/botox" };
    expect(selectLocation(owned, "napa").ownedPackageServiceKey).toBe("napa/botox");
    expect(selectLocation(owned, "vacaville").ownedPackageServiceKey).toBeUndefined();
    expect(toggleTreatment(owned, "napa/live-new-service").ownedPackageServiceKey).toBeUndefined();
    expect(removeTreatment(owned, "napa/botox").ownedPackageServiceKey).toBeUndefined();
  });
});

type Request = { operation: string; method: string; body?: Record<string, unknown>; query: URLSearchParams };
type Choice = { service: string; provider?: string };
function backendResponses(options: { confirmation?: string; failSelection?: boolean; failReserve?: boolean;
  failCheckout?: boolean; ambiguousCheckout?: boolean; ambiguousCheckoutStatus?: number; rejectCheckout?: boolean;
  failRelease?: boolean; denyRelease?: boolean; unverifiedRelease?: boolean;
  requireFreshVisitor?: boolean; failMenuReadAt?: number;
  incompleteSchedule?: boolean; noCombinedDates?: boolean; reserveQuote?: typeof quoted } = {}) {
  const calls: Request[] = [];
  let committed: Choice[] = [];
  let visitorExpiresAt = 0;
  let menuReads = 0;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
    const parsed = new URL(String(url), "https://experiencerella.com");
    const operation = parsed.pathname.split("/").pop()!;
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ operation, body, method: init?.method ?? "GET", query: parsed.searchParams });
    if (operation === "menu" && init?.method === "GET") {
      if (++menuReads === options.failMenuReadAt) return Response.json({ ok: false, reason: "menu_unavailable" }, { status: 502 });
      visitorExpiresAt = Date.now() + 30 * 60 * 1000;
    }
    if (operation === "menu" && init?.method === "POST" && options.requireFreshVisitor && visitorExpiresAt <= Date.now()) {
      return Response.json({ ok: false, reason: "menu_session_required" }, { status: 403 });
    }
    const selections = (body?.selections ?? []) as Choice[];
    if (operation === "selection" && selections.some(item => item.provider)) {
      if (options.failSelection) throw new Error("Network interrupted after send");
      committed = selections;
    }
    if (operation === "reserve" && options.failReserve) return Response.json({ ok: false, reason: "reserve_uncertain" }, { status: 502 });
    if (operation === "checkout" && options.failCheckout) throw new Error("Lost checkout response");
    if (operation === "checkout" && options.ambiguousCheckout) return Response.json({ ok: false, reason: "checkout_unverified" }, { status: options.ambiguousCheckoutStatus ?? 502 });
    if (operation === "checkout" && options.rejectCheckout) return Response.json({ ok: false, stage: "SAFE_TO_RETRY", reason: "invalid_body" }, { status: 400 });
    if (operation === "release" && options.failRelease) throw new Error("Release response lost");
    if (operation === "release" && options.denyRelease) return Response.json({ ok: false, reason: "release_unavailable" }, { status: 409 });
    const data = operation === "menu" ? { services, cardFrameOrigin: "https://book.experiencerella.com" }
      : operation === "selection" ? {
        providerGroups: selections.map(item => ({ serviceSlug: item.service, providers: [
          { id: "any-available", displayName: "Any available provider", anyAvailable: true },
          { id: `provider-${item.service}`, displayName: `Provider for ${item.service}`, anyAvailable: false },
        ] })),
        dates: selections.every(item => item.provider) && !options.noCombinedDates ? ["2026-11-01"] : [],
        ...(selections.every(item => item.provider) ? { quote: quoted } : {}),
      }
        : operation === "times" ? { times: [slot] }
          : operation === "reserve" ? {
            schedule: (options.incompleteSchedule ? committed.slice(0, -1) : [...committed].reverse()).map(item => ({ serviceSlug: item.service,
              startTime: item.service === "botox" ? "2026-11-01T10:00:00" : "2026-11-01T11:00:00",
              providerName: item.provider === "any-available" ? `Assigned provider for ${item.service}` : item.provider,
            })),
            quote: options.reserveQuote ?? quoted, timeZone: "America/Los_Angeles",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          }
            : operation === "checkout" ? { confirmation: options.confirmation ?? "CONFIRMED" }
              : operation === "release" ? { released: !options.unverifiedRelease } : {};
    return Response.json({ ok: true, ...data });
  });
  return calls;
}

describe("complete shared multi-treatment backend contract", () => {
  it.each(["napa", "vacaville"] as const)("uses authenticated owned-package context only for the selected single-service session at %s", async locationSlug => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    const ownedInput = { locationSlug, treatmentKeys: [`${locationSlug}/botox`], providerIds: { [`${locationSlug}/botox`]: "any-available" } };
    await backend.listTreatments!(locationSlug);
    backend.setOwnedPackageContext!(true);
    await backend.listProviders(ownedInput);
    const availability = await backend.loadAvailability(ownedInput);
    expect(availability.live).toBe(true);
    const reserved = await backend.reserve!(slot);
    expect(reserved.quote).toEqual(quoted);
    await backend.attachPayment!("test-token");
    expect(await backend.complete!({ ...ownedInput, client, slot })).toEqual({ ok: true, confirmationId: "confirmed" });
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST").map(call => call.body)).toEqual([{ location: locationSlug, packageOwned: true }]);
  });

  it("releases a verified owned hold before restarting a standard booking and omits the owned flag", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    await backend.listTreatments!("napa"); backend.setOwnedPackageContext!(true);
    await backend.loadAvailability(input); await backend.reserve!(slot);
    const before = calls.length;
    backend.setOwnedPackageContext!(false);
    await backend.listProviders(input);
    expect(calls.slice(before).map(call => [call.operation, call.method])).toEqual([["release", "POST"], ["menu", "GET"], ["menu", "POST"], ["selection", "POST"]]);
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST").at(-1)?.body).toEqual({ location: "napa" });
    expect(backend.quote!()).toBeUndefined();
  });

  it("does not clear an uncertain owned checkout when switching to standard mode", async () => {
    const calls = backendResponses({ failCheckout: true });
    const backend = createDefaultBackend();
    await backend.listTreatments!("napa"); backend.setOwnedPackageContext!(true);
    await backend.loadAvailability(input); await backend.reserve!(slot); await backend.attachPayment!("test-token");
    expect(await backend.complete!({ ...input, client, slot })).toMatchObject({ pending: true });
    const before = calls.length;
    backend.setOwnedPackageContext!(false);
    expect(await backend.listTreatments!("napa")).toEqual([]);
    await expect(backend.listProviders(input)).rejects.toThrow();
    expect(backend.verificationPending!()).toBe(true);
    expect(calls).toHaveLength(before);
  });

  it("releases the owned hold while credentials still exist, before logging out or changing account", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.listTreatments!("napa"); backend.setOwnedPackageContext!(true);
    await backend.loadAvailability(input); await backend.reserve!(slot);
    const before = calls.length;
    await backend.prepareIdentityChange!();
    await createPackageIdentityClient().logout();
    expect(calls.slice(before).map(call => call.operation)).toEqual(["release", "auth-logout"]);
  });

  it.each(["uncertain release", "card attached", "uncertain checkout"])("does not discard credentials or send another identity code after %s", async condition => {
    const calls = backendResponses({ failRelease: condition === "uncertain release", failCheckout: condition === "uncertain checkout" });
    const backend = createDefaultBackend(); await backend.listTreatments!("napa"); backend.setOwnedPackageContext!(true);
    await backend.loadAvailability(input); await backend.reserve!(slot);
    if (condition !== "uncertain release") await backend.attachPayment!("test-token");
    if (condition === "uncertain checkout") await backend.complete!({ ...input, slot, client });
    await expect((async () => {
      await backend.prepareIdentityChange!();
      await createPackageIdentityClient().logout();
      await createPackageIdentityClient().sendCode({ method: "email", contact: "other@example.test" });
    })()).rejects.toThrow();
    expect(calls.some(call => call.operation === "auth-logout" || call.operation === "auth-code")).toBe(false);
  });
  it("reads the menu without a real booking session, then discovers providers separately for every selected item", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    expect(await backend.listTreatments!("napa")).toEqual(catalog);
    expect(calls[0]).toMatchObject({ operation: "menu", method: "GET", body: undefined });
    expect(calls[0].query.get("location")).toBe("napa");
    expect(backend.cardFrameOrigin!()).toBeUndefined();
    const groups = await backend.listProviders(multi);
    expect(groups.map(group => group.treatmentKey)).toEqual(multi.treatmentKeys);
    expect(calls.at(-1)?.body).toEqual({ selections: [{ service: "botox" }, { service: "live-new-service" }] });
    expect(backend.quote!()).toBeUndefined();
  });
  it.each([
    ["duplicate", { ...multi, treatmentKeys: ["napa/botox", "napa/botox"] }],
    ["different location", { ...multi, treatmentKeys: ["napa/botox", "vacaville/botox"] }],
    ["too many", { ...multi, treatmentKeys: Array.from({ length: 7 }, (_, i) => `napa/service-${i}`) }],
  ])("rejects invalid %s combinations before creating a cart", async (_label, value) => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await expect(backend.listProviders(value)).rejects.toThrow("Choose up to 6");
    expect(calls).toEqual([]);
  });
  it("requires all explicit provider choices before committing a combined visit", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await expect(backend.loadAvailability({ ...multi, providerIds: { "napa/botox": "any-available" } })).rejects.toThrow("each treatment");
    expect(calls).toEqual([]);
  });
  it("refreshes a missing visitor before bootstrap without changing the selected treatments or provider choices", async () => {
    const calls = backendResponses({ requireFreshVisitor: true }); const backend = createDefaultBackend();
    const originalInput = structuredClone(multi);
    expect((await backend.loadAvailability(multi)).dates).toEqual(["2026-11-01"]);
    expect(calls.map(call => [call.operation, call.method])).toEqual([["menu", "GET"], ["menu", "POST"], ["selection", "POST"]]);
    expect(calls[0].query.get("location")).toBe("napa");
    expect(calls[1].body).toEqual({ location: "napa" });
    expect(calls[2].body).toEqual({ selections: [{ service: "botox", provider: "provider-botox" }, { service: "live-new-service", provider: "any-available" }] });
    expect(multi).toEqual(originalInput);
    expect(backend.cardFrameOrigin!()).toBe("https://book.experiencerella.com");
    expect(backend.quote!()).toEqual(quoted);
  });
  it("refreshes an expired visitor after verified hold release before reusing the same provider choices", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-17T12:00:00Z"));
    const calls = backendResponses({ requireFreshVisitor: true }); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot);
    const beforeBack = calls.length;
    vi.setSystemTime(new Date("2026-10-17T12:31:00Z"));
    expect((await backend.loadAvailability(multi)).dates).toEqual(["2026-11-01"]);
    expect(calls.slice(beforeBack).map(call => [call.operation, call.method])).toEqual([
      ["release", "POST"], ["menu", "GET"], ["menu", "POST"], ["selection", "POST"],
    ]);
    expect(calls.at(-1)?.body).toEqual({ selections: [{ service: "botox", provider: "provider-botox" }, { service: "live-new-service", provider: "any-available" }] });
    expect(calls.filter(call => call.operation === "reserve")).toHaveLength(1);
    expect(calls.some(call => call.operation === "payment" || call.operation === "checkout")).toBe(false);
  });
  it.each(["initial", "after release"])("does not create a cart or select treatments when visitor refresh fails %s", async phase => {
    const calls = backendResponses({ requireFreshVisitor: true, failMenuReadAt: phase === "initial" ? 1 : 2 });
    const backend = createDefaultBackend();
    if (phase === "after release") { await backend.loadAvailability(multi); await backend.reserve!(slot); }
    const beforeRefresh = calls.length;
    await expect(backend.loadAvailability(multi)).rejects.toThrow("could not be verified");
    expect(calls.slice(beforeRefresh).map(call => [call.operation, call.method])).toEqual(phase === "initial"
      ? [["menu", "GET"]] : [["release", "POST"], ["menu", "GET"]]);
    expect(backend.quote!()).toBeUndefined();
  });
  it("uses one cart and one joint availability request for two treatments with different providers", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.listProviders(multi);
    expect((await backend.loadAvailability(multi)).dates).toEqual(["2026-11-01"]);
    const times = await backend.loadTimesForDate({ ...multi, date: "2026-11-01" });
    const reserved = await backend.reserve!(times[0]);
    expect(reserved.schedule.map(item => [item.treatmentKey, item.startTime, item.providerName])).toEqual([
      ["napa/botox", "2026-11-01T10:00:00", "provider-botox"],
      ["napa/live-new-service", "2026-11-01T11:00:00", "Assigned provider for live-new-service"],
    ]);
    await backend.attachPayment!("opaque-vault-token");
    const result = await backend.complete!({ ...multi, slot, client });
    expect(result).toEqual({ ok: true, confirmationId: "confirmed" });
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "selection", "times", "reserve", "payment", "checkout"]);
    expect(calls.find(call => call.operation === "checkout")?.body).toEqual({
      info: { firstName: "Fixture", lastName: "User", email: "fixture@example.test", phoneNumber: "7073582928" },
    });
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST")).toHaveLength(1);
    expect(calls[3].body).toEqual({ selections: [{ service: "botox", provider: "provider-botox" }, { service: "live-new-service", provider: "any-available" }] });
  });
  it("uses the actual cart quote after provider assignment, without adding per-service deposit amounts", async () => {
    const reserveQuote = { depositCents: 7350, totalCents: 31800, needsCard: true };
    backendResponses({ reserveQuote }); const backend = createDefaultBackend();
    await backend.loadAvailability(multi);
    expect(backend.quote!()).toEqual(quoted);
    const reserved = await backend.reserve!(slot);
    expect(reserved.quote).toEqual(reserveQuote);
    expect(backend.quote!()).toEqual(reserveQuote);
  });
  it("keeps zero joint availability empty instead of fabricating an individual-service time", async () => {
    const calls = backendResponses({ noCombinedDates: true }); const backend = createDefaultBackend();
    expect(await backend.loadAvailability(multi)).toMatchObject({ dates: [], nextAvailable: [], live: true });
    expect(calls.filter(call => call.operation === "selection")).toHaveLength(1);
    expect(calls.some(call => call.operation === "times")).toBe(false);
  });
  it("reuses unchanged combined provider preferences while continuing to read times live", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await Promise.all([backend.loadAvailability(multi), backend.loadAvailability(multi)]);
    await backend.listProviders(multi);
    await backend.loadTimesForDate({ ...multi, date: "2026-11-01" });
    await backend.loadTimesForDate({ ...multi, date: "2026-11-01" });
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "times", "times"]);
  });
  it.each([["any-available", "named-one"], ["named-one", "any-available"], ["named-one", "named-two"]])(
    "starts a fresh combined cart for provider changes from %s to %s", async (first, second) => {
      const calls = backendResponses(); const backend = createDefaultBackend();
      await backend.loadAvailability({ ...multi, providerIds: { ...multi.providerIds, "napa/botox": first } });
      await backend.loadAvailability({ ...multi, providerIds: { ...multi.providerIds, "napa/botox": second } });
      expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "menu", "menu", "selection"]);
    },
  );
  it("starts a fresh session after adding a treatment and does not reuse the previous hold/payment proof", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(input); await backend.reserve!(slot);
    await backend.listProviders(multi);
    expect(backend.quote!()).toBeUndefined();
    await backend.loadAvailability(multi);
    expect((await backend.complete!({ ...multi, slot, client })).ok).toBe(false);
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "reserve", "release", "menu", "menu", "selection", "selection"]);
  });
  it("does not replay an uncertain selection even after choosing a different provider", async () => {
    const calls = backendResponses({ failSelection: true }); const backend = createDefaultBackend();
    await expect(backend.loadAvailability(multi)).rejects.toThrow("could not be verified");
    await expect(backend.loadAvailability({ ...multi, providerIds: { ...multi.providerIds, "napa/botox": "other" } })).rejects.toThrow("call Rella");
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection"]);
    const callsAfterFailure = calls.length;
    await expect(backend.listTreatments!("napa")).rejects.toThrow("call Rella");
    await expect(backend.loadAvailability(multi)).rejects.toThrow("call Rella");
    expect(calls).toHaveLength(callsAfterFailure);
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST")).toHaveLength(1);
  });
  it("does not repeat successful reserve or card attachment calls", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi);
    const results = await Promise.all([backend.reserve!(slot), backend.reserve!(slot)]);
    expect(results[0]).toEqual(results[1]);
    await Promise.all([backend.attachPayment!("token"), backend.attachPayment!("token")]);
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "reserve", "payment"]);
  });
  it("starts a fresh cart when returning from a successful reservation to choose another time", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot);
    await backend.loadAvailability(multi); await backend.reserve!({ ...slot, id: "different-time" });
    expect(calls.map(call => call.operation)).toEqual(["menu", "menu", "selection", "reserve", "release", "menu", "menu", "selection", "reserve"]);
  });
  it.each([{ failReserve: true }, { incompleteSchedule: true }])("blocks replay after an uncertain hold/readback %o", async options => {
    const calls = backendResponses(options); const backend = createDefaultBackend();
    await backend.loadAvailability(multi);
    await expect(backend.reserve!(slot)).rejects.toThrow("could not be verified");
    await expect(backend.reserve!(slot)).rejects.toThrow("call Rella");
    await expect(backend.loadAvailability(multi)).rejects.toThrow("call Rella");
    expect(calls.filter(call => call.operation === "reserve")).toHaveLength(1);
  });
  it.each(["availability", "treatments"])("blocks payment on an expired hold and allows verified release before changing %s", async change => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-17T12:00:00Z"));
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot);
    vi.setSystemTime(new Date("2026-10-17T12:16:00Z"));
    await expect(backend.attachPayment!("expired-token")).rejects.toThrow("hold has expired");
    expect(calls.some(call => call.operation === "payment")).toBe(false);
    if (change === "availability") await backend.loadAvailability(multi);
    else await backend.listProviders(input);
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST")).toHaveLength(2);
    expect(calls.filter(call => call.operation === "release")).toHaveLength(1);
  });
  it("keeps pending verification truthful and never submits checkout twice", async () => {
    const calls = backendResponses({ confirmation: "PENDING_VERIFICATION" }); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot); await backend.attachPayment!("token");
    const results = await Promise.all([backend.complete!({ ...multi, slot, client }), backend.complete!({ ...multi, slot, client })]);
    expect(results).toEqual([{ ok: true, confirmationId: "pending", pending: true }, { ok: true, confirmationId: "pending", pending: true }]);
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(1);
  });
  it.each([{ failCheckout: true }, { ambiguousCheckout: true }, { ambiguousCheckout: true, ambiguousCheckoutStatus: 409 }, { confirmation: "UNVERIFIED" }])("retains terminal pending verification after an uncertain checkout and modal reopen %o", async options => {
    const calls = backendResponses(options); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot); await backend.attachPayment!("token");
    const result = await backend.complete!({ ...multi, slot, client });
    expect(result).toEqual({ ok: true, confirmationId: "pending", pending: true });
    expect(backend.verificationPending!()).toBe(true);
    const callsBeforeReopen = calls.length;
    expect(await backend.listTreatments!("napa")).toEqual([]);
    expect(backend.verificationPending!()).toBe(true);
    await expect(backend.listProviders(multi)).rejects.toThrow("call Rella");
    await expect(backend.loadAvailability(multi)).rejects.toThrow("call Rella");
    expect(await backend.complete!({ ...multi, slot, client })).toEqual(result);
    expect(calls).toHaveLength(callsBeforeReopen);
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(1);
  });
  it("keeps a definitive validation rejection as an error rather than claiming pending submission", async () => {
    backendResponses({ rejectCheckout: true }); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot); await backend.attachPayment!("token");
    expect(await backend.complete!({ ...multi, slot, client })).toMatchObject({ ok: false });
    expect(backend.verificationPending!()).toBe(false);
  });
  it("allows an explicitly started new booking after a verified confirmation", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot); await backend.attachPayment!("token");
    expect(await backend.complete!({ ...multi, slot, client })).toEqual({ ok: true, confirmationId: "confirmed" });
    expect(backend.verificationPending!()).toBe(false);
    expect(await backend.listTreatments!("napa")).toEqual(catalog);
    await backend.loadAvailability(multi);
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST")).toHaveLength(2);
    expect(calls.some(call => call.operation === "release")).toBe(false);
  });
  it.each(["time", "provider", "treatments", "location", "reopen"])("releases a known uncompleted hold before changing %s", async change => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot);
    const start = calls.length;
    if (change === "time") await backend.loadAvailability(multi);
    if (change === "provider") await backend.loadAvailability({ ...multi, providerIds: { ...multi.providerIds, "napa/botox": "other-provider" } });
    if (change === "treatments") await backend.listProviders(input);
    if (change === "location") await backend.listTreatments!("vacaville");
    if (change === "reopen") await backend.listTreatments!("napa");
    expect(calls.slice(start).map(call => call.operation).slice(0, 2)).toEqual(["release", "menu"]);
    expect(calls[start].body).toEqual({});
    if (change === "location" || change === "reopen") {
      expect(calls[start + 1].method).toBe("GET");
      expect(backend.quote!()).toBeUndefined();
    }
  });
  it.each([{ failRelease: true }, { denyRelease: true }, { unverifiedRelease: true }])("blocks every fresh session after an uncertain/denied release %o", async options => {
    const calls = backendResponses(options); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot);
    await expect(backend.loadAvailability(multi)).rejects.toThrow("hold could not be released");
    const afterRelease = calls.length;
    await expect(backend.listTreatments!("napa")).rejects.toThrow("hold could not be released");
    await expect(backend.listProviders(input)).rejects.toThrow("hold could not be released");
    expect(calls).toHaveLength(afterRelease);
    expect(calls.filter(call => call.operation === "menu" && call.method === "POST")).toHaveLength(1);
    expect(calls.filter(call => call.operation === "release")).toHaveLength(1);
    expect(backend.quote!()).toBeUndefined();
  });
  it("explains why changing a visit after card attachment needs verification and keeps its known hold", async () => {
    const calls = backendResponses(); const backend = createDefaultBackend();
    await backend.loadAvailability(multi); await backend.reserve!(slot); await backend.attachPayment!("linked-token");
    const beforeChange = calls.length;
    await expect(backend.loadAvailability(multi)).rejects.toThrow("card has already been linked");
    await expect(backend.listTreatments!("napa")).rejects.toThrow("card has already been linked");
    expect(calls).toHaveLength(beforeChange);
  });
});
