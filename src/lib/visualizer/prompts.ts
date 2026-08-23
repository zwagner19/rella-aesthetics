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

const BOTOX_ZONE_INSTRUCTIONS: Record<string, string> = {
  forehead:
    "soften horizontal forehead lines by approximately 10–20%, keeping natural forehead movement",
  glabella:
    "soften vertical frown lines between the eyebrows by approximately 10–20%",
  "crows-feet":
    "soften fine lines at the outer eye corners by approximately 10–20%, without changing eye shape",
};

const LASER_PIGMENTATION_ZONE_INSTRUCTIONS: Record<string, string> = {
  cheeks:
    "subtly reduce visible sun spots, melasma patches, and uneven discoloration on the cheeks by approximately 15–25%",
  "forehead-spots":
    "subtly fade brown sun spots and uneven pigmentation on the forehead by approximately 15–25%",
  perioral:
    "subtly reduce melasma or pigmentation around the mouth and upper lip area by approximately 15–25%",
  "overall-tone":
    "subtly even overall facial skin tone and reduce visible sun damage by approximately 10–20%, without changing natural skin tone",
};

const INTENSITY_MODIFIER: Record<IntensityPreset, string> = {
  subtle: "Make the change very subtle — barely noticeable, clinic-realistic preview only.",
  moderate: "Make a moderate but still natural change — never dramatic or filtered-looking.",
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
  zones: TreatmentZoneId[]
): string {
  const map =
    treatmentType === "botox"
      ? BOTOX_ZONE_INSTRUCTIONS
      : LASER_PIGMENTATION_ZONE_INSTRUCTIONS;

  return zones.map((zone) => `- ${map[zone] ?? `address ${zone} conservatively`}`).join("\n");
}

export function buildEditPrompt(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[],
  intensity: IntensityPreset,
  referenceStyle?: string
): string {
  const zoneLines = zoneInstructions(treatmentType, zones);
  const referenceBlock = referenceStyle
    ? `\nMatch the conservative outcome style of real ${RELLA_BRAND.name} patient results:\n${referenceStyle}\n`
    : "";

  if (treatmentType === "botox") {
    return `Edit this patient's photo conservatively for a Rella Aesthetics neuromodulator (Botox/Dysport) simulation.

Apply ONLY to the masked treatment areas:
${zoneLines}

${INTENSITY_MODIFIER[intensity]}
${referenceBlock}
Critical rules:
- Preserve exact facial identity, bone structure, hair, lighting, and skin tone
- Do not change lip volume, cheek fullness, jawline, or eye size
- Result must look natural and clinic-appropriate — not filtered, not plastic
- Do not make the person look more than 3 years younger
- No makeup changes, no skin smoothing outside treatment zones`;
  }

  return `Edit this patient's photo conservatively for a Rella Aesthetics laser/IPL pigmentation treatment simulation.

Apply ONLY to the masked treatment areas:
${zoneLines}

${INTENSITY_MODIFIER[intensity]}
${referenceBlock}
Critical rules:
- Preserve exact facial identity, bone structure, hair, lighting, and natural skin tone
- Reduce the appearance of hyperpigmentation, sun spots, and melasma — do NOT lighten overall ethnicity or base skin color
- Keep realistic skin texture and pores — avoid plastic smoothing or beauty-filter look
- Do not remove freckles entirely unless they fall inside obvious sun-spot clusters
- Do not change lip color, eye color, or facial features
- Result must look like a conservative clinic preview after a series of treatments, not a filter`;
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
