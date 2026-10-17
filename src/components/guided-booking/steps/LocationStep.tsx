"use client";

import { GUIDED_LOCATIONS } from "@/lib/guided-booking";
import type { BookingLocation } from "@/lib/booking-routes";

export function LocationStep({
  selected,
  onSelect,
}: {
  selected: BookingLocation | null;
  onSelect: (slug: BookingLocation) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose your clinic
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Services, providers, and availability are location-specific.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDED_LOCATIONS.map((location) => {
          const active = selected === location.slug;
          return (
            <button
              key={location.slug}
              type="button"
              onClick={() => onSelect(location.slug)}
              aria-pressed={active}
              className={`rounded-sm border px-5 py-5 text-left transition-colors ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-rule/70 bg-white text-ink hover:border-ink/40"
              }`}
            >
              <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.16em] opacity-70">
                {location.slug === "napa" ? "Napa" : "Vacaville"}
              </span>
              <span className="mt-2 block text-base font-medium">
                {location.displayName}
              </span>
              <span
                className={`mt-1 block text-sm font-light ${
                  active ? "text-white/75" : "text-silver"
                }`}
              >
                {location.addressLine}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
