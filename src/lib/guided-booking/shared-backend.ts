import type { BookingLocation } from "@/lib/booking-routes";
import { backendTreatments, MAX_GUIDED_TREATMENTS } from "./catalog";
import type { GuidedBookingBackend, GuidedProviderGroup, GuidedScheduledTreatment } from "./types";

type Quote = { depositCents: number; totalCents: number; needsCard: boolean };
type Selection = { dates: string[]; quote: Quote };
type Completion = Awaited<ReturnType<NonNullable<GuidedBookingBackend["complete"]>>>;

class BookingRequestError extends Error {
  constructor(readonly reason: string, message: string, readonly definitive = false) {
    super(message);
  }
}

export function createSharedBookingBackend(): GuidedBookingBackend {
  let location: BookingLocation | null = null;
  let selected: string | undefined;
  let services: string[] = [];
  let groups: GuidedProviderGroup[] | undefined;
  let provider: string | undefined;
  let selection: Selection | undefined;
  let frameOrigin: string | undefined;
  let reservedSlot: string | undefined;
  let schedule: GuidedScheduledTreatment[] = [];
  let expiresAt: string | undefined;
  let paymentAttached = false;
  let uncertain = false;
  let uncertaintyMessage: string | undefined;
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
    selected = undefined;
    services = [];
    groups = undefined;
    provider = undefined;
    selection = undefined;
    frameOrigin = undefined;
    reservedSlot = undefined;
    schedule = [];
    expiresAt = undefined;
    paymentAttached = false;
    uncertain = false;
    uncertaintyMessage = undefined;
    if (!completion?.ok || !completion.pending) completion = undefined;
  }

  function requireVerifiedSession(allowExpiredHold = false) {
    if (uncertain || completion) {
      throw new Error(uncertaintyMessage ?? (paymentAttached
        ? "Your card has already been linked to this visit. Please call Rella before changing your treatments or time."
        : "We could not verify this booking session. Please call Rella before continuing."));
    }
    if (!allowExpiredHold && reservedSlot && expiresAt && Date.parse(expiresAt) <= Date.now()) {
      throw new Error("Your appointment hold has expired. Please choose a new time before continuing.");
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
      const definitive = data.stage === "SAFE_TO_RETRY" || data.reason === "pilot_disabled";
      throw new BookingRequestError(typeof data.reason === "string" ? data.reason : "unverified_response", message, definitive);
    }
    return data;
  }

  async function startSession(loc: BookingLocation) {
    await releaseKnownHold();
    const data = await call("menu", { location: loc });
    clearSession();
    location = loc;
    frameOrigin = data.cardFrameOrigin;
  }

  async function releaseKnownHold() {
    if (!reservedSlot) return;
    requireVerifiedSession(true);
    try {
      if (paymentAttached) {
        throw new Error("Your card has already been linked to this visit. Please call Rella before changing your treatments or time.");
      }
      const data = await call("release", {});
      if (data.released !== true) throw new Error("The appointment hold release could not be verified.");
      // Only a verified release may clear the held session and its approval.
      clearSession();
    } catch {
      uncertain = true;
      uncertaintyMessage = paymentAttached
        ? "Your card has already been linked to this visit. Please call Rella before changing your treatments or time."
        : "Your appointment hold could not be released. Please call Rella before changing your treatments or time.";
      selection = undefined;
      schedule = [];
      throw new Error(uncertaintyMessage);
    }
  }

  function servicesFor(loc: BookingLocation, keys: string[]) {
    if (!keys.length || keys.length > MAX_GUIDED_TREATMENTS || new Set(keys).size !== keys.length
      || keys.some(key => !key.startsWith(`${loc}/`) || !key.slice(loc.length + 1) || key.slice(loc.length + 1).includes("/"))) {
      throw new Error(`Choose up to ${MAX_GUIDED_TREATMENTS} different treatments at this location.`);
    }
    return keys.map(key => key.slice(loc.length + 1));
  }

  function providerChoice(loc: BookingLocation, keys: string[], providerIds: Record<string, string>) {
    const selectedServices = servicesFor(loc, keys);
    if (Object.keys(providerIds).length !== keys.length || keys.some(key => !providerIds[key])) {
      throw new Error("Choose a provider for each treatment to continue.");
    }
    return selectedServices.map((service, i) => ({ service, provider: providerIds[keys[i]] }));
  }

  function readQuote(value: unknown): Quote {
    const quote = value as Quote | undefined;
    if (!quote || typeof quote.needsCard !== "boolean" || !Number.isSafeInteger(quote.depositCents)
      || quote.depositCents < 0 || !Number.isSafeInteger(quote.totalCents) || quote.totalCents < 0) {
      throw new Error("The booking amount could not be verified. Please call Rella.");
    }
    return { depositCents: quote.depositCents, totalCents: quote.totalCents, needsCard: quote.needsCard };
  }

  function readGroups(loc: BookingLocation, selectedServices: string[], value: unknown): GuidedProviderGroup[] {
    const data = value as Array<{ serviceSlug: string; providers: GuidedProviderGroup["providers"] }> | undefined;
    if (!Array.isArray(data) || data.length !== selectedServices.length
      || new Set(data.map(group => group.serviceSlug)).size !== data.length
      || data.some(group => !selectedServices.includes(group.serviceSlug) || !Array.isArray(group.providers)
        || !group.providers.length || group.providers.some(item => typeof item.id !== "string"
          || typeof item.displayName !== "string" || typeof item.anyAvailable !== "boolean"))) {
      throw new Error("Providers could not be verified for each treatment. Please call Rella.");
    }
    return selectedServices.map(service => ({
      treatmentKey: `${loc}/${service}`,
      providers: data.find(group => group.serviceSlug === service)!.providers,
    }));
  }

  async function select(loc: BookingLocation, keys: string[], requestedProviders?: Record<string, string>) {
    const selectedServices = servicesFor(loc, keys);
    const serviceSignature = JSON.stringify(selectedServices);
    const choices = requestedProviders ? providerChoice(loc, keys, requestedProviders) : undefined;
    const providerSignature = choices ? JSON.stringify(choices) : undefined;
    requireVerifiedSession(true);
    if (location !== loc || (selected && selected !== serviceSignature)
      || (providerSignature !== undefined && provider !== undefined && provider !== providerSignature)) {
      // Boulevard retains an explicit staff preference on the cart. A fresh
      // session prevents another provider or “any” from inheriting that choice.
      await startSession(loc);
    }
    requireVerifiedSession();
    if (providerSignature === undefined && selected === serviceSignature && groups) return;
    if (providerSignature !== undefined && provider === providerSignature && selection) return;
    try {
      const data = await call("selection", { selections: choices ?? selectedServices.map(service => ({ service })) });
      const verifiedGroups = readGroups(loc, selectedServices, data.providerGroups);
      if (providerSignature !== undefined) {
        if (!Array.isArray(data.dates) || data.dates.some((date: unknown) => typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
          throw new Error("Availability could not be verified for this visit. Please call Rella.");
        }
        selection = { dates: data.dates, quote: readQuote(data.quote) };
        provider = providerSignature;
      }
      selected = serviceSignature;
      services = selectedServices;
      groups = verifiedGroups;
    } catch (error) {
      // Do not replay a selection mutation whose response may have been lost.
      if (providerSignature !== undefined) uncertain = true;
      throw error;
    }
  }

  return {
    mode: "live",
    verificationPending() { return completion?.ok === true && completion.pending === true; },
    listTreatments(loc) {
      const generation = ++catalogGeneration;
      return serial(async () => {
        if (completion?.ok && completion.pending) return [];
        if (completion?.ok) clearSession(); // A completed booking has no hold to release.
        else if (completion) completion = undefined; // A verified pre-checkout rejection.
        requireVerifiedSession(true);
        await releaseKnownHold();
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
        return groups ?? [];
      });
    },
    loadAvailability(input) {
      return serial(async () => {
        providerChoice(input.locationSlug, input.treatmentKeys, input.providerIds);
        requireVerifiedSession(true);
        // Returning from the contact/payment step is an explicit opportunity to
        // choose another time. Release the verified hold before a fresh cart.
        if (reservedSlot) await startSession(input.locationSlug);
        await select(input.locationSlug, input.treatmentKeys, input.providerIds);
        return { dates: [...selection!.dates], nextAvailable: [], live: true };
      });
    },
    async loadTimesForDate(input) {
      await tail;
      requireVerifiedSession();
      if (location !== input.locationSlug || selected !== JSON.stringify(servicesFor(input.locationSlug, input.treatmentKeys))
        || provider !== JSON.stringify(providerChoice(input.locationSlug, input.treatmentKeys, input.providerIds)) || !selection) throw new Error("Selection changed.");
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
        if (reservedSlot === slot.id) return { schedule: [...schedule], quote: { ...selection.quote }, expiresAt: expiresAt! };
        if (reservedSlot) throw new Error("Please restart booking to choose a different time.");
        try {
          const data = await call("reserve", { bookableTimeId: slot.id });
          const serverSchedule = data.schedule as Array<{ serviceSlug: string; startTime: string; providerName?: string }> | undefined;
          if (!Array.isArray(serverSchedule) || serverSchedule.length !== services.length
            || new Set(serverSchedule.map(item => item.serviceSlug)).size !== services.length
            || serverSchedule.some(item => !services.includes(item.serviceSlug) || typeof item.startTime !== "string"
              || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(item.startTime) || !Number.isFinite(Date.parse(item.startTime)))
            || data.timeZone !== "America/Los_Angeles" || typeof data.expiresAt !== "string"
            || !Number.isFinite(Date.parse(data.expiresAt)) || Date.parse(data.expiresAt) <= Date.now()) {
            throw new Error("Your reserved visit could not be verified. Please call Rella before continuing.");
          }
          selection = { ...selection, quote: readQuote(data.quote) };
          schedule = serverSchedule.map(item => ({ treatmentKey: `${location}/${item.serviceSlug}`, startTime: item.startTime, timeZone: data.timeZone,
            ...(typeof item.providerName === "string" ? { providerName: item.providerName } : {}),
          })).sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
          reservedSlot = slot.id;
          expiresAt = data.expiresAt;
          paymentAttached = false;
          return { schedule: [...schedule], quote: { ...selection.quote }, expiresAt: expiresAt! };
        } catch (error) {
          uncertain = true;
          throw error;
        }
      });
    },
    quote() { return selection ? { ...selection.quote } : undefined; },
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
        let checkoutSent = false;
        try {
          requireVerifiedSession();
          if (location !== input.locationSlug || selected !== JSON.stringify(servicesFor(input.locationSlug, input.treatmentKeys))
            || provider !== JSON.stringify(providerChoice(input.locationSlug, input.treatmentKeys, input.providerIds)) || reservedSlot !== input.slot.id
            || !selection || (selection.quote.needsCard && !paymentAttached)) {
            return { ok: false, reason: "Please complete the treatment, time and payment steps first." };
          }
          checkoutSent = true;
          const data = await call("checkout", { info: {
            firstName: input.client.firstName, lastName: input.client.lastName,
            email: input.client.email, phoneNumber: input.client.phone,
          } });
          // Only the backend's durable, verified confirmation counts as success.
          if (data.confirmation === "CONFIRMED") completion = { ok: true, confirmationId: "confirmed" };
          else if (data.confirmation === "PENDING_VERIFICATION") completion = { ok: true, confirmationId: "pending", pending: true };
          else completion = { ok: true, confirmationId: "pending", pending: true };
        } catch (error) {
          completion = checkoutSent && !(error instanceof BookingRequestError && error.definitive)
            ? { ok: true, confirmationId: "pending", pending: true }
            : { ok: false, reason: "We could not verify the booking. Please call Rella before trying again." };
        }
        return completion;
      });
    },
  };
}
