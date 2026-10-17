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
  it("validates contact information", () => {
    expect(clientLooksComplete({ firstName: "A", lastName: "B", email: "bad", phone: "707" })).toBe(false);
    expect(clientLooksComplete({ firstName: "A", lastName: "B", email: "fixture@example.test", phone: "7073582928" })).toBe(true);
  });
});
describe("complete shared backend contract", () => {
  it("uses live menu, selection, availability, reservation, token and durable confirmation", async () => {
    const calls: Array<{operation: string; body: Record<string, unknown> | undefined}> = [];
    const fetcher = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      const operation = String(url).split("/").pop()!.split("?")[0];
      const body = init?.body ? JSON.parse(String(init.body)) : undefined; calls.push({ operation, body });
      const data = operation === "menu" ? { services, cardFrameOrigin: "https://book.experiencerella.com" }
        : operation === "selection" ? { providers: [{ id: "any-available", displayName: "Any available provider", anyAvailable: true }], dates: body?.provider ? ["2026-11-01"] : [], quote: body?.provider ? { depositCents: 5000, totalCents: 20000, needsCard: true } : undefined }
        : operation === "times" ? { times: [{ id: "opaque-time", startTime: "2026-11-01T18:00:00Z" }] }
        : operation === "checkout" ? { confirmation: "CONFIRMED" } : {};
      return Response.json({ ok: true, ...data });
    });
    const backend = createDefaultBackend(); expect(backend.mode).toBe("live");
    expect(await backend.listTreatments!("napa")).toEqual(catalog);
    const input = { locationSlug: "napa" as const, treatmentKeys: ["napa/botox"], providerId: "any-available" };
    expect(await backend.listProviders(input)).toHaveLength(1);
    expect((await backend.loadAvailability(input)).dates).toEqual(["2026-11-01"]);
    const times = await backend.loadTimesForDate!({ ...input, date: "2026-11-01" });
    await backend.reserve!(times[0]); await backend.attachPayment!("opaque-vault-token");
    const result = await backend.complete!({ ...input, slot: times[0], client: { firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928" } });
    expect(result).toMatchObject({ ok: true, confirmationId: "confirmed" });
    expect(calls.map(c => c.operation)).toEqual(["menu", "selection", "menu", "selection", "times", "reserve", "payment", "checkout"]);
    expect(calls.find(c => c.operation === "payment")?.body).toEqual({ token: "opaque-vault-token" });
    expect(backend.quote!()?.depositCents).toBe(5000);
    expect(fetcher).toHaveBeenCalledTimes(8);
  });
  it("never labels pending verification as confirmed", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true, confirmation: "PENDING_VERIFICATION" }));
    const result = await createDefaultBackend().complete!({ locationSlug: "napa", treatmentKeys: ["napa/botox"], providerId: "any-available", slot: { id: "time", startTime: "2026-11-01T18:00:00Z", label: "10:00 AM" }, client: { firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928" } });
    expect(result).toMatchObject({ ok: true, pending: true });
  });
});
