"use client";

import type { ReactNode } from "react";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";

type NapaHouseBookCtaProps = {
  children: ReactNode;
  className?: string;
};

/** Location-pinned booking CTA — additive for location pages only. */
export function NapaHouseBookCta({ children, className = "" }: NapaHouseBookCtaProps) {
  return (
    <BookTrigger intent={{ location: "napa" }} className={className}>
      {children}
    </BookTrigger>
  );
}
