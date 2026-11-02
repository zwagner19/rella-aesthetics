import { expect, it, vi } from "vitest";
import { createSharedBookingBackend } from "./shared-backend";
import { registerAestheticsBookingPreparation } from "../aesthetics-booking-boundary";

it.each(["napa", "vacaville"] as const)("waits for attribution acknowledgement before creating a %s cart", async location => {
  let acknowledge = () => {};
  const pending = new Promise<void>(resolve => { acknowledge = resolve; });
  const unregister = registerAestheticsBookingPreparation(() => pending);
  const network = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
    const path = String(input);
    return Response.json({ ok: true, ...(path.endsWith("selection") ? { providerGroups: [{ serviceSlug: "fixture-treatment", providers: [{ id: "any", displayName: "Any", anyAvailable: true }] }] } : { services: [] }) });
  });
  try {
    const backend = createSharedBookingBackend();
    const selecting = backend.listProviders({ locationSlug: location, treatmentKeys: [`${location}/fixture-treatment`] });
    for (let tick = 0; tick < 5; tick += 1) await Promise.resolve();
    expect(network).not.toHaveBeenCalled();
    acknowledge();
    await selecting;
    const cart = network.mock.calls.find(([input, init]) => String(input).endsWith("/menu") && init?.method === "POST");
    expect(cart).toBeDefined();
    expect(JSON.parse(String(cart?.[1]?.body))).toEqual({ location });
  } finally { unregister(); network.mockRestore(); }
});
