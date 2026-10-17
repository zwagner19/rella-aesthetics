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

export type PaymentRuleCopy = "deposit" | "card_on_file" | "no_card" | "pending";

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
  /** Boulevard menu category (rella-booking / Client API). */
  category: string;
  shortDescription: string;
  /** Service prerequisites from the live menu, shown at review. */
  bookingNotes?: string;
  image?: string;
  imageAlt?: string;
  durationCopy?: string;
  /** Boulevard default/list price in cents (Admin-read). */
  listPriceCents?: number;
  /** Verified deposit amount in cents from rella-booking catalog probes. */
  depositCents?: number;
  paymentRule: PaymentRuleCopy;
  isConsultation: boolean;
  /** True when exact rella-booking /book/{loc}/{slug} handoff is verified. */
  onlineHandoff?: boolean;
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

export interface GuidedProviderGroup {
  treatmentKey: string;
  providers: GuidedProvider[];
}

export interface GuidedScheduledTreatment {
  treatmentKey: string;
  startTime: string;
  providerName?: string;
  timeZone: string;
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
  treatments?: GuidedTreatment[];
  quote?: { depositCents: number; totalCents: number; needsCard: boolean };
  confirmationPending?: boolean;
  step: GuidedBookingStep;
  locationSlug: BookingLocation | null;
  selectedTreatmentKeys: string[];
  /** A single service chosen from the authenticated, location-scoped package wallet. */
  ownedPackageServiceKey?: string;
  /** Provider choice for each selected location-scoped treatment key. */
  providerIds: Record<string, string>;
  /** Actual per-treatment schedule read back from Boulevard after reservation. */
  schedule?: GuidedScheduledTreatment[];
  reservationExpiresAt?: string;
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
  /** True only for availability returned by the shared booking backend. */
  live: boolean;
  message?: string;
}

export interface GuidedBookingBackend {
  readonly mode: "mock" | "live";
  /** Terminal uncertainty in this browser instance; do not start another booking. */
  verificationPending?(): boolean;
  setOwnedPackageContext?(enabled: boolean): void;
  /** Release a verified uncompleted hold before replacing its authenticated owner. */
  prepareIdentityChange?(): Promise<void>;
  listTreatments?(location: BookingLocation): Promise<GuidedTreatment[]>;
  reserve?(slot: GuidedSlot): Promise<{
    schedule: GuidedScheduledTreatment[];
    quote: { depositCents: number; totalCents: number; needsCard: boolean };
    expiresAt: string;
  }>;
  cardFrameOrigin?(): string | undefined;
  attachPayment?(token: string): Promise<void>;
  quote?(): { depositCents: number; totalCents: number; needsCard: boolean } | undefined;
  listProviders(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
  }): Promise<GuidedProviderGroup[]>;
  loadAvailability(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerIds: Record<string, string>;
    date?: string;
  }): Promise<AvailabilityResult>;
  loadTimesForDate(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerIds: Record<string, string>;
    date: string;
  }): Promise<GuidedSlot[]>;
  /**
   * Live completion delegates to the existing durable booking finalizer.
   */
  complete?(input: {
    locationSlug: BookingLocation;
    treatmentKeys: string[];
    providerIds: Record<string, string>;
    slot: GuidedSlot;
    client: GuidedBookingState["client"];
  }): Promise<{ ok: true; confirmationId: string; pending?: boolean } | { ok: false; reason: string }>;
}
