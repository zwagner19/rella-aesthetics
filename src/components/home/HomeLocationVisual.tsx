"use client";

import Image from "next/image";
import { useState } from "react";

export const HOME_LOCATION_VISUALS = [
  {
    slug: "napa",
    name: "Napa",
    address: "1541 3rd St",
    image: "/images/service-botox.jpg",
    imageAlt: "A Rella aesthetics treatment in progress",
  },
  {
    slug: "vacaville",
    name: "Vacaville",
    address: "542 Main St",
    image: "/images/service-facials.jpg",
    imageAlt: "A Rella skin-care treatment in progress",
  },
] as const;

export type HomeLocationSlug = (typeof HOME_LOCATION_VISUALS)[number]["slug"];

interface HomeLocationVisualProps {
  initialLocation?: HomeLocationSlug;
}

export function HomeLocationVisual({
  initialLocation = "napa",
}: HomeLocationVisualProps) {
  const [activeLocation, setActiveLocation] = useState<HomeLocationSlug>(initialLocation);
  const activeVisual =
    HOME_LOCATION_VISUALS.find((location) => location.slug === activeLocation) ??
    HOME_LOCATION_VISUALS[0];

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-ink text-white">
      <div className="relative min-h-[340px] flex-1 md:min-h-[520px]">
        <Image
          key={activeVisual.slug}
          src={activeVisual.image}
          alt={activeVisual.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div
          className="absolute inset-x-0 bottom-0 bg-ink/85 px-5 py-4 md:px-7"
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose">
            {activeVisual.name}
          </p>
          <p className="mt-1 text-sm text-white/75">{activeVisual.address}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
          Choose a clinic view
        </p>
        <div className="flex gap-2" role="group" aria-label="Choose a Rella clinic view">
          {HOME_LOCATION_VISUALS.map((location) => {
            const isActive = location.slug === activeVisual.slug;
            return (
              <button
                key={location.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveLocation(location.slug)}
                className={`min-h-11 rounded-full border px-5 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "border-rose bg-rose text-ink"
                    : "border-white/45 bg-transparent text-white hover:border-rose hover:text-rose"
                }`}
              >
                {location.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
