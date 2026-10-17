"use client";

import type { GuidedProviderGroup } from "@/lib/guided-booking";

export function ProviderStep({
  groups,
  selectedIds,
  loading,
  onSelect,
}: {
  groups: Array<GuidedProviderGroup & { displayName: string }>;
  selectedIds: Record<string, string>;
  loading: boolean;
  onSelect: (treatmentKey: string, id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose a provider
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Choose any available provider or a preferred provider for each
          treatment. We’ll find times that work for your complete visit.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-silver" role="status">
          Loading providers…
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.treatmentKey} className="space-y-3">
            <h4 className="font-medium text-ink">{group.displayName}</h4>
            <ul className="space-y-3">
          {group.providers.map((provider) => {
            const active = selectedIds[group.treatmentKey] === provider.id;
            return (
              <li key={provider.id}>
                <button
                  type="button"
                  onClick={() => onSelect(group.treatmentKey, provider.id)}
                  aria-pressed={active}
                  aria-label={`${provider.displayName} for ${group.displayName}`}
                  className={`flex w-full items-start gap-3 rounded-sm border px-4 py-4 text-left ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-rule/70 bg-white hover:border-ink/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active ? "bg-white/15 text-white" : "bg-ivory text-ink"
                    }`}
                    aria-hidden
                  >
                    {provider.anyAvailable
                      ? "Any"
                      : provider.displayName
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                  </span>
                  <span>
                    <span className="block font-medium">
                      {provider.displayName}
                    </span>
                    {provider.credentials ? (
                      <span
                        className={`mt-1 block text-sm font-light ${
                          active ? "text-white/75" : "text-silver"
                        }`}
                      >
                        {provider.credentials}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
