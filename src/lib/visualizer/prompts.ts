import type { IntensityPreset, TreatmentType, TreatmentZoneId } from "./types";
import { getZonesForTreatment, isValidTreatmentZone } from "./treatments";

import { RELLA_BRAND } from "./brand";

export const RELLA_SYSTEM_PROMPT = `You are an AI conversion assistant for ${RELLA_BRAND.name}, a physician-led med spa at ${RELLA_BRAND.site} with locations in ${RELLA_BRAND.locations}.

Your job is to help turn interested visitors into booked consultations at Rella by:
1. Explaining treatments in clear, reassuring language.
2. Helping patients visualize possible outcomes in a realistic, clinically responsible way.
3. Asking a short intake sequence to understand goals, concerns, budget, and timing.
4. Qualifying the lead based on intent, readiness, and treatment fit.
5. Recommending the best next step and encouraging booking.
6. Following up politely if the patient does not book right away.

Tone:
- Warm, premium, confident, and medically responsible
- Never pushy or hypey
- Avoid guaranteeing results
- Emphasize natural-looking outcomes, patient safety, and realistic expectations`;

const BOTOX_ZONE_INSTRUCTIONS: Record<IntensityPreset, Record<string, string>> = {
  subtle: {
    forehead:
      "reduce the depth of horizontal forehead creases so they look ~40% softer at rest — still present, clearly quieter",
    glabella:
      "reduce vertical frown lines (11s) by ~40% so the brow looks less tense",
    "crows-feet":
      "reduce crow's feet depth by ~40% without changing eye shape",
  },
  moderate: {
    forehead:
      "meaningfully flatten horizontal forehead creases (~60–70% softer at rest) while keeping natural brow movement",
    glabella:
      "meaningfully flatten vertical frown lines / 11s (~60–70% softer)",
    "crows-feet":
      "meaningfully soften crow's feet (~60–70%) without plastic skin or changed eye shape",
  },
};

const LASER_PIGMENTATION_ZONE_INSTRUCTIONS: Record<
  IntensityPreset,
  Record<string, string>
> = {
  subtle: {
    cheeks:
      "fade visible sun spots and uneven cheek discoloration by about 25–35%",
    "forehead-spots":
      "fade brown sun spots on the forehead by about 25–35%",
    perioral:
      "fade melasma or pigmentation around the mouth by about 25–35%",
    "overall-tone":
      "even mottled tone and sun damage across the face by about 20–30%, without changing natural base skin color",
  },
  moderate: {
    cheeks:
      "clearly fade sun spots and cheek discoloration by about 40–55%",
    "forehead-spots":
      "clearly fade forehead sun spots by about 40–55%",
    perioral:
      "clearly fade perioral pigmentation by about 40–55%",
    "overall-tone":
      "clearly even overall facial tone by about 35–50%, without bleaching or changing ethnicity",
  },
};

const INTENSITY_MODIFIER: Record<IntensityPreset, string> = {
  subtle:
    "Intensity: SUBTLE clinic preview — change must be noticeable when sliding before/after, but still natural.",
  moderate:
    "Intensity: MORE VISIBLE clinic preview — stronger treatment effect, still realistic, never filtered or frozen.",
};

function zoneIdsForPrompt(treatmentType: TreatmentType): string {
  return getZonesForTreatment(treatmentType)
    .map((z) => `"${z.id}"`)
    .join(" | ");
}

export function buildAnalysisPrompt(treatmentType: TreatmentType): string {
  const zoneIds = zoneIdsForPrompt(treatmentType);
  const treatmentLabel =
    treatmentType === "botox"
      ? "neuromodulator (Botox/Dysport) lines"
      : "laser/IPL pigmentation and sun damage";

  return `Analyze this selfie for Rella Aesthetics' conservative medical aesthetics preview tool on experiencerella.com.
The patient is exploring ${treatmentLabel}.

Return ONLY valid JSON with this shape:
{
  "quality": "good" | "fair" | "poor",
  "faceDetected": boolean,
  "zones": [${zoneIds}],
  "notes": "brief guidance for the patient about photo quality or positioning",
  "regions": {
    "<zone-id>": { "cx": 0.0-1.0, "cy": 0.0-1.0, "rx": 0.0-1.0, "ry": 0.0-1.0 }
  }
}

cx/cy are normalized center coordinates. rx/ry are normalized radii.
Only include regions you can confidently locate. Prefer conservative regions.
If no face is detected, set faceDetected to false and quality to "poor".`;
}

function zoneInstructions(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset
): string {
  const map =
    treatmentType === "botox"
      ? BOTOX_ZONE_INSTRUCTIONS[intensity]
      : LASER_PIGMENTATION_ZONE_INSTRUCTIONS[intensity];

  return zones.map((zone) => `- ${map[zone] ?? `address ${zone} conservatively`}`).join("\n");
}

export function buildEditPrompt(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  referenceStyle?: string
): string {
  const zoneLines = zoneInstructions(treatmentType, zones, intensity);
  const referenceBlock = referenceStyle
    ? `\nMatch the conservative outcome style of real ${RELLA_BRAND.name} patient results:\n${referenceStyle}\n`
    : "";

  const geometryLock = `GEOMETRY & LIGHTING LOCK (critical):
- Keep the EXACT same camera framing, face position, scale, and head pose — pixel-aligned with the original
- Keep the EXACT same lighting direction, shadows, highlights, white balance, and exposure
- Do NOT relight, beautify, add makeup, change background, or apply a global filter
- Do NOT smooth skin outside the treatment zones; keep pores and natural texture`;

  if (treatmentType === "botox") {
    return `Edit this photo for a Rella Aesthetics Botox/Dysport simulation.

In the masked treatment areas ONLY, reduce expression lines:
${zoneLines}

${INTENSITY_MODIFIER[intensity]}
${referenceBlock}
${geometryLock}

Additional rules:
- Preserve exact facial identity, bone structure, hair, and skin tone
- Do not change lip volume, cheek fullness, jawline, or eye size
- Soften creases/folds — do not replace the face with a beauty filter
- Result must look like a real clinic neuromodulator preview`;
  }

  return `Edit this photo for a Rella Aesthetics laser/IPL pigmentation simulation.

In the masked treatment areas ONLY, reduce pigmentation:
${zoneLines}

${INTENSITY_MODIFIER[intensity]}
${referenceBlock}
${geometryLock}

Additional rules:
- Preserve exact facial identity and natural base skin color / ethnicity
- Fade spots and mottling — do not airbrush or plastic-smooth the whole face
- Keep realistic pores and texture outside treated pigment
- Result must look like a real clinic laser series preview, not a filter`;
}

export function parseAnalysisZones(
  treatmentType: TreatmentType,
  rawZones: unknown
): TreatmentZoneId[] {
  if (!Array.isArray(rawZones)) return [];
  return rawZones.filter((z): z is TreatmentZoneId =>
    isValidTreatmentZone(treatmentType, String(z))
  );
}
