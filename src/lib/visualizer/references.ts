import { readFileSync } from "fs";
import { join } from "path";
import type { TreatmentType, TreatmentZoneId } from "./types";

export interface VisualizerReference {
  id: string;
  treatmentType: TreatmentType;
  zones: TreatmentZoneId[];
  beforePath: string;
  afterPath: string;
  styleNotes?: string;
  intensity?: "subtle" | "moderate";
  consentOnFile: boolean;
}

export interface ReferenceManifest {
  version: number;
  updatedAt: string | null;
  references: VisualizerReference[];
}

const MANIFEST_PATH = join(process.cwd(), "data/visualizer-references/manifest.json");

let cachedManifest: ReferenceManifest | null = null;

export function loadReferenceManifest(): ReferenceManifest {
  if (cachedManifest) return cachedManifest;
  try {
    const raw = readFileSync(MANIFEST_PATH, "utf8");
    cachedManifest = JSON.parse(raw) as ReferenceManifest;
    return cachedManifest;
  } catch {
    return { version: 1, updatedAt: null, references: [] };
  }
}

/** Clear cache — for tests. */
export function resetReferenceManifestCache(): void {
  cachedManifest = null;
}

function zoneOverlapScore(
  requested: TreatmentZoneId[],
  reference: TreatmentZoneId[]
): number {
  const requestedSet = new Set(requested);
  let overlap = 0;
  for (const zone of reference) {
    if (requestedSet.has(zone)) overlap += 1;
  }
  return overlap;
}

export function pickReferenceStyle(
  treatmentType: TreatmentType,
  zones: TreatmentZoneId[]
): string | undefined {
  const manifest = loadReferenceManifest();
  const candidates = manifest.references.filter(
    (ref) => ref.treatmentType === treatmentType && ref.consentOnFile && ref.styleNotes?.trim()
  );
  if (!candidates.length) return undefined;

  const scored = candidates
    .map((ref) => ({
      ref,
      score: zoneOverlapScore(zones, ref.zones),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return undefined;

  return scored[0].ref.styleNotes?.trim();
}

export function referenceCatalogSummary(): {
  total: number;
  withStyleNotes: number;
  byTreatment: Record<TreatmentType, number>;
} {
  const manifest = loadReferenceManifest();
  const byTreatment: Record<TreatmentType, number> = {
    botox: 0,
    "laser-pigmentation": 0,
  };
  let withStyleNotes = 0;
  for (const ref of manifest.references) {
    byTreatment[ref.treatmentType] += 1;
    if (ref.styleNotes?.trim()) withStyleNotes += 1;
  }
  return {
    total: manifest.references.length,
    withStyleNotes,
    byTreatment,
  };
}
