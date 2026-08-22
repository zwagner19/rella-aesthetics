export type IntensityPreset = "subtle" | "moderate";

export type BotoxZone = "forehead" | "glabella" | "crows-feet";

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
  zones: BotoxZone[];
  notes: string;
  regions?: Partial<Record<BotoxZone, MaskRegion>>;
}

export interface VisualizerSession {
  sessionId: string;
  zones: BotoxZone[];
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
  zones: BotoxZone[];
  intensity: IntensityPreset;
  goal?: string;
  timeline?: string;
  budget?: string;
  consent: boolean;
}
