import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendTreatments, resolveGuidedTreatment, treatmentsByCategory, mapIntentToTreatmentKey, bootstrapFromIntent, selectLocation, toggleTreatment, goToStep, clientLooksComplete, createDefaultBackend } from "./index";
const services = [{ serviceSlug: "botox", displayName: "New Patient Tox", category: "Injectables", description: "Consultation" }, { serviceSlug: "live-new-service", displayName: "New facial", category: "New category", description: "Live description" }];
const catalog = backendTreatments("napa", services);
beforeEach(() => { vi.restoreAllMocks(); });
describe("shared booking menu and state", () => {
  it("has no fallback catalog and reflects new backend services and category order", () => {
    expect(resolveGuidedTreatment("napa", "botox")).toBeNull();
    expect(resolveGuidedTreatment("napa", "live-new-service", catalog)?.displayName).toBe("New facial");
    expect(resolveGuidedTreatment("vacaville", "botox", catalog)).toBeNull();
    expect(treatmentsByCategory("napa", "", catalog).map(g => g.category)).toEqual(["Injectables", "New category"]);
    expect(treatmentsByCategory("napa", "facial", catalog)).toHaveLength(1);
    expect(mapIntentToTreatmentKey({ location: "napa", service: "tox", treatments: catalog })).toBe("napa/botox");
  });
  it("waits for the backend before selecting a CTA and clears location-dependent state", () => {
    const initial = bootstrapFromIntent({ location: "napa", service: "botox" });
    expect(initial.step).toBe("treatments"); expect(initial.selectedTreatmentKeys).toEqual([]);
    let state: import("./types").GuidedBookingState = { ...initial, treatments: catalog };
    state = toggleTreatment(state, "napa/botox"); state = toggleTreatment(state, "napa/live-new-service");
    expect(state.selectedTreatmentKeys).toEqual(["napa/live-new-service"]);
    const changed = selectLocation(state, "vacaville");
    expect(changed.treatments).toEqual([]); expect(changed.selectedTreatmentKeys).toEqual([]); expect(changed.slot).toBeNull();
    expect(goToStep(changed, "review").step).toBe("treatments");
    expect(changed.expandedCategories).toEqual([]);
  });
  it("keeps the loaded menu when a client returns and chooses the same location", () => {
    const state: import("./types").GuidedBookingState = {
      ...bootstrapFromIntent({ location: "napa" }), treatments: catalog,
      selectedTreatmentKeys: ["napa/botox"], expandedCategories: ["Injectables"],
      providerId: "named-provider", date: "2026-11-01",
      slot: { id: "old-time", startTime: "2026-11-01T18:00:00Z", label: "10:00 AM" },
      quote: { depositCents: 5000, totalCents: 20000, needsCard: true },
      availabilityUnverified: false,
    };
    const sameLocation = selectLocation(state, "napa");
    expect(treatmentsByCategory("napa", "", sameLocation.treatments)).toHaveLength(2);
    expect(sameLocation.selectedTreatmentKeys).toEqual(["napa/botox"]);
    expect(sameLocation.expandedCategories).toEqual(["Injectables"]);
    expect(sameLocation).toMatchObject({ step: "treatments", providerId: null, date: "", slot: null, availabilityUnverified: true });
    expect(sameLocation.quote).toBeUndefined();
    const changedLocation = selectLocation(state, "vacaville");
    expect(changedLocation.treatments).toEqual([]);
    expect(changedLocation.expandedCategories).toEqual([]);
  });
  it("validates contact information", () => {
    expect(clientLooksComplete({ firstName: "A", lastName: "B", email: "bad", phone: "707" })).toBe(false);
    expect(clientLooksComplete({ firstName: "A", lastName: "B", email: "fixture@example.test", phone: "7073582928" })).toBe(true);
  });
});
describe("complete shared backend contract", () => {
  type Request = { operation: string; method: string; body?: Record<string, unknown>; query: URLSearchParams };
  function backendResponses(options: { confirmation?: string; failSelection?: boolean; failReserve?: boolean } = {}) {
    const calls: Request[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      const parsed = new URL(String(url), "https://experiencerella.com");
      const operation = parsed.pathname.split("/").pop()!;
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ operation, body, method: init?.method ?? "GET", query: parsed.searchParams });
      if (operation === "selection" && body?.provider && options.failSelection) throw new Error("Network interrupted after send");
      if (operation === "reserve" && options.failReserve) return Response.json({ ok: false, reason: "reserve_uncertain" }, { status: 502 });
      const data = operation === "menu" ? { services, cardFrameOrigin: "https://book.experiencerella.com" }
        : operation === "selection" ? { providers: [{ id: "any-available", displayName: "Any available provider", anyAvailable: true }], dates: body?.provider ? ["2026-11-01"] : [], quote: body?.provider ? { depositCents: 5000, totalCents: 20000, needsCard: true } : undefined }
          : operation === "times" ? { times: [{ id: "opaque-time", startTime: "2026-11-01T18:00:00Z" }] }
            : operation === "checkout" ? { confirmation: options.confirmation ?? "CONFIRMED" } : {};
      return Response.json({ ok: true, ...data });
    });
    return calls;
  }
  const input = { locationSlug: "napa" as const, treatmentKeys: ["napa/botox"], providerId: "any-available" };
  const slot = { id: "opaque-time", startTime: "2026-11-01T18:00:00Z", label: "10:00 AM" };
  const client = { firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928" };
  it("reads the full menu before creating a real booking session", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    expect(await backend.listTreatments!("napa")).toEqual(catalog);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ operation: "menu", method: "GET", body: undefined });
    expect(calls[0].query.get("location")).toBe("napa");
    expect(backend.cardFrameOrigin!()).toBeUndefined();
    await backend.listProviders(input);
    expect(calls.slice(1).map(c => [c.operation, c.method])).toEqual([["menu", "POST"], ["selection", "POST"]]);
  });
  it("uses selection, live times, reservation, token and durable confirmation", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend(); expect(backend.mode).toBe("live");
    expect(await backend.listTreatments!("napa")).toEqual(catalog);
    expect(await backend.listProviders(input)).toHaveLength(1);
    expect((await backend.loadAvailability(input)).dates).toEqual(["2026-11-01"]);
    const times = await backend.loadTimesForDate!({ ...input, date: "2026-11-01" });
    await backend.reserve!(times[0]); await backend.attachPayment!("opaque-vault-token");
    const result = await backend.complete!({ ...input, slot: times[0], client });
    expect(result).toMatchObject({ ok: true, confirmationId: "confirmed" });
    expect(calls.map(c => c.operation)).toEqual(["menu", "menu", "selection", "selection", "times", "reserve", "payment", "checkout"]);
    expect(calls.find(c => c.operation === "payment")?.body).toEqual({ token: "opaque-vault-token" });
    expect(backend.quote!()?.depositCents).toBe(5000);
  });
  it("reuses the same provider selection on back navigation while reading times live", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    await Promise.all([backend.loadAvailability(input), backend.loadAvailability(input)]);
    await backend.listProviders(input);
    await backend.loadAvailability(input);
    await backend.loadTimesForDate({ ...input, date: "2026-11-01" });
    await backend.loadTimesForDate({ ...input, date: "2026-11-01" });
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection", "times", "times"]);
    expect(calls[1].body?.provider).toBe("any-available");
    expect(backend.quote!()).toEqual({ depositCents: 5000, totalCents: 20000, needsCard: true });
  });
  it.each([
    ["any-available", "named-one"], ["named-one", "any-available"], ["named-one", "named-two"],
  ])("starts a clean cart when changing provider from %s to %s", async (first, second) => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    await backend.loadAvailability({ ...input, providerId: first });
    await backend.loadAvailability({ ...input, providerId: second });
    expect(calls.map(c => [c.operation, c.body?.provider])).toEqual([
      ["menu", undefined], ["selection", first], ["menu", undefined], ["selection", second],
    ]);
  });
  it("does not replay an uncertain selection and allows a fresh attempt after reopening the menu", async () => {
    const calls = backendResponses({ failSelection: true });
    const backend = createDefaultBackend();
    await expect(backend.loadAvailability(input)).rejects.toThrow("could not be verified");
    await expect(backend.loadAvailability(input)).rejects.toThrow("restart booking");
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection"]);
    await backend.listTreatments!("napa");
    await expect(backend.loadAvailability(input)).rejects.toThrow("could not be verified");
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection", "menu", "menu", "selection"]);
  });
  it("does not repeat successful reserve or card attachment calls", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    await backend.loadAvailability(input);
    await Promise.all([backend.reserve!(slot), backend.reserve!(slot)]);
    await Promise.all([backend.attachPayment!("opaque-vault-token"), backend.attachPayment!("opaque-vault-token")]);
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection", "reserve", "payment"]);
  });
  it("starts a fresh session when returning from a successful reservation to choose another time", async () => {
    const calls = backendResponses();
    const backend = createDefaultBackend();
    await backend.loadAvailability(input);
    await backend.reserve!(slot);
    await backend.loadAvailability(input);
    await backend.reserve!({ ...slot, id: "different-time" });
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection", "reserve", "menu", "selection", "reserve"]);
    expect(calls.filter(c => c.operation === "selection").map(c => c.body)).toEqual([
      { service: "botox", provider: "any-available" }, { service: "botox", provider: "any-available" },
    ]);
    expect(calls.filter(c => c.operation === "reserve").map(c => c.body)).toEqual([
      { bookableTimeId: "opaque-time" }, { bookableTimeId: "different-time" },
    ]);
  });
  it("does not repeat a reserve after an ambiguous response", async () => {
    const calls = backendResponses({ failReserve: true });
    const backend = createDefaultBackend();
    await backend.loadAvailability(input);
    await expect(backend.reserve!(slot)).rejects.toThrow("could not be verified");
    await expect(backend.reserve!(slot)).rejects.toThrow("restart booking");
    await expect(backend.loadAvailability(input)).rejects.toThrow("restart booking");
    await expect(backend.loadAvailability({ ...input, providerId: "named-one" })).rejects.toThrow("restart booking");
    expect(calls.filter(c => c.operation === "reserve")).toHaveLength(1);
    expect(calls.filter(c => c.operation === "menu")).toHaveLength(1);
  });
  it("keeps pending verification truthful and does not submit checkout twice", async () => {
    const calls = backendResponses({ confirmation: "PENDING_VERIFICATION" });
    const backend = createDefaultBackend();
    await backend.loadAvailability(input);
    await backend.reserve!(slot);
    await backend.attachPayment!("opaque-vault-token");
    const results = await Promise.all([backend.complete!({ ...input, slot, client }), backend.complete!({ ...input, slot, client })]);
    expect(results).toEqual([{ ok: true, confirmationId: "pending", pending: true }, { ok: true, confirmationId: "pending", pending: true }]);
    expect(calls.filter(c => c.operation === "checkout")).toHaveLength(1);
    await backend.listTreatments!("napa");
    await backend.loadAvailability(input);
    expect(calls.filter(c => c.operation === "menu" && c.method === "POST")).toHaveLength(2);
  });
  it("does not submit checkout before verified selection and reservation", async () => {
    const fetcher = vi.spyOn(globalThis, "fetch");
    const result = await createDefaultBackend().complete!({ ...input, slot, client });
    expect(result).toMatchObject({ ok: false });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
