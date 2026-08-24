import type {
  BotoxZone,
  IntensityPreset,
  LaserPigmentationZone,
  MaskRegion,
  TreatmentType,
  TreatmentZoneId,
} from "./types";

export interface TreatmentZone {
  id: TreatmentZoneId;
  label: string;
  description: string;
}

export interface TreatmentOption {
  id: TreatmentType;
  label: string;
  description: string;
  bookingService: string;
  ghlInterestTag: string;
  ghlServiceName: string;
}

export const TREATMENT_OPTIONS: TreatmentOption[] = [
  {
    id: "botox",
    label: "Botox & Dysport",
    description: "Neuromodulators for expression lines — forehead, frown lines, and crow's feet.",
    bookingService: "botox",
    ghlInterestTag: "interest-botox",
    ghlServiceName: "Botox & Dysport",
  },
  {
    id: "laser-pigmentation",
    label: "Laser — Pigmentation",
    description: "IPL and laser treatments to improve sun spots, melasma, and uneven skin tone.",
    bookingService: "laser-treatments",
    ghlInterestTag: "interest-laser-pigmentation",
    ghlServiceName: "Laser Treatments — Pigmentation",
  },
];

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

export const LASER_PIGMENTATION_ZONES: TreatmentZone[] = [
  {
    id: "cheeks",
    label: "Cheek discoloration",
    description: "Sun spots, melasma, or uneven tone on the cheeks.",
  },
  {
    id: "forehead-spots",
    label: "Forehead sun spots",
    description: "Brown spots and sun damage across the forehead.",
  },
  {
    id: "perioral",
    label: "Around the mouth",
    description: "Melasma or pigmentation around the upper lip and chin area.",
  },
  {
    id: "overall-tone",
    label: "Overall uneven tone",
    description: "General sun damage and uneven complexion across the face.",
  },
];

/** Default regions assume a square, face-centered 1024 canvas (cover-cropped selfie). */
const BOTOX_REGIONS: Record<BotoxZone, MaskRegion[]> = {
  forehead: [{ cx: 0.5, cy: 0.28, rx: 0.38, ry: 0.14 }],
  glabella: [{ cx: 0.5, cy: 0.42, rx: 0.12, ry: 0.09 }],
  "crows-feet": [
    { cx: 0.22, cy: 0.46, rx: 0.11, ry: 0.08 },
    { cx: 0.78, cy: 0.46, rx: 0.11, ry: 0.08 },
  ],
};

const LASER_PIGMENTATION_REGIONS: Record<LaserPigmentationZone, MaskRegion[]> = {
  cheeks: [
    { cx: 0.3, cy: 0.55, rx: 0.16, ry: 0.14 },
    { cx: 0.7, cy: 0.55, rx: 0.16, ry: 0.14 },
  ],
  "forehead-spots": [{ cx: 0.5, cy: 0.28, rx: 0.36, ry: 0.12 }],
  perioral: [{ cx: 0.5, cy: 0.68, rx: 0.18, ry: 0.1 }],
  "overall-tone": [{ cx: 0.5, cy: 0.48, rx: 0.4, ry: 0.36 }],
};

/** Edit blend weight: higher = more of the AI edit visible. */
export const INTENSITY_BLEND: Record<IntensityPreset, number> = {
  subtle: 0.92,
  moderate: 0.98,
};

export {
  PHOTO_CONSENT_TEXT,
  VISUALIZER_DISCLAIMER,
} from "./brand";

export const MIN_IMAGE_DIMENSION = 480;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function isValidTreatmentType(value: string): value is TreatmentType {
  return value === "botox" || value === "laser-pigmentation";
}

export function isValidBotoxZone(value: string): value is BotoxZone {
  return value === "forehead" || value === "glabella" || value === "crows-feet";
}

export function isValidLaserPigmentationZone(value: string): value is LaserPigmentationZone {
  return (
    value === "cheeks" ||
    value === "forehead-spots" ||
    value === "perioral" ||
    value === "overall-tone"
  );
}

export function isValidTreatmentZone(
  treatmentType: TreatmentType,
  value: string
): value is TreatmentZoneId {
  switch (treatmentType) {
    case "botox":
      return isValidBotoxZone(value);
    case "laser-pigmentation":
      return isValidLaserPigmentationZone(value);
    default: {
      const _exhaustive: never = treatmentType;
      return _exhaustive;
    }
  }
}

export function getZonesForTreatment(treatmentType: TreatmentType): TreatmentZone[] {
  switch (treatmentType) {
    case "botox":
      return BOTOX_ZONES;
    case "laser-pigmentation":
      return LASER_PIGMENTATION_ZONES;
    default: {
      const _exhaustive: never = treatmentType;
      return _exhaustive;
    }
  }
}

export function getDefaultZonesForTreatment(treatmentType: TreatmentType): TreatmentZoneId[] {
  switch (treatmentType) {
    case "botox":
      return ["forehead", "glabella"];
    case "laser-pigmentation":
      return ["cheeks", "forehead-spots"];
    default: {
      const _exhaustive: never = treatmentType;
      return _exhaustive;
    }
  }
}

export function getDefaultRegionsForZone(zone: TreatmentZoneId): MaskRegion[] {
  if (isValidBotoxZone(zone)) return BOTOX_REGIONS[zone];
  if (isValidLaserPigmentationZone(zone)) return LASER_PIGMENTATION_REGIONS[zone];
  return [];
}

export function getTreatmentOption(treatmentType: TreatmentType): TreatmentOption {
  const option = TREATMENT_OPTIONS.find((t) => t.id === treatmentType);
  if (!option) {
    return TREATMENT_OPTIONS[0];
  }
  return option;
}

export function isValidIntensity(value: string): value is IntensityPreset {
  return value === "subtle" || value === "moderate";
}

export function resolveZoneRegions(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  overrides?: Partial<Record<TreatmentZoneId, MaskRegion>>
): MaskRegion[] {
  const regions: MaskRegion[] = [];
  for (const zone of zones) {
    if (!isValidTreatmentZone(treatmentType, zone)) continue;
    if (overrides?.[zone]) {
      regions.push(overrides[zone]!);
      continue;
    }
    regions.push(...getDefaultRegionsForZone(zone));
  }
  return regions;
}
