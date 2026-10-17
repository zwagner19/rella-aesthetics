import type { BookingLocation } from "@/lib/booking-routes";
import type {
  AvailabilityResult,
  GuidedBookingBackend,
  GuidedProvider,
  GuidedSlot,
} from "./types";

const ANY_PROVIDER: GuidedProvider = {
  id: "any-available",
  displayName: "Any available provider",
  credentials: "Widest choice of times",
  anyAvailable: true,
};

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mockSlotsForDate(date: string): GuidedSlot[] {
  const hours = [9, 10, 11, 13, 14, 15, 16];
  return hours.map((hour, index) => {
    const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
    return {
      id: `mock-slot-${date}-${index}`,
      startTime: start.toISOString(),
      label: start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  });
}

/**
 * Test-only backend. Labels every availability payload as non-live.
 * May complete a fake confirmation — never touches Boulevard.
 */
export function createMockBackend(): GuidedBookingBackend {
  return {
    mode: "mock",
    async listProviders() {
      return [
        ANY_PROVIDER,
        {
          id: "mock-provider-a",
          displayName: "Provider A",
          credentials: "RN",
          anyAvailable: false,
        },
        {
          id: "mock-provider-b",
          displayName: "Provider B",
          credentials: "PA-C",
          anyAvailable: false,
        },
      ];
    },
    async loadAvailability() {
      const dates = [1, 2, 3, 5, 6, 8, 9].map(isoDateOffset);
      const nextAvailable = dates.slice(0, 3).flatMap((date) =>
        mockSlotsForDate(date).slice(0, 1),
      );
      return {
        dates,
        nextAvailable,
        live: false,
        message:
          "Demo availability for tests only — not live Boulevard inventory.",
      } satisfies AvailabilityResult;
    },
    async loadTimesForDate({ date }) {
      return mockSlotsForDate(date);
    },
    async complete() {
      return {
        ok: true as const,
        confirmationId: `mock-${Date.now().toString(36)}`,
      };
    },
  };
}

/**
 * Production/preview path for the marketing site until Boulevard Client API
 * credentials (or a CORS-safe rella-booking read API) are available here.
 *
 * - Never invents live availability.
 * - Never calls createCart / reserve / checkout / payment.
 * - Completion is a handoff to book.experiencerella.com.
 */
export function createHandoffBackend(): GuidedBookingBackend {
  return {
    mode: "handoff",
    async listProviders(input: {
      locationSlug: BookingLocation;
      treatmentKeys: string[];
    }) {
      void input;
      return [ANY_PROVIDER];
    },
    async loadAvailability() {
      return {
        dates: [],
        nextAvailable: [],
        live: false,
        message:
          "Live calendar times load in Rella’s secure booking app (Boulevard). Continue to choose a real slot — nothing here is inventing availability.",
      };
    },
    async loadTimesForDate() {
      return [];
    },
  };
}

export function createDefaultBackend(): GuidedBookingBackend {
  return createHandoffBackend();
}
