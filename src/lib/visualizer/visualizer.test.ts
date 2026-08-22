import { describe, expect, it } from "vitest";
import sharp from "sharp";
import {
  applyDemoTreatmentEffect,
  addSimulationWatermark,
  blendConservative,
} from "@/lib/visualizer/conservative-blend";
import { buildLeadSource, scoreVisualizerLead } from "@/lib/visualizer/lead-scoring";
import { buildEditMaskPng } from "@/lib/visualizer/mask";
import { buildEditPrompt, buildAnalysisPrompt } from "@/lib/visualizer/prompts";
import { INTENSITY_BLEND, isValidBotoxZone } from "@/lib/visualizer/treatments";
import type { VisualizerLeadPayload } from "@/lib/visualizer/types";

describe("visualizer prompts", () => {
  it("builds conservative edit prompt with identity lock language", () => {
    const prompt = buildEditPrompt(["forehead", "glabella"], "subtle");
    expect(prompt).toContain("Preserve exact facial identity");
    expect(prompt).toContain("forehead");
    expect(prompt).toContain("very subtle");
  });

  it("requests JSON-only face analysis schema", () => {
    const prompt = buildAnalysisPrompt();
    expect(prompt).toContain("Return ONLY valid JSON");
    expect(prompt).toContain("faceDetected");
  });
});

describe("visualizer treatments", () => {
  it("validates botox zones", () => {
    expect(isValidBotoxZone("forehead")).toBe(true);
    expect(isValidBotoxZone("invalid")).toBe(false);
  });

  it("uses lower blend weight for subtle preset", () => {
    expect(INTENSITY_BLEND.subtle).toBeLessThan(INTENSITY_BLEND.moderate);
  });
});

describe("visualizer mask", () => {
  it("builds a PNG mask buffer", async () => {
    const mask = await buildEditMaskPng(512, 512, [{ cx: 0.5, cy: 0.3, rx: 0.2, ry: 0.1 }]);
    const meta = await sharp(mask).metadata();
    expect(meta.format).toBe("png");
    expect(meta.width).toBe(512);
    expect(meta.height).toBe(512);
  });
});

describe("conservative blend", () => {
  async function solidImage(r: number, g: number, b: number): Promise<Buffer> {
    return sharp({
      create: { width: 256, height: 256, channels: 3, background: { r, g, b } },
    })
      .png()
      .toBuffer();
  }

  it("blends edited image toward original in masked regions", async () => {
    const original = await solidImage(200, 100, 100);
    const edited = await solidImage(50, 50, 200);
    const result = await blendConservative(original, edited, ["forehead"], "subtle");
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe("png");
    expect(result.length).toBeGreaterThan(1000);
  });

  it("applies demo zone blur without throwing", async () => {
    const original = await solidImage(180, 140, 120);
    const result = await applyDemoTreatmentEffect(original, ["glabella"], "subtle");
    expect(result.length).toBeGreaterThan(1000);
  });

  it("adds simulation watermark", async () => {
    const original = await solidImage(120, 120, 120);
    const result = await addSimulationWatermark(original);
    expect(result.length).toBeGreaterThan(original.length);
  });
});

describe("visualizer lead scoring", () => {
  const basePayload: VisualizerLeadPayload = {
    sessionId: "test-session",
    name: "Jane Doe",
    email: "jane@example.com",
    zones: ["forehead"],
    intensity: "subtle",
    consent: true,
  };

  it("scores warm leads higher", () => {
    const warm = scoreVisualizerLead({
      ...basePayload,
      zones: ["forehead", "glabella", "crows-feet"],
      timeline: "within-2-weeks",
      budget: "ready-to-invest",
    });
    const cool = scoreVisualizerLead({
      ...basePayload,
      timeline: "exploring",
      budget: "exploring-budget",
    });
    expect(warm.score).toBeGreaterThan(cool.score);
    expect(warm.tags).toContain("ai-visualizer");
    expect(warm.tags).toContain("interest-botox");
  });

  it("builds a descriptive GHL source string", () => {
    const source = buildLeadSource({
      ...basePayload,
      goal: "Refresh forehead",
      timeline: "within-1-month",
      budget: "moderate",
    });
    expect(source).toContain("Rella Aesthetics AI Visualizer");
    expect(source).toContain("experiencerella.com");
    expect(source).toContain("test-session");
    expect(source).toContain("Refresh forehead");
  });
});
