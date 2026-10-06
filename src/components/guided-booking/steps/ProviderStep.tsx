"use client";

import type { GuidedProvider } from "@/lib/guided-booking";

export function ProviderStep({
  providers,
  selectedId,
  loading,
  onSelect,
}: {
  providers: GuidedProvider[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Choose a provider
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Any available offers the widest choice of times. Named providers appear
          when Boulevard eligibility is available for this path.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-silver" role="status">
          Loading providers…
        </p>
      ) : (
        <ul className="space-y-3">
          {providers.map((provider) => {
            const active = selectedId === provider.id;
            return (
              <li key={provider.id}>
                <button
                  type="button"
                  onClick={() => onSelect(provider.id)}
                  aria-pressed={active}
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
      )}
    </div>
  );
}
