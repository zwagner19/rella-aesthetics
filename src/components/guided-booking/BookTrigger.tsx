"use client";

import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  resolveBookingHref,
  type BookingIntent,
} from "@/lib/booking-routes";
import { useGuidedBooking } from "./BookingExperienceProvider";

type BookTriggerProps = {
  intent?: BookingIntent;
  children: ReactNode;
  className?: string;
  /** Force external navigation (weight-loss / no-JS fallbacks). */
  forceExternal?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

/**
 * Opens the in-site guided booking shell. Falls back to the canonical
 * book.experiencerella.com href for weight-loss, no-JS, and middle-click.
 */
export function BookTrigger({
  intent = {},
  children,
  className = "",
  forceExternal = false,
  onClick,
  ...rest
}: BookTriggerProps) {
  const booking = useGuidedBooking();
  const href = resolveBookingHref(intent);
  const isWeightLoss = href.includes("book.rellaweightloss.com");
  const external = forceExternal || isWeightLoss || !booking;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // The first-party consent boundary can hold this click before React runs.
    // Keep its source mounted (including mobile navigation) until it resumes.
    if (event.defaultPrevented) return;
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (external) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;
    event.preventDefault();
    booking.open(intent);
  }

  return (
    <a
      href={href}
      className={className}
      data-guided-booking={external ? "external" : "modal"}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
