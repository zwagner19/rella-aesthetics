import Image from "next/image";
import { HOME_LOCATION_VISUALS } from "./home-location-visuals";

type LocationVisual = (typeof HOME_LOCATION_VISUALS)[number];

interface ClinicLocationPhotoProps {
  visual: LocationVisual;
  /** Responsive sizes hint; defaults match dual-column location cards. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * Shared clinic location photography renderer.
 * Serves native assets directly (`unoptimized`) so Next does not upscale /
 * recompress low-ceiling sources into blurry `/_next/image` variants.
 */
export function ClinicLocationPhoto({
  visual,
  sizes = "(min-width: 1024px) 45vw, 100vw",
  priority = false,
  className = "relative mb-8 aspect-[4/5] overflow-hidden bg-oat",
  imageClassName = `object-cover ${visual.imagePosition}`,
}: ClinicLocationPhotoProps) {
  return (
    <div className={className}>
      <Image
        src={visual.image}
        alt={visual.imageAlt}
        fill
        unoptimized
        priority={priority}
        className={imageClassName}
        sizes={sizes}
      />
    </div>
  );
}
