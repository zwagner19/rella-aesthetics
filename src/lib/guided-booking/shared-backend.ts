import type { BookingLocation } from "@/lib/booking-routes";
import { backendTreatments } from "./catalog";
import type { GuidedBookingBackend, GuidedProvider } from "./types";

export function createSharedBookingBackend(): GuidedBookingBackend {
  let location: BookingLocation | null = null, selected: string | null = null;
  let providers: GuidedProvider[] = [];
  let quote: { depositCents: number; totalCents: number; needsCard: boolean } | undefined;
  let frameOrigin: string | undefined;
  let sessionGeneration = 0;
  // Serialize session-changing requests so late responses cannot overwrite a newer cart cookie.
  let tail: Promise<unknown> = Promise.resolve();
  function serial<T>(work: () => Promise<T>): Promise<T> {
    const result = tail.then(work, work); tail = result.catch(() => undefined); return result;
  }
  async function call(operation: string, body?: unknown, date?: string) {
    const response = await fetch(`/api/booking-v2/bridge/${operation}${date ? `?date=${encodeURIComponent(date)}` : ""}`, {
      method: body === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), credentials: "same-origin", cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.reason === "payment_rule_mismatch" ? "The booking amount needs review. Please call Rella before booking." : data.reason === "options_required" ? "This treatment needs additional booking options. Please call Rella to arrange it." : "Booking could not be verified. Please try again or call Rella.");
    return data;
  }
  async function menu(loc: BookingLocation) {
    const data = await call("menu", { location: loc });
    location = loc; selected = null; providers = []; quote = undefined; frameOrigin = data.cardFrameOrigin;
    return backendTreatments(loc, data.services);
  }
  async function select(loc: BookingLocation, keys: string[], provider?: string | null) {
    if (keys.length !== 1 || !keys[0].startsWith(`${loc}/`)) throw new Error("Choose one treatment at this location.");
    const service = keys[0].slice(loc.length + 1);
    if (location !== loc || (selected && selected !== service)) await menu(loc);
    const data = await call("selection", { service, ...(provider ? { provider } : {}) });
    selected = service; providers = data.providers; quote = data.quote;
    return data;
  }
  return {
    mode: "live",
    listTreatments(loc) { const generation = ++sessionGeneration; return serial(async () => {
      const result = await menu(loc); if (generation !== sessionGeneration) throw new Error("Location changed."); return result;
    }); },
    listProviders(input) { return serial(async () => { await select(input.locationSlug, input.treatmentKeys); return providers; }); },
    loadAvailability(input) { return serial(async () => {
      // Fresh cart when returning to “any” after a named provider so no stale preference survives.
      await menu(input.locationSlug);
      const data = await select(input.locationSlug, input.treatmentKeys, input.providerId);
      return { dates: data.dates, nextAvailable: [], live: true };
    }); },
    async loadTimesForDate(input) {
      await tail;
      if (location !== input.locationSlug || selected !== input.treatmentKeys[0]?.split("/")[1]) throw new Error("Selection changed.");
      const data = await call("times", undefined, input.date);
      return data.times.map((slot: { id: string; startTime: string }) => ({ ...slot, label: new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(new Date(slot.startTime)) }));
    },
    reserve(slot) { return serial(async () => { await call("reserve", { bookableTimeId: slot.id }); }); },
    quote() { return quote; },
    cardFrameOrigin() { return frameOrigin; },
    attachPayment(token) { return serial(async () => { await call("payment", { token }); }); },
    async complete(input) {
      try {
        const data = await serial(() => call("checkout", { info: { firstName: input.client.firstName, lastName: input.client.lastName, email: input.client.email, phoneNumber: input.client.phone } }));
        // Only the backend's durable, verified confirmation counts as success.
        if (data.confirmation === "CONFIRMED") return { ok: true, confirmationId: "confirmed" };
        if (data.confirmation === "PENDING_VERIFICATION") return { ok: true, confirmationId: "pending", pending: true };
        return { ok: false, reason: "We could not verify the booking. Please call Rella before trying again." };
      } catch (error) { return { ok: false, reason: error instanceof Error ? error.message : "Booking could not be verified. Please call Rella." }; }
    },
  };
}
