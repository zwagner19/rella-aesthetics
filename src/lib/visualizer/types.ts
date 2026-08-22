export type IntensityPreset = "subtle" | "moderate";

export type TreatmentType = "botox" | "laser-pigmentation";

export type BotoxZone = "forehead" | "glabella" | "crows-feet";

/** Laser / IPL pigmentation concern areas. */
export type LaserPigmentationZone =
  | "cheeks"
  | "forehead-spots"
  | "perioral"
  | "overall-tone";

export type TreatmentZoneId = BotoxZone | LaserPigmentationZone;

export type PhotoQuality = "good" | "fair" | "poor";

export interface MaskRegion {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface FaceAnalysis {
  quality: PhotoQuality;
  faceDetected: boolean;
  treatmentType: TreatmentType;
  zones: TreatmentZoneId[];
  notes: string;
  regions?: Partial<Record<TreatmentZoneId, MaskRegion>>;
}

export interface VisualizerSession {
  sessionId: string;
  treatmentType: TreatmentType;
  zones: TreatmentZoneId[];
  intensity: IntensityPreset;
  goal?: string;
  timeline?: string;
  budget?: string;
}

export interface GenerateResult {
  beforeDataUrl: string;
  afterDataUrl: string;
  sessionId: string;
  mode: "live" | "demo";
  disclaimer: string;
}

export interface VisualizerLeadPayload {
  sessionId: string;
  name: string;
  email?: string;
  phone?: string;
  treatmentType: TreatmentType;
  zones: TreatmentZoneId[];
  intensity: IntensityPreset;
  goal?: string;
  timeline?: string;
  budget?: string;
  consent: boolean;
}
