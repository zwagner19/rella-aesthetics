import type { BotoxZone, IntensityPreset, MaskRegion } from "./types";

export interface TreatmentZone {
  id: BotoxZone;
  label: string;
  description: string;
}

export const BOTOX_ZONES: TreatmentZone[] = [
  {
    id: "forehead",
    label: "Forehead lines",
    description: "Horizontal lines across the forehead from expression.",
  },
  {
    id: "glabella",
    label: "Frown lines (11s)",
    description: "Vertical lines between the eyebrows.",
  },
  {
    id: "crows-feet",
    label: "Crow's feet",
    description: "Fine lines at the outer corners of the eyes.",
  },
];

/** Default mask regions as normalized coordinates (0–1). */
export const DEFAULT_ZONE_REGIONS: Record<BotoxZone, MaskRegion[]> = {
  forehead: [{ cx: 0.5, cy: 0.22, rx: 0.34, ry: 0.11 }],
  glabella: [{ cx: 0.5, cy: 0.38, rx: 0.1, ry: 0.07 }],
  "crows-feet": [
    { cx: 0.28, cy: 0.4, rx: 0.09, ry: 0.06 },
    { cx: 0.72, cy: 0.4, rx: 0.09, ry: 0.06 },
  ],
};

/** Edit blend weight: higher = more of the AI edit visible. */
export const INTENSITY_BLEND: Record<IntensityPreset, number> = {
  subtle: 0.65,
  moderate: 0.75,
};

export {
  PHOTO_CONSENT_TEXT,
  VISUALIZER_DISCLAIMER,
} from "./brand";

export const MIN_IMAGE_DIMENSION = 480;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function isValidBotoxZone(value: string): value is BotoxZone {
  return value === "forehead" || value === "glabella" || value === "crows-feet";
}

export function isValidIntensity(value: string): value is IntensityPreset {
  return value === "subtle" || value === "moderate";
}
