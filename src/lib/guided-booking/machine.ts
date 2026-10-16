import type { BookingLocation } from "@/lib/booking-routes";
import {
  categoriesForIntent,
  type BookingSiteScope,
  type LiveCatalogClinic,
  type LiveCatalogService,
} from "./live-catalog";
import { getGuidedLocation } from "./catalog";
import type {
  GuidedBookingIntent,
  GuidedBookingState,
  GuidedBookingStep,
  GuidedSlot,
} from "./types";
import { GUIDED_BOOKING_STEPS } from "./types";

export const initialGuidedBookingState: GuidedBookingState = {
  step: "location",
  siteScope: "aesthetics",
  locationSlug: null,
  catalogNonce: 0,
  clinic: null,
  services: [],
  catalogError: null,
  selectedServiceSlug: null,
  pendingServiceSlug: null,
  pendingCategory: null,
  date: "",
  dates: [],
  slot: null,
  reservedSlotId: null,
  search: "",
  expandedCategories: [],
  busy: false,
  error: null,
  confirmation: null,
  needsCard: false,
  client: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    assessmentContactConsent: false,
    marketingConsent: false,
  },
};

function stepIndex(step: GuidedBookingStep): number {
  return GUIDED_BOOKING_STEPS.indexOf(step);
}

function normalizeSlug(value: string | undefined): string | null {
  if (!value) return null;
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
  return slug || null;
}

export function canGoBack(state: GuidedBookingState): boolean {
  return stepIndex(state.step) > 0 && !state.confirmation;
}

export function previousStep(step: GuidedBookingStep): GuidedBookingStep {
  const idx = stepIndex(step);
  return GUIDED_BOOKING_STEPS[Math.max(0, idx - 1)] ?? "location";
}

export function selectedService(
  state: GuidedBookingState,
): LiveCatalogService | null {
  return (
    state.services.find(
      (service) => service.serviceSlug === state.selectedServiceSlug,
    ) ?? null
  );
}

export function bootstrapFromIntent(
  intent: GuidedBookingIntent = {},
  siteScope: BookingSiteScope = "aesthetics",
): GuidedBookingState {
  const location =
    intent.location && getGuidedLocation(intent.location) ? intent.location : null;
  const base: GuidedBookingState = {
    ...initialGuidedBookingState,
    siteScope,
    pendingServiceSlug: normalizeSlug(intent.service),
    pendingCategory: intent.category ?? null,
  };
  if (!location) return base;
  return {
    ...base,
    step: "treatments",
    locationSlug: location,
  };
}

export function selectLocation(
  state: GuidedBookingState,
  locationSlug: BookingLocation,
): GuidedBookingState {
  if (!getGuidedLocation(locationSlug)) {
    return { ...state, error: "That location is not available for online booking." };
  }
  return {
    ...state,
    locationSlug,
    catalogNonce: state.catalogNonce + 1,
    clinic: null,
    services: [],
    catalogError: null,
    selectedServiceSlug: null,
    date: "",
    dates: [],
    slot: null,
    reservedSlotId: null,
    needsCard: false,
    error: null,
    step: "treatments",
  };
}

export function applyCatalog(
  state: GuidedBookingState,
  clinic: LiveCatalogClinic,
): GuidedBookingState {
  const match = state.pendingServiceSlug
    ? clinic.services.find(
        (service) => service.serviceSlug === state.pendingServiceSlug,
      )
    : undefined;
  const selectedStillThere = clinic.services.some(
    (service) => service.serviceSlug === state.selectedServiceSlug,
  );
  return {
    ...state,
    clinic,
    services: clinic.services,
    catalogError: null,
    selectedServiceSlug: match?.serviceSlug ?? (selectedStillThere ? state.selectedServiceSlug : null),
    expandedCategories: categoriesForIntent(clinic.services, state.pendingCategory),
    error: null,
  };
}

export function setCatalogError(
  state: GuidedBookingState,
  message: string,
): GuidedBookingState {
  return {
    ...state,
    clinic: null,
    services: [],
    catalogError: message,
    selectedServiceSlug: null,
    error: message,
  };
}

export function toggleTreatment(
  state: GuidedBookingState,
  serviceSlug: string,
): GuidedBookingState {
  if (!state.locationSlug) {
    return { ...state, error: "Choose a location first." };
  }
  const service = state.services.find((item) => item.serviceSlug === serviceSlug);
  if (!service) {
    return { ...state, error: "That treatment is not on the live menu for this clinic." };
  }
  const selected =
    state.selectedServiceSlug === serviceSlug ? null : serviceSlug;
  return {
    ...state,
    selectedServiceSlug: selected,
    date: "",
    dates: [],
    slot: null,
    reservedSlotId: null,
    needsCard: false,
    error: null,
  };
}

export function clearTreatment(state: GuidedBookingState): GuidedBookingState {
  return {
    ...state,
    selectedServiceSlug: null,
    date: "",
    dates: [],
    slot: null,
    reservedSlotId: null,
    needsCard: false,
    error: null,
  };
}

export function setSearch(
  state: GuidedBookingState,
  search: string,
): GuidedBookingState {
  return { ...state, search: search.slice(0, 80) };
}

export function toggleCategory(
  state: GuidedBookingState,
  category: string,
): GuidedBookingState {
  const open = new Set(state.expandedCategories);
  if (open.has(category)) open.delete(category);
  else open.add(category);
  return { ...state, expandedCategories: [...open] };
}

export function goToStep(
  state: GuidedBookingState,
  step: GuidedBookingStep,
): GuidedBookingState {
  if (state.confirmation) return state;
  if (step !== "location" && !state.locationSlug) {
    return { ...state, step: "location", error: "Choose a location to continue." };
  }
  if (
    (step === "review" ||
      step === "provider" ||
      step === "datetime" ||
      step === "complete") &&
    !state.selectedServiceSlug
  ) {
    return {
      ...state,
      step: "treatments",
      error: "Add a treatment to continue.",
    };
  }
  return { ...state, step, error: null };
}

export function goBack(state: GuidedBookingState): GuidedBookingState {
  if (!canGoBack(state)) return state;
  return { ...state, step: previousStep(state.step), error: null, needsCard: false };
}

export function selectDate(
  state: GuidedBookingState,
  date: string,
): GuidedBookingState {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ...state, error: "Choose a valid date." };
  }
  return { ...state, date, slot: null, error: null };
}

export function selectSlot(
  state: GuidedBookingState,
  slot: GuidedSlot,
): GuidedBookingState {
  return {
    ...state,
    slot,
    reservedSlotId: state.reservedSlotId === slot.id ? state.reservedSlotId : null,
    error: null,
  };
}

export function setDates(
  state: GuidedBookingState,
  dates: string[],
): GuidedBookingState {
  return { ...state, dates, error: null };
}

export function updateClient(
  state: GuidedBookingState,
  patch: Partial<GuidedBookingState["client"]>,
): GuidedBookingState {
  return {
    ...state,
    client: { ...state.client, ...patch },
    error: null,
  };
}

export function clientLooksComplete(client: GuidedBookingState["client"]): boolean {
  return (
    client.firstName.trim().length >= 1 &&
    client.lastName.trim().length >= 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim()) &&
    client.phone.replace(/\D/g, "").length >= 10 &&
    client.assessmentContactConsent === true
  );
}

export function progressLabel(step: GuidedBookingStep): string {
  switch (step) {
    case "location":
      return "Location";
    case "treatments":
      return "Treatments";
    case "review":
      return "Review";
    case "provider":
      return "Provider";
    case "datetime":
      return "Date & time";
    case "complete":
      return "Complete";
    default: {
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}
