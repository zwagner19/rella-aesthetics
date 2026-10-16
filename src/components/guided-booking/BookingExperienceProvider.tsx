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
import {
  emitGuidedBookingEvent,
  type BookingSiteScope,
} from "@/lib/guided-booking";
import { BookingModal } from "./BookingModal";

interface GuidedBookingContextValue {
  open: (intent?: BookingIntent) => void;
  close: () => void;
  isOpen: boolean;
  siteScope: BookingSiteScope;
}

const GuidedBookingContext = createContext<GuidedBookingContextValue | null>(
  null,
);

export function useGuidedBooking(): GuidedBookingContextValue | null {
  return useContext(GuidedBookingContext);
}

export function BookingExperienceProvider({
  children,
  siteScope = "aesthetics",
}: {
  children: ReactNode;
  siteScope?: BookingSiteScope;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<BookingIntent>({});

  const open = useCallback((next: BookingIntent = {}) => {
    setIntent(next);
    setIsOpen(true);
    emitGuidedBookingEvent({
      type: "booking_open",
      intent: next,
      at: Date.now(),
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ open, close, isOpen, siteScope }),
    [open, close, isOpen, siteScope],
  );

  return (
    <GuidedBookingContext.Provider value={value}>
      {children}
      {isOpen ? (
        <BookingModal
          intent={intent}
          siteScope={siteScope}
          onClose={close}
        />
      ) : null}
    </GuidedBookingContext.Provider>
  );
}
