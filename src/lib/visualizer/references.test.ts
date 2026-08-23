import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  pickReferenceMatch,
  pickReferenceStyle,
  resetReferenceManifestCache,
} from "@/lib/visualizer/references";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    readFileSync: vi.fn(),
  };
});

import { readFileSync } from "fs";

describe("visualizer references", () => {
  beforeEach(() => {
    resetReferenceManifestCache();
    vi.mocked(readFileSync).mockReset();
  });

  afterEach(() => {
    resetReferenceManifestCache();
  });

  it("returns undefined when manifest has no references", () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ version: 1, updatedAt: null, references: [] })
    );
    expect(pickReferenceStyle("botox", ["forehead"])).toBeUndefined();
    expect(pickReferenceMatch("botox", ["forehead"])).toBeUndefined();
  });

  it("picks best zone overlap and returns style notes", () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        version: 1,
        updatedAt: "2026-01-01",
        references: [
          {
            id: "botox-forehead",
            treatmentType: "botox",
            zones: ["forehead", "glabella"],
            beforePath: "botox/a-before.jpg",
            afterPath: "botox/a-after.jpg",
            styleNotes: "Forehead lines softened subtly.",
            consentOnFile: true,
          },
          {
            id: "laser-cheeks",
            treatmentType: "laser-pigmentation",
            zones: ["cheeks"],
            beforePath: "laser/a-before.jpg",
            afterPath: "laser/a-after.jpg",
            styleNotes: "Cheek spots faded.",
            consentOnFile: true,
          },
        ],
      })
    );

    expect(pickReferenceStyle("botox", ["forehead", "glabella"])).toBe(
      "Forehead lines softened subtly."
    );
    expect(pickReferenceMatch("botox", ["forehead", "glabella"])).toEqual({
      id: "botox-forehead",
      styleNotes: "Forehead lines softened subtly.",
    });
    expect(pickReferenceStyle("laser-pigmentation", ["cheeks"])).toBe("Cheek spots faded.");
  });

  it("falls back to treatment match when requested zones do not overlap", () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        version: 1,
        updatedAt: "2026-01-01",
        references: [
          {
            id: "laser-cheeks",
            treatmentType: "laser-pigmentation",
            zones: ["cheeks", "overall-tone"],
            beforePath: "laser/a-before.jpg",
            afterPath: "laser/a-after.jpg",
            styleNotes: "Cheek spots faded.",
            consentOnFile: true,
          },
        ],
      })
    );

    expect(pickReferenceStyle("laser-pigmentation", ["perioral"])).toBe("Cheek spots faded.");
    expect(pickReferenceMatch("laser-pigmentation", ["perioral"])?.id).toBe("laser-cheeks");
  });
});
