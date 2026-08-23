#!/usr/bin/env npx tsx
/**
 * Analyze Rella before/after pairs and write distilled style notes to manifest.json.
 * Requires OPENAI_API_KEY.
 *
 * Usage: npm run visualizer:distill-references
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";
import type { ReferenceManifest } from "../src/lib/visualizer/references";

const ROOT = join(process.cwd(), "data/visualizer-references");
const MANIFEST_PATH = join(ROOT, "manifest.json");

function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function mimeFromPath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function distillPair(
  client: OpenAI,
  treatmentLabel: string,
  beforeBuf: Buffer,
  beforeMime: string,
  afterBuf: Buffer,
  afterMime: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are calibrating ${treatmentLabel} preview style for Rella Aesthetics (physician-led med spa).

Compare this real before/after pair. Describe ONLY the conservative, clinic-realistic change in 3–5 short bullet points:
- What visibly changed (subtlety level, % estimate)
- What was preserved (identity, skin tone, texture)
- What the result is NOT (no filter, no plastic look)

Be specific and concise. No patient identifiers. No guarantees.`,
          },
          {
            type: "image_url",
            image_url: { url: bufferToDataUrl(beforeBuf, beforeMime) },
          },
          {
            type: "image_url",
            image_url: { url: bufferToDataUrl(afterBuf, afterMime) },
          },
        ],
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as ReferenceManifest;
  if (!manifest.references.length) {
    console.log("No references in manifest. Run visualizer:sync-references first.");
    return;
  }

  const client = new OpenAI({ apiKey });
  let updated = 0;

  for (const ref of manifest.references) {
    if (ref.styleNotes?.trim()) {
      console.log(`Skip ${ref.id} (already distilled)`);
      continue;
    }

    const beforePath = join(ROOT, ref.beforePath);
    const afterPath = join(ROOT, ref.afterPath);
    const beforeBuf = readFileSync(beforePath);
    const afterBuf = readFileSync(afterPath);

    const treatmentLabel =
      ref.treatmentType === "botox" ? "Botox/Dysport" : "laser/IPL pigmentation";

    console.log(`Distilling ${ref.id}…`);
    ref.styleNotes = await distillPair(
      client,
      treatmentLabel,
      beforeBuf,
      mimeFromPath(ref.beforePath),
      afterBuf,
      mimeFromPath(ref.afterPath)
    );
    updated += 1;
  }

  manifest.updatedAt = new Date().toISOString();
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nDone. Distilled ${updated} reference(s).`);
}

void main();
