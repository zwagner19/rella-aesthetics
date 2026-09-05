import { describe, expect, it } from "vitest";
import { getSanityStudioUrl } from "./sanity-studio-url";

describe("getSanityStudioUrl", () => {
  it("accepts only an HTTPS Sanity-hosted Studio", () => {
    expect(getSanityStudioUrl("https://rella.sanity.studio/desk")).toBe(
      "https://rella.sanity.studio/desk",
    );
  });

  it.each([
    undefined,
    "",
    "http://rella.sanity.studio",
    "https://sanity.studio",
    "https://rella.sanity.studio.evil.example",
    "https://user:pass@rella.sanity.studio",
    "https://rella.sanity.studio:8443",
    "not-a-url",
  ])("rejects an unsafe or invalid target: %s", (value) => {
    expect(getSanityStudioUrl(value)).toBeNull();
  });

  it("drops fragments before redirecting", () => {
    expect(getSanityStudioUrl("https://rella.sanity.studio/desk#secret")).toBe(
      "https://rella.sanity.studio/desk",
    );
  });
});
