import type { BotoxZone, IntensityPreset } from "./types";

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

const ZONE_EDIT_INSTRUCTIONS: Record<BotoxZone, string> = {
  forehead:
    "soften horizontal forehead lines by approximately 10–20%, keeping natural forehead movement",
  glabella:
    "soften vertical frown lines between the eyebrows by approximately 10–20%",
  "crows-feet":
    "soften fine lines at the outer eye corners by approximately 10–20%, without changing eye shape",
};

const INTENSITY_MODIFIER: Record<IntensityPreset, string> = {
  subtle: "Make the change very subtle — barely noticeable, clinic-realistic preview only.",
  moderate: "Make a moderate but still natural change — never dramatic or filtered-looking.",
};

export function buildAnalysisPrompt(): string {
  return `Analyze this selfie for Rella Aesthetics' conservative medical aesthetics preview tool on experiencerella.com.

Return ONLY valid JSON with this shape:
{
  "quality": "good" | "fair" | "poor",
  "faceDetected": boolean,
  "zones": ["forehead" | "glabella" | "crows-feet"],
  "notes": "brief guidance for the patient about photo quality or positioning",
  "regions": {
    "forehead": { "cx": 0.0-1.0, "cy": 0.0-1.0, "rx": 0.0-1.0, "ry": 0.0-1.0 },
    "glabella": { "cx": 0.0-1.0, "cy": 0.0-1.0, "rx": 0.0-1.0, "ry": 0.0-1.0 },
    "crows-feet": { "cx": 0.0-1.0, "cy": 0.0-1.0, "rx": 0.0-1.0, "ry": 0.0-1.0 }
  }
}

cx/cy are normalized center coordinates. rx/ry are normalized radii.
Only include regions you can confidently locate. Prefer conservative regions.
If no face is detected, set faceDetected to false and quality to "poor".`;
}

export function buildEditPrompt(zones: BotoxZone[], intensity: IntensityPreset): string {
  const zoneInstructions = zones
    .map((zone) => `- ${ZONE_EDIT_INSTRUCTIONS[zone]}`)
    .join("\n");

  return `Edit this patient's photo conservatively for a Rella Aesthetics neuromodulator (Botox/Dysport) simulation.

Apply ONLY to the masked treatment areas:
${zoneInstructions}

${INTENSITY_MODIFIER[intensity]}

Critical rules:
- Preserve exact facial identity, bone structure, hair, lighting, and skin tone
- Do not change lip volume, cheek fullness, jawline, or eye size
- Result must look natural and clinic-appropriate — not filtered, not plastic
- Do not make the person look more than 3 years younger
- No makeup changes, no skin smoothing outside treatment zones`;
}
