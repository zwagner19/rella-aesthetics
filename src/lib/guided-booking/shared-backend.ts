import type { BookingLocation } from "@/lib/booking-routes";
import { backendTreatments } from "./catalog";
import type { GuidedBookingBackend, GuidedProvider } from "./types";

type Quote = { depositCents: number; totalCents: number; needsCard: boolean };
type Selection = { dates: string[]; providers: GuidedProvider[]; quote: Quote };
type Completion = Awaited<ReturnType<NonNullable<GuidedBookingBackend["complete"]>>>;

class BookingRequestError extends Error {
  constructor(readonly reason: string, message: string) {
    super(message);
  }
}

export function createSharedBookingBackend(): GuidedBookingBackend {
  let location: BookingLocation | null = null;
  let selected: string | null = null;
  let providers: GuidedProvider[] | undefined;
  let provider: string | undefined;
  let selection: Selection | undefined;
  let frameOrigin: string | undefined;
  let reservedSlot: string | undefined;
  let paymentAttached = false;
  let uncertain = false;
  let completion: Completion | undefined;
  let catalogGeneration = 0;
  // Serialize session-changing requests so late responses cannot overwrite a newer cart cookie.
  let tail: Promise<unknown> = Promise.resolve();
  function serial<T>(work: () => Promise<T>): Promise<T> {
    const result = tail.then(work, work);
    tail = result.catch(() => undefined);
    return result;
  }

  function clearSession() {
    location = null;
    selected = null;
    providers = undefined;
    provider = undefined;
    selection = undefined;
    frameOrigin = undefined;
    reservedSlot = undefined;
    paymentAttached = false;
    uncertain = false;
    completion = undefined;
  }

  function requireVerifiedSession() {
    if (uncertain || completion) {
      throw new Error("We could not verify this booking session. Please restart booking or call Rella before continuing.");
    }
  }

  async function call(operation: string, body?: unknown, query?: Record<string, string>) {
    const search = query ? `?${new URLSearchParams(query)}` : "";
    let response: Response;
    let data;
    try {
      response = await fetch(`/api/booking-v2/bridge/${operation}${search}`, {
        method: body === undefined ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        credentials: "same-origin",
        cache: "no-store",
      });
      data = await response.json();
    } catch {
      throw new BookingRequestError("unverified_response", "Booking could not be verified. Please restart booking or call Rella.");
    }
    if (!response.ok || !data.ok) {
      const message = data.reason === "payment_rule_mismatch"
        ? "The booking amount needs review. Please call Rella before booking."
        : data.reason === "options_required"
          ? "This treatment needs additional booking options. Please call Rella to arrange it."
          : data.reason === "service_unavailable"
            ? "This treatment is not available for online booking at this location."
            : "Booking could not be verified. Please restart booking or call Rella.";
      throw new BookingRequestError(typeof data.reason === "string" ? data.reason : "unverified_response", message);
    }
    return data;
  }

  async function startSession(loc: BookingLocation) {
    const data = await call("menu", { location: loc });
    clearSession();
    location = loc;
    frameOrigin = data.cardFrameOrigin;
  }

  function serviceFor(loc: BookingLocation, keys: string[]) {
    if (keys.length !== 1 || !keys[0].startsWith(`${loc}/`)) {
      throw new Error("Choose one treatment at this location.");
    }
    return keys[0].slice(loc.length + 1);
  }

  async function select(loc: BookingLocation, keys: string[], requestedProvider?: string) {
    const service = serviceFor(loc, keys);
    requireVerifiedSession();
    if (location !== loc || (selected && selected !== service)
      || (requestedProvider !== undefined && provider !== undefined && provider !== requestedProvider)) {
      // Boulevard retains an explicit staff preference on the cart. A fresh
      // session prevents another provider or “any” from inheriting that choice.
      await startSession(loc);
    }
    requireVerifiedSession();
    if (requestedProvider === undefined && selected === service && providers) return;
    if (requestedProvider !== undefined && provider === requestedProvider && selection) return;
    try {
      const data = await call("selection", { service, ...(requestedProvider ? { provider: requestedProvider } : {}) });
      selected = service;
      providers = data.providers;
      if (requestedProvider !== undefined) {
        provider = requestedProvider;
        selection = data as Selection;
      }
    } catch (error) {
      // Do not replay a selection mutation whose response may have been lost.
      if (requestedProvider !== undefined) uncertain = true;
      throw error;
    }
  }

  return {
    mode: "live",
    listTreatments(loc) {
      const generation = ++catalogGeneration;
      return serial(async () => {
        const data = await call("menu", undefined, { location: loc });
        if (generation !== catalogGeneration) throw new Error("Location changed.");
        // Opening the menu starts a new local attempt, including after closing a
        // previously completed modal. Browsing alone creates no booking session.
        clearSession();
        return backendTreatments(loc, data.services);
      });
    },
    listProviders(input) {
      return serial(async () => {
        await select(input.locationSlug, input.treatmentKeys);
        return providers ?? [];
      });
    },
    loadAvailability(input) {
      return serial(async () => {
        if (!input.providerId) throw new Error("Choose a provider to continue.");
        serviceFor(input.locationSlug, input.treatmentKeys);
        requireVerifiedSession();
        // Returning from the contact/payment step is an explicit opportunity to
        // choose another time. Leave the known hold alone and use a fresh cart.
        if (reservedSlot) await startSession(input.locationSlug);
        await select(input.locationSlug, input.treatmentKeys, input.providerId);
        return { dates: [...selection!.dates], nextAvailable: [], live: true };
      });
    },
    async loadTimesForDate(input) {
      await tail;
      requireVerifiedSession();
      if (location !== input.locationSlug || selected !== serviceFor(input.locationSlug, input.treatmentKeys)
        || provider !== input.providerId || !selection) throw new Error("Selection changed.");
      const data = await call("times", undefined, { date: input.date });
      return data.times.map((slot: { id: string; startTime: string }) => ({
        ...slot,
        label: new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(new Date(slot.startTime)),
      }));
    },
    reserve(slot) {
      return serial(async () => {
        requireVerifiedSession();
        if (!selection) throw new Error("Choose a treatment and provider first.");
        if (reservedSlot === slot.id) return;
        if (reservedSlot) throw new Error("Please restart booking to choose a different time.");
        try {
          await call("reserve", { bookableTimeId: slot.id });
          reservedSlot = slot.id;
        } catch (error) {
          uncertain = true;
          throw error;
        }
      });
    },
    quote() { return selection?.quote; },
    cardFrameOrigin() { return frameOrigin; },
    attachPayment(token) {
      return serial(async () => {
        requireVerifiedSession();
        if (!reservedSlot || !selection) throw new Error("Choose and reserve a time first.");
        if (paymentAttached) return;
        try {
          await call("payment", { token });
          paymentAttached = true;
        } catch (error) {
          uncertain = true;
          throw error;
        }
      });
    },
    complete(input) {
      return serial(async () => {
        if (completion) return completion;
        try {
          requireVerifiedSession();
          if (location !== input.locationSlug || selected !== serviceFor(input.locationSlug, input.treatmentKeys)
            || provider !== input.providerId || reservedSlot !== input.slot.id
            || !selection || (selection.quote.needsCard && !paymentAttached)) {
            return { ok: false, reason: "Please complete the treatment, time and payment steps first." };
          }
          const data = await call("checkout", { info: {
            firstName: input.client.firstName, lastName: input.client.lastName,
            email: input.client.email, phoneNumber: input.client.phone,
          } });
          // Only the backend's durable, verified confirmation counts as success.
          if (data.confirmation === "CONFIRMED") completion = { ok: true, confirmationId: "confirmed" };
          else if (data.confirmation === "PENDING_VERIFICATION") completion = { ok: true, confirmationId: "pending", pending: true };
          else completion = { ok: false, reason: "We could not verify the booking. Please call Rella before trying again." };
        } catch {
          completion = { ok: false, reason: "We could not verify the booking. Please call Rella before trying again." };
        }
        return completion;
      });
    },
  };
}
