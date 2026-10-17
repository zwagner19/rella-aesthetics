import type { BookingLocation } from "@/lib/booking-routes";
import {
  ALLOWS_MULTI_TREATMENT,
  MAX_GUIDED_TREATMENTS,
  getGuidedLocation,
  mapIntentToTreatmentKey,
  resolveGuidedTreatment,
} from "./catalog";
import type {
  GuidedBookingIntent,
  GuidedBookingState,
  GuidedBookingStep,
  GuidedSlot,
} from "./types";
import { GUIDED_BOOKING_STEPS } from "./types";

export const initialGuidedBookingState: GuidedBookingState = {
  treatments: [],
  step: "location",
  locationSlug: null,
  selectedTreatmentKeys: [],
  providerIds: {},
  date: "",
  slot: null,
  search: "",
  expandedCategories: [],
  busy: false,
  error: null,
  availabilityUnverified: true,
  confirmationId: null,
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

export function canGoBack(state: GuidedBookingState): boolean {
  return stepIndex(state.step) > 0 && !state.confirmationId;
}

export function previousStep(step: GuidedBookingStep): GuidedBookingStep {
  const idx = stepIndex(step);
  return GUIDED_BOOKING_STEPS[Math.max(0, idx - 1)] ?? "location";
}

export function bootstrapFromIntent(
  intent: GuidedBookingIntent = {},
): GuidedBookingState {
  const location =
    intent.location && getGuidedLocation(intent.location)
      ? intent.location
      : null;

  const treatmentKey =
    location != null
      ? mapIntentToTreatmentKey({
          location,
          service: intent.service,
          category: intent.category,
        })
      : null;

  // Unknown service/category mappings fail closed: open at treatments (or
  // location) without inventing a selection.
  if (location && treatmentKey) {
    return {
      ...initialGuidedBookingState,
      step: "review",
      locationSlug: location,
      selectedTreatmentKeys: [treatmentKey],
      expandedCategories: [],
    };
  }

  if (location) {
    return {
      ...initialGuidedBookingState,
      step: "treatments",
      locationSlug: location,
    };
  }

  return { ...initialGuidedBookingState };
}

export function selectLocation(
  state: GuidedBookingState,
  locationSlug: BookingLocation,
): GuidedBookingState {
  if (!getGuidedLocation(locationSlug)) {
    return { ...state, error: "That location is not available for online booking." };
  }

  const keepTreatments = state.selectedTreatmentKeys.filter((key) =>
    key.startsWith(`${locationSlug}/`),
  );
  const sameLocation = state.locationSlug === locationSlug;

  return {
    ...state,
    locationSlug,
    ownedPackageServiceKey: sameLocation ? state.ownedPackageServiceKey : undefined,
    // The menu-loading effect runs when the location changes. Keep its result
    // when a client returns to the location step and chooses that location again.
    treatments: sameLocation ? state.treatments : [],
    quote: undefined,
    selectedTreatmentKeys: keepTreatments,
    providerIds: {},
    schedule: undefined,
    reservationExpiresAt: undefined,
    date: "",
    slot: null,
    availabilityUnverified: true,
    expandedCategories: sameLocation ? state.expandedCategories : [],
    search: sameLocation ? state.search : "",
    error: null,
    step: "treatments",
  };
}

export function toggleTreatment(
  state: GuidedBookingState,
  treatmentKey: string,
): GuidedBookingState {
  if (!state.locationSlug) {
    return { ...state, error: "Choose a location first." };
  }

  const treatment = resolveGuidedTreatment(
    state.locationSlug,
    treatmentKey.split("/")[1] ?? "",
    state.treatments,
  );
  if (!treatment || treatment.key !== treatmentKey) {
    return {
      ...state,
      error: "That treatment is not available at this location.",
    };
  }

  const selected = new Set(state.selectedTreatmentKeys);
  if (selected.has(treatmentKey)) {
    selected.delete(treatmentKey);
  } else if (!ALLOWS_MULTI_TREATMENT) {
    selected.clear();
    selected.add(treatmentKey);
  } else {
    if (selected.size >= MAX_GUIDED_TREATMENTS) return {
      ...state, error: `Choose up to ${MAX_GUIDED_TREATMENTS} treatments for one visit.`,
    };
    selected.add(treatmentKey);
  }

  return {
    ...state,
    selectedTreatmentKeys: [...selected],
    ownedPackageServiceKey: selected.size === 1 && selected.has(state.ownedPackageServiceKey ?? "") ? state.ownedPackageServiceKey : undefined,
    quote: undefined,
    providerIds: Object.fromEntries(Object.entries(state.providerIds).filter(([key]) => selected.has(key))),
    schedule: undefined,
    reservationExpiresAt: undefined,
    date: "",
    slot: null,
    availabilityUnverified: true,
    error: null,
  };
}

export function removeTreatment(
  state: GuidedBookingState,
  treatmentKey: string,
): GuidedBookingState {
  return {
    ...state,
    selectedTreatmentKeys: state.selectedTreatmentKeys.filter(
      (key) => key !== treatmentKey,
    ),
    ownedPackageServiceKey: state.ownedPackageServiceKey === treatmentKey ? undefined : state.ownedPackageServiceKey,
    quote: undefined,
    providerIds: Object.fromEntries(Object.entries(state.providerIds).filter(([key]) => key !== treatmentKey)),
    schedule: undefined,
    reservationExpiresAt: undefined,
    date: "",
    slot: null,
    availabilityUnverified: true,
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
  if (state.confirmationId) return state;

  if (step !== "location" && !state.locationSlug) {
    return { ...state, step: "location", error: "Choose a location to continue." };
  }

  if (
    (step === "review" ||
      step === "provider" ||
      step === "datetime" ||
      step === "complete") &&
    state.selectedTreatmentKeys.length === 0
  ) {
    return {
      ...state,
      step: "treatments",
      error: "Add a treatment to continue.",
    };
  }

  if ((step === "datetime" || step === "complete") && !providersComplete(state)) return {
    ...state, step: "provider", error: "Choose a provider for each treatment to continue.",
  };

  return { ...state, step, error: null };
}

export function goBack(state: GuidedBookingState): GuidedBookingState {
  if (!canGoBack(state)) return state;
  return { ...state, step: previousStep(state.step), error: null };
}

export function selectProvider(
  state: GuidedBookingState,
  treatmentKey: string,
  providerId: string,
): GuidedBookingState {
  if (!state.selectedTreatmentKeys.includes(treatmentKey)) return {
    ...state, error: "Choose this treatment before selecting its provider.",
  };
  if (state.providerIds[treatmentKey] === providerId) return state;
  return {
    ...state,
    providerIds: { ...state.providerIds, [treatmentKey]: providerId },
    schedule: undefined,
    reservationExpiresAt: undefined,
    quote: undefined,
    date: "",
    slot: null,
    availabilityUnverified: true,
    error: null,
  };
}

export function providersComplete(state: GuidedBookingState): boolean {
  return state.selectedTreatmentKeys.length > 0
    && state.selectedTreatmentKeys.every(key => Boolean(state.providerIds[key]));
}

export function selectDate(
  state: GuidedBookingState,
  date: string,
): GuidedBookingState {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ...state, error: "Choose a valid date." };
  }
  return { ...state, date, slot: null, schedule: undefined, reservationExpiresAt: undefined, error: null };
}

export function selectSlot(
  state: GuidedBookingState,
  slot: GuidedSlot,
): GuidedBookingState {
  return { ...state, slot, schedule: undefined, reservationExpiresAt: undefined, error: null };
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

export function contactFieldsLookComplete(client: GuidedBookingState["client"]): boolean {
  return (
    client.firstName.trim().length >= 1 &&
    client.lastName.trim().length >= 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim()) &&
    client.phone.replace(/\D/g, "").length >= 10
  );
}

export function clientLooksComplete(client: GuidedBookingState["client"]): boolean {
  return contactFieldsLookComplete(client) && client.assessmentContactConsent === true;
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
