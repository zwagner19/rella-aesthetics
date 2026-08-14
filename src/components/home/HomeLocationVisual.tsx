"use client";

import Image from "next/image";
import { useState } from "react";

export const HOME_LOCATION_VISUALS = [
  {
    slug: "napa",
    name: "Napa",
    address: "1541 3rd St",
    image: null,
    imageAlt: null,
  },
  {
    slug: "vacaville",
    name: "Vacaville",
    address: "542 Main St",
    image: "/images/clinic/vacaville-treatment-room.jpg",
    imageAlt: "A treatment room inside Rella Aesthetics",
  },
] as const;

export type HomeLocationSlug = (typeof HOME_LOCATION_VISUALS)[number]["slug"];

interface HomeLocationVisualProps {
  initialLocation?: HomeLocationSlug;
}

export function HomeLocationVisual({
  initialLocation = "vacaville",
}: HomeLocationVisualProps) {
  const [activeLocation, setActiveLocation] = useState<HomeLocationSlug>(initialLocation);
  const activeVisual =
    HOME_LOCATION_VISUALS.find((location) => location.slug === activeLocation) ??
    HOME_LOCATION_VISUALS[0];

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-white text-rose">
      <div className="relative min-h-[340px] flex-1 md:min-h-[520px]">
        {activeVisual.image && activeVisual.imageAlt ? (
          <Image
            key={activeVisual.slug}
            src={activeVisual.image}
            alt={activeVisual.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-blush px-8 text-center">
            <Image
              src="/brand/rella-logo-rose.svg"
              alt=""
              width={190}
              height={78}
              className="h-auto w-[150px] md:w-[190px]"
            />
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-rose">
              Rella Aesthetics Napa
            </p>
            <p className="mt-2 text-sm text-rose">
              Downtown Napa
            </p>
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 bg-white/90 px-5 py-4 md:px-7"
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose">
            {activeVisual.name}
          </p>
          <p className="mt-1 text-sm text-rose">{activeVisual.address}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-rose/25 bg-white/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-rose">
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
                    ? "border-rose bg-rose text-white"
                    : "border-rose bg-white text-rose hover:bg-rose hover:text-white"
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
