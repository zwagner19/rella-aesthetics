"use client";

export function ProviderStep({
  providerDisplayName,
}: {
  providerDisplayName?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Provider
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          {providerDisplayName
            ? "This service names a provider in the live catalog."
            : "The live catalog does not name a provider for this service. Continue to choose a time."}
        </p>
      </div>
      {providerDisplayName ? (
        <p className="rounded-sm border border-rule/70 bg-white px-4 py-4 font-medium text-ink">
          {providerDisplayName}
        </p>
      ) : null}
    </div>
  );
}
