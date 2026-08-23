#!/usr/bin/env npx tsx
/**
 * Scan a local folder of Rella before/after pairs and update manifest.json.
 *
 * Usage:
 *   npm run visualizer:sync-references -- --source ~/Drive/Rella-BA
 *   npm run visualizer:sync-references -- --source ./imports --treatment botox
 *
 * Expected filenames (same folder or treatment subfolders):
 *   case-01-before.jpg + case-01-after.jpg
 *   botox/case-02-before.png + botox/case-02-after.png
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, extname, join, relative } from "path";
import type { TreatmentType, TreatmentZoneId } from "../src/lib/visualizer/types";
import { getDefaultZonesForTreatment } from "../src/lib/visualizer/treatments";

const ROOT = join(process.cwd(), "data/visualizer-references");
const MANIFEST_PATH = join(ROOT, "manifest.json");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

interface CliArgs {
  source: string;
  treatment?: TreatmentType;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let source = "";
  let treatment: TreatmentType | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--source" && args[i + 1]) {
      source = args[++i];
    } else if (args[i] === "--treatment" && args[i + 1]) {
      const value = args[++i];
      if (value === "botox" || value === "laser-pigmentation" || value === "laser") {
        treatment = value === "laser" ? "laser-pigmentation" : value;
      }
    }
  }

  if (!source) {
    console.error("Usage: npm run visualizer:sync-references -- --source <folder> [--treatment botox|laser]");
    process.exit(1);
  }

  return { source, treatment };
}

function inferTreatmentType(relPath: string, fallback?: TreatmentType): TreatmentType {
  const lower = relPath.toLowerCase();
  if (lower.includes("laser") || lower.includes("ipl") || lower.includes("pigment")) {
    return "laser-pigmentation";
  }
  if (lower.includes("botox") || lower.includes("dysport") || lower.includes("inject")) {
    return "botox";
  }
  return fallback ?? "botox";
}

function walkImages(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkImages(full));
    } else if (IMAGE_EXT.has(extname(entry).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function parsePair(filename: string): { caseId: string; side: "before" | "after" } | null {
  const base = basename(filename, extname(filename));
  const beforeMatch = base.match(/^(.+)-before$/i);
  if (beforeMatch) return { caseId: beforeMatch[1], side: "before" };
  const afterMatch = base.match(/^(.+)-after$/i);
  if (afterMatch) return { caseId: afterMatch[1], side: "after" };
  return null;
}

function main(): void {
  const { source, treatment: defaultTreatment } = parseArgs();
  const images = walkImages(source);

  const pairs = new Map<
    string,
    { before?: string; after?: string; treatmentType: TreatmentType; relDir: string }
  >();

  for (const file of images) {
    const parsed = parsePair(file);
    if (!parsed) continue;

    const rel = relative(source, file);
    const relDir = relative(source, join(file, ".."));
    const treatmentType = inferTreatmentType(rel, defaultTreatment);
    const key = `${treatmentType}::${relDir}::${parsed.caseId}`;

    const entry = pairs.get(key) ?? { treatmentType, relDir };
    if (parsed.side === "before") entry.before = file;
    else entry.after = file;
    pairs.set(key, entry);
  }

  mkdirSync(ROOT, { recursive: true });
  mkdirSync(join(ROOT, "botox"), { recursive: true });
  mkdirSync(join(ROOT, "laser-pigmentation"), { recursive: true });

  const references: Array<{
    id: string;
    treatmentType: TreatmentType;
    zones: TreatmentZoneId[];
    beforePath: string;
    afterPath: string;
    consentOnFile: boolean;
  }> = [];

  for (const [key, pair] of pairs) {
    if (!pair.before || !pair.after) {
      console.warn(`Skipping incomplete pair: ${key}`);
      continue;
    }

    const caseId = key.split("::").pop() ?? "case";
    const safeId = caseId.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const treatmentFolder = pair.treatmentType;
    const destBefore = join(treatmentFolder, `${safeId}-before${extname(pair.before)}`);
    const destAfter = join(treatmentFolder, `${safeId}-after${extname(pair.after)}`);

    const beforeBuf = readFileSync(pair.before);
    const afterBuf = readFileSync(pair.after);
    writeFileSync(join(ROOT, destBefore), beforeBuf);
    writeFileSync(join(ROOT, destAfter), afterBuf);

    references.push({
      id: `${treatmentFolder}-${safeId}`,
      treatmentType: pair.treatmentType,
      zones: getDefaultZonesForTreatment(pair.treatmentType),
      beforePath: destBefore,
      afterPath: destAfter,
      consentOnFile: true,
    });

    console.log(`Imported ${pair.treatmentType}/${safeId}`);
  }

  const manifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    references,
  };

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nDone. ${references.length} pair(s) → ${MANIFEST_PATH}`);
  console.log("Next: npm run visualizer:distill-references");
}

main();
