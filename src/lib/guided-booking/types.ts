import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";

export type GuidedBookingStep =
  | "location"
  | "treatments"
  | "review"
  | "provider"
  | "datetime"
  | "complete";

export const GUIDED_BOOKING_STEPS: readonly GuidedBookingStep[] = [
  "location",
  "treatments",
  "review",
  "provider",
  "datetime",
  "complete",
] as const;

export type PaymentRuleCopy = "deposit" | "card_on_file" | "no_card";

export interface GuidedLocation {
  slug: BookingLocation;
  displayName: string;
  streetShort: string;
  addressLine: string;
  phoneDisplay: string;
  phoneHref: string;
}

export interface GuidedTreatment {
  /** Location-scoped bookable key: `${location}/${serviceSlug}`. */
  key: string;
  locationSlug: BookingLocation;
  serviceSlug: string;
  displayName: string;
  category: BookingCategory | "consults";
  shortDescription: string;
  image?: string;
  imageAlt?: string;
  durationCopy?: string;
  /** Verified deposit amount in cents from rella-booking catalog probes. */
  depositCents?: number;
  paymentRule: PaymentRuleCopy;
  isConsultation: boolean;
  /** Editorial prep/downtime from approved Rella site copy only. */
  prepCopy?: string;
  downtimeCopy?: string;
}

export interface GuidedProvider {
  id: string;
  displayName: string;
  credentials?: string;
  /** True when this is the "any available" option. */
  anyAvailable: boolean;
}

export interface GuidedSlot {
  id: string;
  startTime: string;
  label: string;
}

export interface GuidedBookingIntent {
  location?: BookingLocation;
  service?: string;
  category?: BookingCategory;
}

export interface GuidedVisitItem {
  treatmentKey: string;
}

export interface GuidedBookingState {
  step: GuidedBookingStep;
  locationSlug: BookingLocation | null;
  selectedTreatmentKeys: string[];
  providerId: string | null;
  date: string;
  slot: GuidedSlot | null;
  search: string;
  expandedCategories: string[];
  busy: boolean;
  error: string | null;
  /** True when live Boulevard availability has not been verified for this session. */
  availabilityUnverified: boolean;
  /** Set after a successful mock confirmation (tests) or never for handoff mode. */
  confirmationId: string | null;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface GuidedBookingOpenEvent {
  type: "booking_open";
  intent: GuidedBookingIntent;
  at: number;
}

export interface GuidedBookingHandoffEvent {
  type: "booking_handoff";
  locationSlug: BookingLocation;
  serviceSlug: string;
  at: number;
}

export interface GuidedBookingConfirmedEvent {
  type: "booking_confirmed";
  confirmationId: string;
  at: number;
}

export type GuidedBookingAnalyticsEvent =
  | GuidedBookingOpenEvent
  | GuidedBookingHandoffEvent
  | GuidedBookingConfirmedEvent;

export interface AvailabilityResult {
  /** ISO dates (YYYY-MM-DD) known bookable for the current selection. */
  dates: string[];
  /** Next available slots for quick pick. */
  nextAvailable: GuidedSlot[];
  /** Honest flag: mock/sandbox only until Boulevard Client API is wired. */
  live: boolean;
  message?: string;
}

export interface GuidedBookingBackend {
  readonly mode: "mock" | "handoff";
  listProviders(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
  }): Promise<GuidedProvider[]>;
  loadAvailability(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerId: string | null;
    date?: string;
  }): Promise<AvailabilityResult>;
  loadTimesForDate(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerId: string | null;
    date: string;
  }): Promise<GuidedSlot[]>;
  /**
   * Mutations are intentionally unavailable on the marketing site until a
   * sandbox Client API path exists. Mock backend may confirm; handoff never.
   */
  complete?(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerId: string | null;
    slot: GuidedSlot;
    client: GuidedBookingState["client"];
  }): Promise<{ ok: true; confirmationId: string } | { ok: false; reason: string }>;
}
