"use client";

import {
  treatmentsByCategory,
} from "@/lib/guided-booking";
import type { BookingLocation } from "@/lib/booking-routes";
import type { GuidedBookingState } from "@/lib/guided-booking";

export function TreatmentsStep({
  locationSlug,
  state,
  loading = false,
  onSearch,
  onToggleCategory,
  onToggleTreatment,
}: {
  locationSlug: BookingLocation;
  state: GuidedBookingState;
  loading?: boolean;
  onSearch: (value: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleTreatment: (key: string) => void;
}) {
  const groups = treatmentsByCategory(locationSlug, state.search, state.treatments);
  // Default: all Boulevard categories collapsed after location — expand on tap.
  const expanded = new Set(state.expandedCategories);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose a treatment
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Add the treatments you’d like for your visit. You can choose a provider
          for each treatment and find a time for the complete visit.
        </p>
      </div>

      <label className="block">
        <span className="sr-only">Search treatments</span>
        <input
          type="search"
          value={state.search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search treatments"
          className="w-full rounded-sm border border-rule/70 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
      </label>

      <div className="space-y-3">
        {groups.map((group) => {
          const isOpen = expanded.has(group.category);
          const consults = group.treatments.filter((t) => t.isConsultation);
          const rest = group.treatments.filter((t) => !t.isConsultation);
          const ordered = [...consults, ...rest];

          return (
            <section
              key={group.category}
              className="overflow-hidden rounded-sm border border-rule/60"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between bg-ivory px-4 py-3 text-left"
                aria-expanded={isOpen}
                onClick={() => onToggleCategory(group.category)}
              >
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
                  {group.label}
                </span>
                <span className="text-xs text-silver">{isOpen ? "Hide" : "Show"}</span>
              </button>
              {isOpen ? (
                <ul className="divide-y divide-rule/40 bg-white">
                  {ordered.map((treatment) => {
                    const added = state.selectedTreatmentKeys.includes(
                      treatment.key,
                    );
                    return (
                      <li
                        key={treatment.key}
                        className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                          added ? "bg-ivory/70 ring-1 ring-inset ring-rose" : ""
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-ink">
                              {treatment.displayName}
                            </p>
                            {treatment.isConsultation ? (
                              <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
                                Consultation
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-light text-silver">
                            {treatment.shortDescription}
                          </p>
                          {treatment.durationCopy ? (
                            <p className="mt-2 text-xs text-silver">
                              {treatment.durationCopy}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleTreatment(treatment.key)}
                          aria-pressed={added}
                          aria-label={`${added ? "Remove" : "Add"} ${treatment.displayName}`}
                          className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.16em] ${
                            added
                              ? "border-ink bg-ink text-white"
                              : "border-rose bg-rose text-white"
                          }`}
                        >
                          {added ? "✓ Added" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
        {groups.length === 0 ? (
          <p className="text-sm text-silver" role="status">{loading ? "Loading treatments…" : "No treatments match that search."}</p>
        ) : null}
      </div>
    </div>
  );
}
