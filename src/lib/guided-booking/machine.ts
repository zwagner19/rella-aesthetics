import type { BookingLocation } from "@/lib/booking-routes";
import {
  ALLOWS_MULTI_TREATMENT,
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
  step: "location",
  locationSlug: null,
  selectedTreatmentKeys: [],
  providerId: null,
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

  return {
    ...state,
    locationSlug,
    selectedTreatmentKeys: keepTreatments,
    providerId: null,
    date: "",
    slot: null,
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
    selected.add(treatmentKey);
  }

  return {
    ...state,
    selectedTreatmentKeys: [...selected],
    providerId: null,
    date: "",
    slot: null,
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
    providerId: null,
    date: "",
    slot: null,
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

  return { ...state, step, error: null };
}

export function goBack(state: GuidedBookingState): GuidedBookingState {
  if (!canGoBack(state)) return state;
  return { ...state, step: previousStep(state.step), error: null };
}

export function selectProvider(
  state: GuidedBookingState,
  providerId: string,
): GuidedBookingState {
  return {
    ...state,
    providerId,
    date: "",
    slot: null,
    error: null,
  };
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
  return { ...state, slot, error: null };
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
    client.phone.replace(/\D/g, "").length >= 10
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
