"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BookingIntent } from "@/lib/booking-routes";
import { setPublicAnalyticsBookingState } from "@/lib/public-analytics-parent";
import {
  createDefaultBackend,
  emitGuidedBookingEvent,
  type GuidedBookingBackend,
} from "@/lib/guided-booking";
import { BookingModal } from "./BookingModal";

interface GuidedBookingContextValue {
  open: (intent?: BookingIntent) => void;
  close: () => void;
  isOpen: boolean;
  backend: GuidedBookingBackend;
}

const GuidedBookingContext = createContext<GuidedBookingContextValue | null>(
  null,
);

export function useGuidedBooking(): GuidedBookingContextValue | null {
  return useContext(GuidedBookingContext);
}

export function BookingExperienceProvider({
  children,
  backend,
}: {
  children: ReactNode;
  backend?: GuidedBookingBackend;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<BookingIntent>({});
  const resolvedBackend = useMemo(
    () => backend ?? createDefaultBackend(),
    [backend],
  );

  const open = useCallback((next: BookingIntent = {}) => {
    setPublicAnalyticsBookingState(true);
    resolvedBackend.setOwnedPackageContext?.(false);
    setIntent(next);
    setIsOpen(true);
    emitGuidedBookingEvent({
      type: "booking_open",
      intent: next,
      at: Date.now(),
    });
  }, [resolvedBackend]);

  const close = useCallback(() => {
    setPublicAnalyticsBookingState(false);
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ open, close, isOpen, backend: resolvedBackend }),
    [open, close, isOpen, resolvedBackend],
  );

  return (
    <GuidedBookingContext.Provider value={value}>
      {children}
      {isOpen ? (
        <BookingModal
          intent={intent}
          backend={resolvedBackend}
          onClose={close}
        />
      ) : null}
    </GuidedBookingContext.Provider>
  );
}
