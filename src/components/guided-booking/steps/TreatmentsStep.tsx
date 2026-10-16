"use client";

import { groupServices, visibleServiceDescription } from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";
import type { LiveCatalogClinic } from "@/lib/guided-booking";

export function TreatmentsStep({
  clinic,
  state,
  loading,
  onSearch,
  onToggleCategory,
  onToggleTreatment,
}: {
  clinic: LiveCatalogClinic | null;
  state: GuidedBookingState;
  loading: boolean;
  onSearch: (value: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleTreatment: (serviceSlug: string) => void;
}) {
  const groups = groupServices(state.services, state.search);
  const expanded = new Set(state.expandedCategories);
  const searching = state.search.trim().length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose a treatment
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          {clinic
            ? `Services offered at ${clinic.locationName}. Open a group to choose one.`
            : "Services load from the live booking catalog for this clinic."}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-silver" role="status">
          Loading the live menu…
        </p>
      ) : null}

      {state.catalogError ? (
        <p className="text-sm text-rose" role="alert">
          {state.catalogError}
        </p>
      ) : null}

      {clinic && !loading && !state.catalogError ? (
        <label className="block">
          <span className="sr-only">Search treatments</span>
          <input
            type="search"
            value={state.search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search treatments"
            className="w-full rounded-sm border border-rule/70 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
          />
        </label>
      ) : null}

      <div className="space-y-3">
        {groups.map((group) => {
          const isOpen = searching || expanded.has(group.category);
          const countLabel =
            group.services.length === 1
              ? "1 service"
              : `${group.services.length} services`;
          return (
            <section
              key={group.category}
              className="overflow-hidden rounded-sm border border-rule/60"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 bg-ivory px-4 py-3 text-left"
                aria-expanded={isOpen}
                onClick={() => {
                  if (!searching) onToggleCategory(group.category);
                }}
              >
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
                  {group.category}
                </span>
                <span className="text-xs text-silver">
                  {countLabel}
                  <span className="px-1.5" aria-hidden="true">
                    ·
                  </span>
                  {searching ? "Matches" : isOpen ? "Hide" : "Show"}
                </span>
              </button>
              {isOpen ? (
                <ul className="divide-y divide-rule/40 bg-white">
                  {group.services.map((service) => {
                    const added = state.selectedServiceSlug === service.serviceSlug;
                    const description = visibleServiceDescription(service.description);
                    return (
                      <li
                        key={service.serviceSlug}
                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-ink">{service.displayName}</p>
                            {service.bookingMode === "CONSULT_FIRST" ? (
                              <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
                                Consultation
                              </span>
                            ) : null}
                          </div>
                          {description ? (
                            <p className="mt-1 text-sm font-light text-silver">
                              {description}
                            </p>
                          ) : null}
                          {service.durationCopy ? (
                            <p className="mt-2 text-xs text-silver">{service.durationCopy}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleTreatment(service.serviceSlug)}
                          className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.16em] ${
                            added
                              ? "border-ink bg-ink text-white"
                              : "border-rose bg-rose text-white"
                          }`}
                        >
                          {added ? "Added" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
        {clinic && !loading && groups.length === 0 && !state.catalogError ? (
          <p className="text-sm text-silver">
            {state.search.trim()
              ? "No treatments match that search."
              : "No bookable services were returned for this clinic."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
