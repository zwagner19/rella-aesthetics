"use client";

import {
  treatmentsByCategory,
} from "@/lib/guided-booking";
import type { BookingLocation } from "@/lib/booking-routes";
import type { GuidedBookingState } from "@/lib/guided-booking";
import { packageMenuDescription, packageMenuLabel, type PackageOffering } from "@/lib/guided-booking/package-client";
import { getGuidedLocation } from "@/lib/guided-booking/catalog";
import { TreatmentDetails } from "../TreatmentDetails";

export function TreatmentsStep({
  locationSlug,
  state,
  loading = false,
  onSearch,
  onToggleCategory,
  onToggleTreatment,
  packageOfferings = [],
  packagesLoading = false,
  packageError,
  onBuyPackage,
  onBookPackage,
}: {
  locationSlug: BookingLocation;
  state: GuidedBookingState;
  loading?: boolean;
  onSearch: (value: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleTreatment: (key: string) => void;
  packageOfferings?: PackageOffering[];
  packagesLoading?: boolean;
  packageError?: string | null;
  onBuyPackage?: (packageId: string) => void;
  onBookPackage?: () => void;
}) {
  const groups = treatmentsByCategory(locationSlug, state.search, state.treatments);
  const query = state.search.trim().toLowerCase();
  const offers = packageOfferings.filter(offering => !query || `${offering.displayName} ${offering.description}`.toLowerCase().includes(query));
  const showPackageActions = Boolean(onBuyPackage || onBookPackage) && (!query || offers.length > 0 || "book from my package".includes(query));
  if (showPackageActions && !groups.some(group => group.category === "Packages")) groups.push({ category: "Packages", label: "Packages", treatments: [] });
  // Default: all Boulevard categories collapsed after location — expand on tap.
  const expanded = new Set(state.expandedCategories);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose a treatment
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Open “What’s this treatment?” to learn more. Use Add to choose one or
          more treatments for your visit.
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
                  {group.category === "Packages" && showPackageActions ? <>
                    {onBookPackage ? <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1"><p className="font-medium text-ink">Already have a package?</p><p className="mt-1 text-sm font-light text-silver">Verify your account to find a covered treatment and book your appointment.</p></div>
                      <button type="button" disabled={loading} onClick={onBookPackage} className="shrink-0 rounded-full border border-rose bg-rose px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50">Book from my package</button>
                    </li> : null}
                    {packagesLoading ? <li className="p-4 text-sm text-silver" role="status">Loading packages…</li> : null}
                    {packageError ? <li className="p-4 text-sm text-rose" role="alert">{packageError}</li> : null}
                    {offers.length ? <li className="p-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/60">Buy a new package</li> : null}
                    {offers.map(offering => <li key={`purchase-${offering.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 px-3 py-2" data-package-offer="true">
                      <TreatmentDetails key={`${locationSlug}/${offering.id}`} name={packageMenuLabel(offering.displayName)} description={packageMenuDescription(offering)} kind="package" />
                      {offering.reviewRequired ? <a href={getGuidedLocation(locationSlug)?.phoneHref} className="inline-flex min-h-11 items-center justify-center justify-self-end rounded-full border border-rose bg-rose px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white">Call to purchase</a>
                        : <button type="button" disabled={loading} onClick={() => onBuyPackage?.(offering.id)} aria-label={`Buy ${packageMenuLabel(offering.displayName)}`} className="min-h-11 justify-self-end rounded-full border border-rose bg-rose px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50">Buy</button>}
                    </li>)}
                    {ordered.length ? <li className="p-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/60">Book a package treatment</li> : null}
                  </> : null}
                  {ordered.map((treatment) => {
                    const added = state.selectedTreatmentKeys.includes(
                      treatment.key,
                    );
                    return (
                      <li
                        key={treatment.key}
                        className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 px-3 py-2 ${
                          added ? "bg-ivory/70 ring-1 ring-inset ring-rose" : ""
                        }`}
                      >
                        <TreatmentDetails name={treatment.displayName} description={treatment.shortDescription}
                          duration={treatment.durationCopy} consultation={treatment.isConsultation} />
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => onToggleTreatment(treatment.key)}
                          aria-pressed={added}
                          aria-label={`${added ? "Remove" : "Add"} ${treatment.displayName}`}
                          className={`min-h-11 justify-self-end rounded-full border px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.16em] ${
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
