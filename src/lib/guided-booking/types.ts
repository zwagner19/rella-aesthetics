import type { BookingCategory, BookingLocation } from "@/lib/booking-routes";
import type { BookingSiteScope, LiveCatalogClinic, LiveCatalogService } from "./live-catalog";

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

export interface GuidedLocation {
  slug: BookingLocation;
  displayName: string;
  streetShort: string;
  addressLine: string;
  phoneDisplay: string;
  phoneHref: string;
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

export interface GuidedBookingState {
  step: GuidedBookingStep;
  siteScope: BookingSiteScope;
  locationSlug: BookingLocation | null;
  catalogNonce: number;
  clinic: LiveCatalogClinic | null;
  services: LiveCatalogService[];
  catalogError: string | null;
  selectedServiceSlug: string | null;
  pendingServiceSlug: string | null;
  pendingCategory: BookingCategory | null;
  date: string;
  dates: string[];
  slot: GuidedSlot | null;
  reservedSlotId: string | null;
  search: string;
  expandedCategories: string[];
  busy: boolean;
  error: string | null;
  confirmation: "confirmed" | "pending" | null;
  needsCard: boolean;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    assessmentContactConsent: boolean;
    marketingConsent: boolean;
  };
}

export interface GuidedBookingOpenEvent {
  type: "booking_open";
  intent: GuidedBookingIntent;
  at: number;
}

export interface GuidedBookingConfirmedEvent {
  type: "booking_confirmed";
  confirmationId: string;
  at: number;
}

export type GuidedBookingAnalyticsEvent =
  | GuidedBookingOpenEvent
  | GuidedBookingConfirmedEvent;
