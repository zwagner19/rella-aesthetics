import { RELLA_BRAND } from "./brand";
import type { VisualizerLeadPayload } from "./types";

export interface LeadScoreResult {
  score: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}

const TIMELINE_SCORES: Record<string, number> = {
  "within-2-weeks": 3,
  "within-1-month": 2,
  "exploring": 1,
};

const BUDGET_SCORES: Record<string, number> = {
  "ready-to-invest": 2,
  "moderate": 1,
  "exploring-budget": 0,
};

export function scoreVisualizerLead(payload: VisualizerLeadPayload): LeadScoreResult {
  let score = 2;

  if (payload.zones.length >= 2) score += 1;
  if (payload.intensity === "moderate") score += 0;

  const timelineScore = TIMELINE_SCORES[payload.timeline ?? ""] ?? 0;
  const budgetScore = BUDGET_SCORES[payload.budget ?? ""] ?? 0;
  score += timelineScore + budgetScore;

  const clamped = Math.min(5, Math.max(1, score)) as 1 | 2 | 3 | 4 | 5;

  const tags = [
    "ai-visualizer",
    "interest-botox",
    `lead-score-${clamped}`,
    clamped >= 4 ? "lead-warm" : "lead-cool",
  ];

  return { score: clamped, tags };
}

export function buildLeadSource(payload: VisualizerLeadPayload): string {
  const zones = payload.zones.join(", ");
  const parts = [
    `${RELLA_BRAND.name} AI Visualizer (${RELLA_BRAND.site})`,
    `Session: ${payload.sessionId}`,
    `Zones: ${zones}`,
    `Intensity: ${payload.intensity}`,
  ];
  if (payload.goal) parts.push(`Goal: ${payload.goal}`);
  if (payload.timeline) parts.push(`Timeline: ${payload.timeline}`);
  if (payload.budget) parts.push(`Budget: ${payload.budget}`);
  return parts.join(" | ");
}
